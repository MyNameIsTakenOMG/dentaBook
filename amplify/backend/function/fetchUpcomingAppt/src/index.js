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
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { monitorAndNotify } = require('/opt/monitorAndNotify');

const Joi = require('joi');

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

exports.handler = async (event, context) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let keys = Object.keys(event.body);
    if (keys.length !== 4) {
      console.log('fetch upcoming appt error: bad request: ' + event.body);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    let { email, phone, fname, gname } = event.body;
    if (!(email && phone && fname && gname)) {
      console.log('fetch upcoming appt error: bad request: ' + event.body);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // sanitize and validate the user information
    email = email.toLowerCase().trim();
    phone = phone.toLowerCase().trim();
    fname = fname.toLowerCase().trim();
    gname = gname.toLowerCase().trim();
    let { error, value } = schema.validate({ email, phone, fname, gname });
    if (error) {
      console.log('fetch upcoming appt error: user info error: ' + error);
      return {
        statusCode: 400,
        body: 'bad request',
      };
    }
    // try to fetch according client with the email address
    const query = new GetCommand({
      TableName: process.env.STORAGE_DYNAMOFTAUTH_NAME,
      Key: {
        PK: `c#${email}`,
        SK: `c#${email}`,
      },
      ProjectionExpression: 'phone, fname, gname',
    });
    const response = await docClient.send(query);
    if (!response.item)
      return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: {
          hasUpcoming: 'no',
        },
      };
    else {
      if (
        phone === response.item.phone &&
        fname === response.item.fname &&
        gname === response.item.gname
      ) {
        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: {
            hasUpcoming: 'yes',
          },
        };
      } else {
        console.log('fetch upcoming appt error: user profile not match');
        return {
          statusCode: 400,
          body: 'bad request',
        };
      }
    }
  } catch (error) {
    console.log('fetch upcoming appt: error: ' + error);
    await monitorAndNotify('dentaBook', context, error, process.env.SNS_TOPIC);
    return {
      statusCode: 500,
      body: 'internal error',
    };
  }
};
