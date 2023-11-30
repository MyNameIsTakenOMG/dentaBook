/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOFTAUTH_ARN
	STORAGE_DYNAMOFTAUTH_NAME
	STORAGE_DYNAMOFTAUTH_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { monitorAndNotify } = require('/opt/monitorAndNotify');
const { timeslotsFinder } = require('/opt/timeslotsFinder');

const Joi = require('joi');
const { sendBookingConfirmEmail } = require('./sendBookingConfirmEmail');
const schema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  fname: Joi.string()
    .max(50)
    .pattern(/^[a-z]+$/)
    .required(),
  gname: Joi.string()
    .max(50)
    .pattern(/^[a-z]+$/)
    .required(),
});

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
// userInfo: {
//   email: string;
//   phone_number: string;
//   family_name: string;
//   given_name: string;
// };
// type: string;
// timeslot: {
//   start: string;
//   end: string;
// };
// apptDate: string; // should be the format : yyyy-mm-dd

const apptTypeAndDuration = {
  Emergency: 1.5,
  Cleaning: 1,
  'Dental Implant': 1.5,
  Treatment: 1,
  'Dental Exam': 1,
};

exports.handler = async (event, context) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // sanitize and validate incoming client data
    let keys = Object.keys(event.body);
    if (keys.length !== 4) {
      console.log('book appt error: bad request: ' + event.body);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    let { userInfo, type, timeslot, apptDate } = event.body;
    if (!(userInfo && type && timeslot && apptDate)) {
      console.log('book appt error: bad request: ' + event.body);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // first check if the type is correct
    if (!apptTypeAndDuration[type]) {
      console.log('book appt error: bad request: ' + type);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // check if the userInfo is valid
    // and then sanitize and validate the user information
    // and compare user information with the item in the table(if it exists)
    keys = Object.keys(userInfo);
    if (keys.length !== 4) {
      console.log('book appt error: bad request: ' + userInfo);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    let { email, phone_number, family_name, given_name } = userInfo;
    if (!(email && phone_number && family_name && given_name)) {
      console.log('book appt error: bad request: ' + userInfo);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    email = email.toLowerCase().trim();
    phone_number = phone_number.toLowerCase().trim();
    family_name = family_name.toLowerCase().trim();
    given_name = given_name.toLowerCase().trim();
    let { error, value } = schema.validate({
      email: email,
      phone: phone_number,
      fname: family_name,
      gname: given_name,
    });
    if (error) {
      console.log('book appt error: user info error: ' + error);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    let userQuery = new GetCommand({
      TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
      Key: {
        PK: `c#${email}`,
        SK: `c#${email}`,
      },
      ProjectionExpression: 'phone, fname, gname',
    });
    let userResponse = await docClient.send(userQuery);
    let apptQuery, apptResponse;
    // compare the client information with the incoming data
    if (userResponse.Item) {
      if (
        phone_number !== userResponse.Item.phone ||
        family_name !== userResponse.Item.fname ||
        family_name !== userResponse.Item.gname
      ) {
        console.log('book appt error: user info not matched error: ' + error);
        return {
          statusCode: 400,
          body: 'bad request',
        };
      }
      //  try to fetch the latest appointment from the client
      // (one client can only have one upcoming appt at any time)
      apptQuery = new QueryCommand({
        TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
        Limit: 1,
        ScanIndexForward: false,
        KeyConditionExpression: 'PK = :v1 AND begins_with(SK, a#)',
        ExpressionAttributeValues: {
          ':v1': `c#${email}`,
        },
        ProjectionExpression: 'apptStatus',
      });
      apptResponse = await docClient.send(apptQuery);
      if (
        apptResponse.Items.length === 1 &&
        apptResponse.Item[0]['apptStatus'] === 'upcoming'
      ) {
        console.log(
          'the client already has a upcoming appointment, bad request'
        );
        return {
          statusCode: 400,
          body: 'the client already has a upcoming appointment',
        };
      }
    }
    // check if timeslot and apptDate are valid :
    // format apptDate: 'yyyy-mm-dd'
    // format timeslot: {start: '9:30',end: '11:00'}
    let j = new Date(apptDate.replaceAll('-', ' '));
    let i = new Date();
    if (
      j.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      j.toDateString() === 'Invalid Date' ||
      (j.getFullYear() !== i.getFullYear() &&
        j.getFullYear() !== i.getFullYear() + 1) ||
      j.getTime() <= new Date(i.toDateString()).getTime()
    ) {
      console.log('book appt error: apptDate error ', apptDate);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    if (
      Object.keys(timeslot).length !== 2 ||
      !timeslot.start ||
      !timeslot.end
    ) {
      console.log('book appt error: timeslot error: ' + timeslot);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // try to fetch the according date item to find the available time slots and
    // find if there's a matched time slot
    let dateQuery = new GetCommand({
      TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
      Key: {
        PK: `d#${apptDate}`,
        SK: `d#${apptDate}`,
      },
      ProjectionExpression: 'PK, version, apptNum, appts',
    });
    let dateResponse = await docClient.send(dateQuery);
    let availableTimeslots = [];
    let inputArray = undefined;
    if (dateResponse.Item) {
      inputArray = dateResponse.Item['appt'];
    }
    availableTimeslots = timeslotsFinder(
      [9, 13],
      [14, 18],
      0.5,
      inputArray,
      apptTypeAndDuration[type]
    );
    let matched = availableTimeslots.find(
      (t) => t.start === timeslot.start && t.end === timeslot.end
    );
    if (!matched) {
      console.log(
        'no matching available timeslots found for the date: ',
        apptDate,
        timeslot
      );
      return {
        statusCode: 400,
        body: 'unable to book the appointment, please try again later',
      };
    }
    // if the timeslot is available now, then try to
    // add this new appointment by applying OCC based on the existence of the 'date' item,
    // using 'transactional write' to combine all three operations above
    else {
      // 1. create/update 'date' item using 'version'
      let transactionWriteInput = {
        TransactItems: [],
      };
      let appt_timestamp = `${new Date().getTime()}`;
      let apptDetails = {
        start: timeslot.start,
        end: timeslot.end,
        type: type,
        date: apptDate,
        client: `c#${email}`,
        fname: family_name,
        gname: given_name,
        phone: phone_number,
        status: 'upcoming',
        a: `a#${appt_timestamp}`,
      };
      // if the 'date' item is not existing
      if (!dateResponse.Item) {
        // try to create a new 'date' item with condition expression 'attribute_not_exist'
        let appts = [].push(apptDetails);
        let request = {
          Put: {
            TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
            Item: {
              PK: `d#${apptDate}`,
              SK: `d#${apptDate}`,
              entity: 'date',
              version: 1,
              apptNum: 1,
              appts: appts,
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        };
        transactionWriteInput.TransactItems.push(request);
      }
      // if the 'date' item exists in the table
      else {
        let request = {
          Update: {
            TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
            Key: {
              PK: `d#${apptDate}`,
              SK: `d#${apptDate}`,
            },
            ConditionExpression: 'version = :current_version',
            UpdateExpression:
              'set version = :new_version, apptNum = :new_apptNum, appts = list_append(appts, :new_appt)',
            ExpressionAttributeValues: {
              ':current_version': dateResponse.Item['version'],
              ':new_version': dateResponse.Item['version'] + 1,
              ':new_apptNum': dateResponse.Item['apptNum'] + 1,
              ':new_appt': apptDetails,
            },
          },
        };
        transactionWriteInput.TransactItems.push(request);
      }
      // 2. create/update 'client' item
      if (userResponse.Item) {
        let userUpdateRequest = {
          Update: {
            TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
            Key: {
              PK: `c#${email}`,
              SK: `c#${email}`,
            },
            UpdateExpression:
              'set active = :active, reminder = :reminder, confirm = :confirm, latestAppt = :latestAppt ',
            ExpressionAttributeValues: {
              ':active': true,
              ':reminder': undefined,
              ':confirm': false,
              ':latestAppt': apptDate,
            },
          },
        };
        transactionWriteInput.TransactItems.push(userUpdateRequest);
      } else {
        let userCreateRequest = {
          Put: {
            TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
            Item: {
              PK: `c#${email}`,
              SK: `c#${email}`,
              entity: 'client',
              active: true,
              phone: phone_number,
              fname: family_name,
              gname: given_name,
              role: 'client',
              interval: undefined,
              reminder: undefined,
              confirm: false,
              latestAppt: apptDate,
              'GSI2-PK': 'client',
              'GSI2-SK': `c#true#${email}`,
            },
          },
        };
        transactionWriteInput.TransactItems.push(userCreateRequest);
      }
      // 3. create 'appt' item
      let apptCreateRequest = {
        Put: {
          TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
          Item: {
            PK: `c#${email}`,
            SK: `a#${appt_timestamp}`,
            entity: 'appt',
            apptType: type,
            apptDate: apptDate,
            modified: false,
            apptStatus: 'upcoming',
            apptStart: timeslot.start,
            apptEnd: timeslot.end,
          },
        },
      };
      transactionWriteInput.TransactItems.push(apptCreateRequest);

      // execute the transactionWrites
      const command = new TransactWriteCommand(transactionWriteInput);
      const transactionResponse = await docClient.send(command);
      console.log('booking transaction writes succeeded ', transactionResponse);

      // TODO: send a 'successfully booked an appointment' message using SES
      sendBookingConfirmEmail(
        email,
        'seanfangdev@gmail.com',
        new Date(apptDate.replaceAll('-', ' ')).toDateString(),
        `${timeslot.start}-${timeslot.end}`
      );

      return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify('An appointment has been booked successfully'),
      };
    }
  } catch (error) {
    console.log('bookAppointment error: internal Error: ' + error);
    await monitorAndNotify('dentaBook', context, error, process.env.SNS_TOPIC);
    return {
      statusCode: 500,
      body: 'internal error, please try again later',
    };
  }
};

//TODO:
// 1. integrate with cloudwatch with try/catch block(make sure lambda exits gracefully)✅
// 2. send email via SES ✅
