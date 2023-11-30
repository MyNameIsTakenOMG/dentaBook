/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} = require('@aws-sdk/lib-dynamodb');
const { monitorAndNotify } = require('/opt/monitorAndNotify');

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

exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger
  console.log('event: ', event.request.userAttributes);
  const { email, phone_number, family_name, given_name } =
    event.request.userAttributes;
  try {
    // check if this client has booked appointments before
    // sanitize the incoming data
    let _email = email.toLowerCase().trim();
    let _phone = phone_number.toLowerCase().trim().slice(2);
    let _fname = family_name.toLowerCase().trim();
    let _gname = given_name.toLowerCase().trim();
    const response = await docClient.send(
      new GetCommand({
        TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
        Key: {
          PK: `c#${_email}`,
          SK: `c#${_email}`,
        },
        ProjectionExpression: 'PK, phone, fname, gname',
      })
    );
    // if this client has never booked an appointment before
    // then create a client profile
    if (!response.Item) {
      await docClient.send(
        new PutCommand({
          TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
          Item: {
            PK: `c#${_email}`,
            SK: `c#${_email}`,
            entity: 'client',
            phone: _phone,
            fname: _fname,
            gname: _gname,
            role: event.request.userAttributes['custom:role'],
            interval: undefined,
            latestAppt: undefined,
            reminder: undefined,
            confirm: false,
            active: false,
            'GSI2-PK': 'client',
            'GSI2-SK': `c#true#${_email}`,
          },
        })
      );
      console.log(`post confirm: user:${_email} profile created successfully`);
      // return event;
      return event;
    }
  } catch (error) {
    console.log(
      `post confirm: user:${email} profile fetched or created failed`
    );
    console.log('post confirm: error: ', error);
    await monitorAndNotify('dentaBook', context, error, process.env.SNS_TOPIC);
    return;
  }
};
