# Welcome to DentaBook!

DentalBook is a web app that is designed to serve dentists and patients. The goal of this app is to provide a comprehensive platform for efficient communication, appointment management, and seamless user experiences for all involved parties.

## Features

- Admin:
  - add/update/delete **_vacations_**
  - add/update/delete **_date_for_next_appointment_** for clients
  - add/update/delete **_re-examination_interval_** for clients
  - ~~create a user account for a new client (default: **'password'**)~~
  - search for clients' appointment history (including **_date_for_next_appointment_** if there is one)

**Note:** either **_date_for_next_appointment_** or **_re-examination_interval_** should be set for each client, or the server won't be able to track the status of appointments of clients.

- Client:
  - create a user account
  - create/update an appointment (can update the data or time the appointment for **_one time_** within 24 hours after this appointment is made, or required to make a phone call if there's a situation( update/cancel the appointment))
  - allow to make appointments without a user account (guest booking option, **_downsides:_** unable to view the history of past appointments and modify appointments, have to fill out personal information form when booking an appointment each time.)

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
- showing all available time slots based on different types of appointments and dates picked
- showing the next available date and time without clients picking dates one after another
- concurrency issue of the same time slots being chosen at the same time

## issues

- avoid a client making multiple appointments
- CSRF/XSS protection for Lambda functions
- consider to apply some limits on how frequently or how much times a client can modify the appointment
