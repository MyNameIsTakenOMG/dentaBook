# Welcome to DentaBook!

DentalBook is a web app that is designed to serve dentists and patients. The goal of this app is to provide a comprehensive platform for efficient communication, appointment management, and seamless user experiences for all involved parties.

## Features

- Admin:
  - check calendar for daily schedule
  - add/update/delete **_vacations_**
  - add/update/delete **_date_for_next_appointment_** for clients
  - add/update/delete **_re-examination_interval_** for clients
  - ~~create a user account for a new client (default: **'password'**)~~
  - search for clients' appointment history (including **_date_for_next_appointment_** if there is one)

**Note:** either **_date_for_next_appointment_** or **_re-examination_interval_** should be set for each client, or the server won't be able to track the status of appointments of clients.

- Client:
  - create a user account
  - create/update an appointment (can update the data or time the appointment for **_one time_** within 24 hours before the date and time of this appointment, or required to make a phone call if there's a situation( update/cancel the appointment))
  - allow to make appointments without a user account (guest booking option, **_downsides:_** unable to view the history of past appointments and modify appointments, have to fill out personal information form when booking an appointment each time.)

- System:
  - scan all client records in the table to track the status of their appointments every day.
  - skip the client record whose properties **_date_for_next_appointment_** or **_re-examination_interval_** have not been set.
  - if a client record has the property **_date_for_next_appointment_** set up, then send a confirm notification to the client if the **_date_for_next_appointment_** is less than 3 days ahead of the current date and there's no confirm notification that hasn't been sent yet. Otherwise, skip the client record.
  - if a client record has the properties **_re-examination_interval_** and **_last_appointment_** set up, then send a reminder notification to the client if they are due for re-exam and there's no reminder notification that has been sent yet. **_Note:_** If a client hasn't booked an appointment 7 days after they receive the reminder notification, then the system will create an `issue` and send it to the admin for further process.
  - if a client misses their appointment, the system will create an `issue` and send it to the admin for further process.

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

## Workflows

- **Authentication**:
  <p align='center'>
    <img src='https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/dentaBook-auth-workflow.PNG' alt='auth workflow' width='500' />
  </p>
## Challenges

- showing the correct info on a calendar, such as holidays, long weekends, as well as dentist's vacations
- showing all available time slots based on different types of appointments and dates picked
- showing the next available date and time without clients picking dates one after another
- concurrency issue of the same time slots being chosen at the same time

## issues

- avoid a client making multiple appointments
- CSRF/XSS protection for Lambda functions
- consider applying some limits on how frequently or how many times a client can modify the appointment

## Database Design (DynamoDB)
### Entities
- **Client**:
  - email
  - phone number
  - family_name
  - given_name
  - ~~password~~
  - entity_type
  - ~~isRegistered~~
  - role
  - re-exam_interval
  - appointment_date
  - ~~next_appointment~~
  - ~~last_appointment~~
  - is_reminder_message_sent
  - is_confirm_message_sent
- **Appointment**:
  - entity_type
  - ~~appointment_date~~
  - ~~appointment_timestamp~~
  - appointment_date#timestamp
  - appointment_status
  - appointment_type
- **Issue**:
  - entity_type
  - ~~appointment_date~~
  - ~~appointment_timestamp~~
  - appointment_date#timestamp
  - appointment_status
  - appointment_type
  - email
  - phone_number
  - family_name
  - given_name
---
- **Reserved**: 
  - ~~reserve_date~~
  - ~~reserve_timestamp~~
  - reserve_date#timestamp
  - reserve_type
  - entity_type
  - ~~email~~
  - expire_timestamp
### Access Patterns
- `getClientByClientId` (primary key(PK) + sort key(SK)) : `PK=c#<id>` and `SK=c#<id>`
- `getAppointmentsByClientId` (primary key(PK)) : `PK=c#<id>`
- `getAppointmentByDateAndTimestamp` (GSI(PK) + GSI(SK)) : `GSI-PK=entity_type(appointment)` and `GSI-SK=a#<date>#<timestamp>`
- `getAppointmentsByDate` (GSI(PK) + GSI(SK)) : `GSI-PK=entity_type(appointment)` and `GSI-SK begins_with=a#<date>`
- `getAppointmentsByDateWithRange` (GSI(PK) + GSI(SK)) : `GSI-PK=entity_type(appointment)` and `GSI-SK between (a#<date1>, a#<date2>)`
- `getUnresolvedIssuesByEntityType` (GSI(PK) + GSI(SK)) : `GSI-PK=entity_type(issue)` and `GSI-SK begins_with=<status:unresolved>#`
- `getResolvedIssuesByEntityTypeWithTimeRange` (GSI(PK) + GSI(SK)) : `GSI-PK=entity_type(issue)` and `GSI-SK between (<status:resolved>#<date1>, <status:resolved>#<date2>)`
---
- `getReservesByEntityType` (primary key(PK)) : `PK='reserved'`
- `getReserveByClientId` (primary key(PK) + sort key(SK)) : `PK='reserved'` and `SK=r#<date>#<time>#<c_id>`
