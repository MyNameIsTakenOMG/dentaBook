/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOFTAUTH_ARN
	STORAGE_DYNAMOFTAUTH_NAME
	STORAGE_DYNAMOFTAUTH_STREAMARN
  GOOGLE_CALENDAR_API_KEY
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  BatchGetCommand,
  BatchWriteCommand,
  QueryCommand,
  GetCommand,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');
const { timeslotsFinder } = require('/opt/timeslotsFinder');
const { monitorAndNotify } = require('/opt/monitorAndNotify');
const { calendar } = require('@googleapis/calendar');
const { getHolidays } = require('./getHolidays');

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client, translateConfig);

const apptTypeAndDuration = {
  Emergency: 1.5,
  Cleaning: 1,
  'Dental Implant': 1.5,
  Treatment: 1,
  'Dental Exam': 1,
};

// google calendar client
const cal = calendar({
  version: 'v3',
  auth: process.env.GOOGLE_CALENDAR_API_KEY,
});

//  request body: {type: string, dateString?: string, pickedDate?: string}
// successful response : {availableDate:string, timeslots: {start:string,end:string}[]}

// note: dateString for finding the next available date and time slots,
//  and pickedDate for checking the specified date's availability,
// two cannot exist at the same time.
exports.handler = async (event, context) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let keys = Object.keys(event.body);
    if (keys.length !== 3) {
      console.log('findTimeSlot error: bad request: ' + event.body);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // both dateString and pickedDate are strings of date potion of the given date,
    // for example, "Wed Jul 28 1993"
    let { type, dateString, pickedDate } = event.body;
    if (!(type && dateString && pickedDate)) {
      console.log('findTimeSlot error: bad request: ' + event.body);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // validate the type
    // if type is not one of the specified or not exists in the body
    if (!type || apptTypeAndDuration[type] === undefined) {
      console.log('findTimeSlot error: Invalid appointment type: ' + type);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // if dateString and pickedDate both exist
    if (dateString && pickedDate) {
      console.log('findTimeSlot error: bad request--dateString & pickedDate');
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // validate the dateString and/or pickedDate if exist
    // 1. validate the dateString and/or pickedDate string
    // 2. check if the year potion is either the current year or the next year
    // 3. make sure it is not a past date and time :  < current date
    // 4. **if pickedDate is the current date, then directly return empty timeslots
    if (pickedDate) {
      let j = new Date(pickedDate);
      let i = new Date(new Date().toDateString());
      if (
        j.toDateString() === 'Invalid Date' ||
        j.toDateString() !== pickedDate ||
        (j.getFullYear() !== new Date().getFullYear() &&
          j.getFullYear() !== new Date().getFullYear() + 1) ||
        j.getTime() < i.getTime()
      ) {
        console.log('findTimeSlot error: bad request--pickedDate');
        return {
          statusCode: 400,
          body: 'bad request',
        };
      }
      if (j.getTime() === i.getTime())
        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({
            // targetDate: `${j.getFullYear()}-${
            //   j.getMonth() + 1 < 10
            //     ? '0' + (j.getMonth() + 1)
            //     : j.getMonth() + 1
            // }-${j.getDate() < 10 ? '0' + j.getDate() : j.getDate()}`,
            availableTimeslots: [],
          }),
        };
    }

    if (dateString) {
      let j = new Date(dateString);
      let i = new Date(new Date().toDateString());
      if (
        j.toDateString() === 'Invalid Date' ||
        j.toDateString() !== dateString ||
        (j.getFullYear() !== new Date().getFullYear() &&
          j.getFullYear() !== new Date().getFullYear() + 1) ||
        j.getTime() < i.getTime()
      ) {
        console.log('findTimeSlot error: bad request--dateString');
        return {
          statusCode: 400,
          body: 'bad request',
        };
      }
    }

    // otherwise, gather holidays and vacations information first,
    // then check which one is present, or none is present
    let holidays_merged = [];
    let vacations = [];

    // fetch vacations for current year and next year
    // try to fetch "holidays" from dynamodb table
    let holidaysQuery;
    // if 'pickedDate' is existing
    if (pickedDate) {
      holidaysQuery = new GetCommand({
        TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
        Key: {
          PK: `h#${new Date(pickedDate).getFullYear()}`,
          SK: `h#${new Date(pickedDate).getFullYear()}`,
        },
        ProjectionExpression: 'PK, holidays',
      });
      let response = await docClient.send(holidaysQuery);
      // if there's no according holidays item in the table
      if (!response.Item) {
        // try to fetch holidays from google calendar events api endpoint
        // fetch holidays via calling google calendar api
        let current = new Date(pickedDate);
        current.setMonth(0);
        current.setDate(1);
        let next = new Date(pickedDate);
        next.setMonth(11);
        next.setDate(31);
        let numOfResults = 60;
        // call 'getHolidays' function to get holidays object
        let holidays = await getHolidays(cal, current, next, numOfResults);
        holidays_merged = holidays[new Date(pickedDate).getFullYear()];
        // write the 'holidays' item into the table
        let writeHolidays = new PutCommand({
          TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
          Item: {
            PK: `h#${new Date(pickedDate).getFullYear()}`,
            SK: `h#${new Date(pickedDate).getFullYear()}`,
            entity: 'holiday',
            holidays: holidays[new Date(pickedDate).getFullYear()],
          },
        });
        await docClient.send(writeHolidays);
        console.log('write holidays into the table');
        return {
          statusCode: 500,
          body: 'an error occurred, please try again later',
        };
      }
      // else if there's a holidays item in the table
      else {
        holidays_merged = response.Item['holidays'];
      }
    }
    // if 'pickedDate' not existing --> 'dateString' cound be or be not existing
    else {
      holidaysQuery = new BatchGetCommand({
        RequestItems: {
          [`${process.env.STORAGE_DYNAMOFTAUTH_NAME}`]: {
            Keys: [
              {
                PK: `h#${new Date().getFullYear()}`,
                SK: `h#${new Date().getFullYear()}`,
              },
              {
                PK: `h#${new Date().getFullYear() + 1}`,
                SK: `h#${new Date().getFullYear() + 1}`,
              },
            ],
            ProjectionExpression: 'PK, holidays',
          },
        },
      });
      let responseBatch = await docClient.send(holidaysQuery);
      let items =
        responseBatch.Responses[process.env.STORAGE_DYNAMOFTAUTH_NAME];
      let unprocessed =
        responseBatch.UnprocessedKeys[process.env.STORAGE_DYNAMOFTAUTH_NAME];
      // if successfully fetched holidays from both current year and next year from the table
      // if both items exist in the table
      if (!unprocessed) {
        let current, next, numOfResults;
        // check if there are both items fetched,
        // or return 'an error occurred, please try again later'
        if (items.length === 2) {
          holidays_merged = [...items[0]['holidays'], ...items[1]['holidays']];
        } else {
          if (items.length === 0) {
            current = new Date();
            current.setMonth(0);
            current.setDate(1);
            next = new Date();
            next.setFullYear(current.getFullYear() + 1);
            next.setMonth(11);
            next.setDate(31);
            numOfResults = 120;
          } else if (items.length === 1) {
            current =
              items[0]['PK'] === `h#${new Date().getFullYear()}`
                ? new Date()
                : new Date().setFullYear(new Date().getFullYear() + 1);
            current.setMonth(0);
            current.setDate(1);
            next = new Date();
            next.setFullYear(current.getFullYear());
            next.setMonth(11);
            next.setDate(31);
            numOfResults = 60;
          }
          // call 'getHolidays' function to get holidays object
          let holidays = await getHolidays(cal, current, next, numOfResults);
          let items = Object.keys(holidays).map((key) => ({
            PutRequest: {
              Item: {
                PK: `h#${key}`,
                SK: `h#${key}`,
                entity: 'holiday',
                holidays: holidays[key],
              },
            },
          }));
          let batchWrite = new BatchWriteCommand({
            RequestItems: {
              [`${process.env.STORAGE_DYNAMOFTAUTH_NAME}`]: items,
            },
          });
          await docClient.send(batchWrite);
          console.log('write holidays into the table');
          return {
            statusCode: 500,
            body: 'an error occurred, please try again later',
          };
        }
      }
      // else return 'an error occurred, please try again later.'
      else {
        console.log('failed to batchGet all holidays');
        return {
          statusCode: 500,
          body: 'An error occurred, please try again later.',
        };
      }
    }

    // -----------------------------------------------------------
    // fetch vacations within current and next year
    const vacationsQuery = new QueryCommand({
      TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
      IndexName: 'GSI1-PK',
      KeyConditionExpression:
        'GSI1-PK = :v1 AND ( GSI1-SK >= :v2 AND GSI1-SK <= :v3 )',
      ExpressionAttributeValues: {
        ':v1': 'vacation',
        ':v2': `v#${new Date().getFullYear()}-01-01`,
        ':v3': `v#${new Date().getFullYear() + 1}-12-31`,
      },
      ProjectionExpression: 'vStart, vEnd',
    });
    const responseQuery = await docClient.send(vacationsQuery);
    if (responseQuery.items.length !== 0) vacations = responseQuery.items;

    // --------------------------------------------------------------
    // decide if dateString or pickedDate is present, or none is present
    // validation functions: isSunday, isHoliday, isVacation
    const isSunday = (date1) => {
      return date1.getDay() === 0;
    };
    const isHoliday = (holidays, dateString) => {
      return holidays.find((h) => h === dateString);
    };
    const isVacation = (vacations, prop1, prop2, dateString) => {
      let matchedVacation = false;
      for (let i = 0; i < vacations.length - 1; i++) {
        if (
          vacations[i][prop1] <= dateString &&
          dateString <= vacations[i][prop2]
        ) {
          matchedVacation = true;
          break;
        }
        if (
          vacations[i][prop1] > dateString ||
          dateString < vacations[i][prop2]
        ) {
          continue;
        }
      }
      return matchedVacation;
    };
    const findTimeslots = async (dateString, type) => {
      let targetDate = dateString;
      let availableTimeslots;
      let inputArray = undefined;
      const query = new GetCommand({
        TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
        Key: {
          PK: `d#${dateString}`,
          SK: `d#${dateString}`,
        },
        ProjectionExpression: 'appts',
      });
      const responseGet = await docClient.send(query);
      // if there's some record in the response
      // call the 'timslotsFinder' function
      if (responseGet.item) {
        inputArray = responseGet.Item['appts'];
      }
      availableTimeslots = timeslotsFinder(
        [9, 13],
        [14, 18],
        0.5,
        inputArray,
        apptTypeAndDuration[type]
      );
      return { targetDate, availableTimeslots };
    };
    // if pickedDate exists
    if (pickedDate) {
      let p = new Date(pickedDate);
      let pString = `${p.getFullYear()}-${
        p.getMonth() + 1 < 10 ? '0' + (p.getMonth() + 1) : p.getMonth() + 1
      }-${p.getDate() < 10 ? '0' + p.getDate() : p.getDate()}`;
      let timeslots;
      // if Sunday or holiday or vacation
      if (
        isSunday(p) ||
        isHoliday(holidays_merged, pString) ||
        isVacation(vacations, 'vStart', 'vEnd', pString)
      ) {
        timeslots = [];
      }
      // otherwise then get the picked date appointments,
      // and call timeslotsFinder function
      else {
        let { availableTimeslots } = await findTimeslots(pString, type);
        timeslots = availableTimeslots;
      }
      return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          // targetDate: pString,
          availableTimeslots: timeslots,
        }),
      };
    }

    // if dateString is present or not present
    let startDate;
    if (dateString) startDate = new Date(dateString);
    else startDate = new Date();

    // start from the next day to avoid to book appointments on the current day,
    // also used for finding the next available date
    startDate.setDate(startDate.getDate() + 1);

    let targetDate = null;
    let availableTimeslots = [];

    // start finding the next available date and time slots
    // also make sure that 'startDate' doesn't reach the year after the next year
    while (
      startDate.getFullYear() <= new Date().getFullYear() + 1 &&
      targetDate === null &&
      availableTimeslots.length === 0
    ) {
      let startDateString = `${startDate.getFullYear()}-${
        startDate.getMonth() + 1 < 10
          ? '0' + (startDate.getMonth() + 1)
          : startDate.getMonth() + 1
      }-${
        startDate.getDate() < 10
          ? '0' + startDate.getDate()
          : startDate.getDate()
      }`;
      // skip Sundays or holidays or vacations
      if (
        isSunday(startDate) ||
        isHoliday(holidays_merged, startDateString) ||
        isVacation(vacations, 'vStart', 'vEnd', startDateString)
      ) {
        startDate.setDate(startDate.getDate() + 1);
        continue;
      }

      // fetch all appointments for the current "startDate",
      // and calling 'timeslotsFinder' function to find all available time slots,
      // or move forward by 1 day
      let { targetDate: td, availableTimeslots: timeslots } =
        await findTimeslots(startDateString, type);
      if (timeslots.length > 0) {
        targetDate = td;
        availableTimeslots = timeslots;
      } else {
        startDate.setDate(startDate.getDate() + 1);
      }
    }

    // return next available date and time slots,
    // along with the holidays and vacations ❌ data tranfer out cost
    // if targetDate!==null && availableTimeslots.length > 0
    if (targetDate !== null && availableTimeslots.length > 0) {
      return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          targetDate,
          availableTimeslots,
        }),
      };
    }
    // else cannot find the next available date and time slots
    else {
      return {
        statusCode: 404,
        body: 'cannot fine the next available date and time slots',
      };
    }
  } catch (error) {
    console.log('findTimeSlot error: internal Error: ' + error);
    // monitor the error
    await monitorAndNotify('dentaBook', context, error, process.env.SNS_TOPIC);
    return {
      statusCode: 500,
      body: 'internal error',
    };
  }
};
