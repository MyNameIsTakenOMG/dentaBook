# Welcome to DentaBook!

DentalBook is a web app that is designed to serve dentists and patients. The goal of this app is to provide a comprehensive platform for efficient communication, appointment management, and seamless user experiences for all involved parties.


## Features

- Admin:
  - add/update/delete ***vacations***
  - add/update/delete ***date_for_next_appointment*** for clients
  - add/update/delete ***re-examination_interval*** for clients
  - create a user account for a new client (default: **'password'**)
 
**Note:** either ***date_for_next_appointment*** or ***re-examination_interval*** should be set for each client, or the server won't be able to track the status of appointments of clients.

- Client:
  - create a user account
  - create/update/delete an appointment (cannot update or delete any appointment within 24 hours prior to the date of this appointment, or need to make a phone call if there's a situation)

## Technologies

- Next.js
- AWS Amplify
- AWS Lambda
- AWS API Gateway
- AWS Cognito
- AWS DynamoDB
- AWS EventBridge
- AWS SNS
- AWS SES

## Challenges
- showing the correct info on a calendar, such as holidays, long weekends, as well as dentist's vacations
- showing correct time slots based on different types of appointments
- concurrency issue of the same time slots being chosen at the same time


## issues
- avoid a client making multiple appointments
- CSRF protection for Lambda functions
