/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

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
    await docClient.send(
      new PutCommand({
        TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
        Item: {
          PK: email,
          SK: email,
          phone_number,
          family_name,
          given_name,
          role: event.request.userAttributes['custom:role'],
          reexam_interval: undefined,
          next_appmt: undefined,
          last_appmt: undefined,
          is_reminder_msg_sent: false,
          is_confirm_msg_sent: false,
          entity_type: 'user',
          is_registered: true,
        },
      })
    );
    console.log(`user:${email} profile created successfully`);
    // return event;
    context.done(null, event);
  } catch (error) {
    console.log(`user:${email} profile created failed`);
    console.log('error: ', error);
    context.done(null, event);
  }
};
