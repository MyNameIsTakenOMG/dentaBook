/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
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

const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+1[0-9]{10}$/)
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

exports.handler = async (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  let { email, phone_number, family_name, given_name } =
    event.request.userAttributes;
  if (!email || !phone_number || !family_name || !given_name) {
    console.error('pre-signup error: bad user data');
    let err = new Error('pre-signup error: bad request');
    callback(err, event);
  }
  // sanitize and validate the user information
  let _email = email.toLowerCase().trim();
  let _phone = phone_number.toLowerCase().trim();
  let _fname = family_name.toLowerCase().trim();
  let _gname = given_name.toLowerCase().trim();
  let { error, value } = schema.validate({
    email: _email,
    phone: _phone,
    fname: _fname,
    gname: _gname,
  });
  if (error) {
    console.error('pre-signup error: bad user data: ' + error);
    let err = new Error('pre-signup error: bad request');
    callback(err, event);
  }
  // check if there's existing user profile item in the table,
  // if yes, then compare it with incoming user data
  try {
    let request = new GetCommand({
      TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
      Key: {
        PK: `c#${_email}`,
        SK: `c#${_email}`,
      },
      ProjectionExpression: 'PK, phone, fname, gname',
    });
    let response = await docClient.send(request);
    if (response.Item) {
      if (
        response.Item['phone'] !== _phone.slice(2) ||
        response.Item['fname'] !== _fname ||
        response.Item['gname'] !== _gname
      ) {
        console.log(
          `pre-signup comparing: response.phone=${response.Item['phone']}, response.fname=${response.Item['fname']}, response.gname=${response.Item['gname']}`
        );
        console.log(
          `pre-signup comparing: incoming.phone=${_phone}, incoming.fname=${_fname}, incoming.gname=${_gname}`
        );
        let err = new Error('user inputs and user profile not matched');
        callback(err, event);
      }
      callback(null, event);
    }
    callback(null, event);
  } catch (error) {
    console.log('pre-signup error: fetching user profile failed ' + error);
    await monitorAndNotify('dentaBook', context, error, process.env.SNS_TOPIC);
    let err = new Error('internal error, please try again later');
    callback(err, event);
  }
};
