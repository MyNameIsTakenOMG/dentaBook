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
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

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

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let { duration } = event.body;
  duration = parseInt(duration);
  let currentDate = new Date();
  let currentYearVacations = [];
  let currentYearHolidays = [];
  let targetDate;
  let available = [];
  let primay_key = `d#${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  // 3. skip vacations
  // start with the current date to the first date with any available time slots
  while (available.length === 0) {
    // remember:
    // 1. skip Sundays
    if (currentDate.getDay() === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    // 2. skip holidays
  }
  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Hello from Lambda!'),
  };
};
