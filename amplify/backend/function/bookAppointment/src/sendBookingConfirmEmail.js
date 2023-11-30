const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const REGION = 'us-east-2';
const sesClient = new SESClient({ region: REGION });

const createSendingCommand = (
  toAddress,
  fromAddress,
  apptDateString,
  startTime
) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Message: {
      Subject: {
        Data: 'Booking Confirmation',
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: `This is a booking confirmation message, your appointment has been scheduled on ${apptDateString}, ${startTime}`,
          Charset: 'UTF-8',
        },
        Html: {
          Charset: 'UTF-8',
          Data: `<h4>Booking Confirmation</h4><p>This is a booking confirmation message, your appointment has been scheduled on ${apptDateString}, ${startTime}</p>`,
        },
      },
    },
  });
};

export const sendBookingConfirmEmail = async (
  toAddress,
  fromAddress,
  apptDateString,
  startTime
) => {
  const sendingCommand = createSendingCommand(
    toAddress,
    fromAddress,
    apptDateString,
    startTime
  );
  try {
    const response = await sesClient.send(sendingCommand);
    console.log('sending booking confirmation email successfully, ', response);
  } catch (error) {
    console.error('failed to send booking confirmation email, ', error);
  }
};
