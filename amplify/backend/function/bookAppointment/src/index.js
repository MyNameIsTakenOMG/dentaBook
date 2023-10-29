/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOFTAUTH_ARN
	STORAGE_DYNAMOFTAUTH_NAME
	STORAGE_DYNAMOFTAUTH_STREAMARN
	STORAGE_SCHEDULE_ARN
	STORAGE_SCHEDULE_NAME

	STORAGE_SCHEDULE_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
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
