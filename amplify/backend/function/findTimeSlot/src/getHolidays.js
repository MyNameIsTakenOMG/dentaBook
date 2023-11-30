export const getHolidays = async (
  calendarClient,
  timeMin,
  timeMax,
  numOfResults
) => {
  // fetch events from google calendar api for the specified period of time (timeMin, timeMax)
  // then call the function 'transformHolidays' to transform
  // the events
  // holidays format: {'2023':['2023-09-01',...],...}
  // return the holidays object
  try {
    const request = {
      calendarId: 'en.canadian#holiday@group.v.calendar.google.com',
      timeMin: timeMin,
      timeMax: timeMax,
      maxResults: numOfResults,
    };
    let response = await calendarClient.events.list(request);
    let events = response.data;
    return transformHolidays(events);
  } catch (error) {
    console.log(
      'failed to fetch or transform holidays from google calendar api events',
      error
    );
    throw new Error('failed to get holidays');
  }
};

const transformHolidays = (events) => {
  let holidays = {};
  events.forEach((item) => {
    // using regular expression to filter all statutory holidays in toronto
    if (
      item.summary.match(
        /(Family Day|Good Friday|Victoria Day|Canada Day|Civic|Labour Day|Thanksgiving Day|Christmas Day|Boxing Day \(regional holiday\))/i
      ) ||
      item.summary.match(/^New Year\'s Day$/i)
    ) {
      // create a holiday date object
      let date1 = item.start.date;
      date1 = date1.split('-').map((i, index) => {
        if (index === 1) return parseInt(i) - 1; // month : 0 - 11
        return parseInt(i);
      });
      date1 = new Date(date1[0], date1[1], date1[2]);
      // apply holidays rules to summary
      if (
        item.summary.match(/Canada Day/i) ||
        item.summary.match(/^New Year\'s Day$/i)
      ) {
        // if date.getDay() == 6 || 0, then move it to 1
        if (date1.getDay() === 6) date1.setDate(date1.getDate() + 2);
        else if (date1.getDay() === 0) date1.setDate(date1.getDate() + 1);
      } else if (item.summary.match(/Christmas Day/i)) {
        // if date.getDay() === 6 || 0, then move it to 1
        if (date1.getDay() === 6) date1.setDate(date1.getDate() + 2);
        else if (date1.getDay() === 0) date1.setDate(date1.getDate() + 1);
      } else if (item.summary.match(/Boxing Day \(regional holiday\)/i)) {
        // if date.getDate() ===6 , then move it to 1
        // if date.getDate() ===0 , then move it to 2
        // if date.getDate() ===1, then move it to 2
        if (date1.getDate() === 6) date1.setDate(date1.getDate() + 2);
        else if (date1.getDate() === 0) date1.setDate(date1.getDate() + 2);
        else if (date1.getDate() === 1) date1.setDate(date1.getDate() + 1);
      }
      let year = date1.getFullYear();
      let month = date1.getMonth() + 1;
      let day = date1.getDate();
      if (!holidays[year]) {
        holidays[year] = [];
        holidays[year].push(
          `${year}-${month < 10 ? '0' + month : month}-${
            day < 10 ? '0' + day : day
          }`
        );
      } else
        holidays[year].push(
          `${year}-${month < 10 ? '0' + month : month}-${
            day < 10 ? '0' + day : day
          }`
        );
    }
  });
  console.log('holidays: ', holidays);
  return holidays;
};
