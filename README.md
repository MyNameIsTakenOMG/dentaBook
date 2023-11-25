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
  - ~~update clients' current status (active/inactive)~~

**Note:** either **_date_for_next_appointment_** or **_re-examination_interval_** should be set for each client, or the server won't be able to track the status of appointments of clients.

---
- Client:
  - create a user account
  - create/update an appointment (can update the data or time the appointment for **_one time_** as long as 24 hours before the date and time of the current appointment, or required to make a phone call if there's a situation( update/cancel the appointment))
  - allow to make appointments without a user account (guest booking option, **_downsides:_** unable to view the history of past appointments and modify appointments, have to fill out personal information form when booking an appointment each time.)

**Note:** 
 1. each client can only have **one** `upcoming` appointment at any time. (prevent a certain client from booking multiple appointments)
 2. when booking a new appointment, a client can only be allowed to choose a date from the rest of the current year and the next year. (making an appointment that is too far from now doesn't make much sense)
 3. when booking a new appointment, a client can only be allowed to choose a date and time from the next day on, so that it can make sure the timetable for the current date is stable.
---
- System:
  - scan all **active** client records in the table to track the status of their appointments **every day at 20:00**.
  - skip the **inactive** client records whose properties **_date_for_next_appointment_** or **_re-examination_interval_** have not been set and have **no** previous appointment record.
  - if a client record has the property **_date_for_next_appointment_** set up, then send a confirm notification to the client if the **_date_for_next_appointment_** is less than 3 days ahead of the current date and there's no confirm notification that hasn't been sent yet. Otherwise, skip the client record.
  - if a client record has the properties **_re-examination_interval_** and **_last_appointment_** set up, then send a reminder notification to the client if they are due for re-exam and there's no reminder notification that has been sent yet. **_Note:_** If a client hasn't booked an appointment 7 days after they receive the reminder notification, then the system will create an `issue` and send it to the admin for further process.
  - if a client misses their appointment, the system will create an `issue` and send it to the admin for further process.

**Note:**
  1. if an `issue` has been created for a certain client with a reason of **pending** , **missed**, or **cancelled**, then turn the client to **inactive** .
  2. each time a client books an appointment, make sure to turn the status to **active** if it was **inactive** before.
  3. if a client who hasn't had properties **_date_for_next_appointment_** or **_re-examination_interval_** set but has previous appointment record(s), but they haven't booked appointments for more than **6 months**, then turn them to **inactive** .
---
### *Holidays Rules (referred to the City of Toronto: [Designated & Statutory Holidays](https://www.toronto.ca/home/contact-us/statutory-holidays/) )
- Family Day: 3rd Monday in February
- Good Friday: always on Friday
- Victoria Day: Monday before May 25
- *Canada Day: July 1, but if `date.getDay()` == 6 || 0, then move it to 1
- Simcoe (Civic) Day: first Monday of August
- Labour Day: first Monday of September
- Thanksgiving Day: second Monday of October
- *Christmas Day: December 25 ->
- *Boxing Day: December 26 ->
  ```
    if both fall on weekdays(1-5), then return
    else if both fall on weekends( christmas=6 & boxing=0), then christmas= 1, boxing=2
    else if christmas=5 & boxing=6, then boxing+(2 days)->1
    else if christmas=0 & boxing=1, then christmas+(1 day)->1, boxing+(1 day)->2
  ```
- *New Year's Day: January 1, but if `date.getDay()` == 6 || 0, then move it to 1
---
## Technologies

- Next.js
- AWS Amplify
- AWS Lambda
- AWS API Gateway
- AWS Cognito
- AWS DynamoDB
- AWS EventBridge
- AWS SQS
- AWS SES

## Workflows

- **Authentication**:
  <p align='center'>
    <img src='https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/dentaBook-auth-workflow.PNG' alt='auth workflow' width='500' />
  </p>

- **Booking**:
    <p align='center'>
    <img src='https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/dentaBook-booking_workflow(Upper).PNG' alt='booking workflow' width='600' />
  </p>
    <p align='center'>
    <img src='https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/dentaBook-booking_workflow(Lower).PNG' alt='booking workflow' width='600' />
  </p>
  
  **Note:**
  - when triggering fetching holidays from Google Calendar API, remember to not only check if holidays have been fetched but also check if the holidays have been sent to the endpoint successfully.
  - the API endpoint `/user_upcoming` is used to check if this client does have an upcoming appointment. If yes, then return an error that each client can only have one upcoming appointment.
  - API endpoint `/user_upcoming` changed to `/clientUpcoming`
  - when the API endpoint `/findtimeslots` returns back with `availableTimeslots` and `targetDate` successfully, our DynamoDB table already has vacations and holidays information, so no need to send them back to the client for the sake of cost-saving (Data Transfer price: from aws to the internet)
  - **move `fetch google calendar events` logic from client side to server side** in order to simplify the process of data sanitization and validation as well as holidays checking.
  - ~~decouple with SQS, it needs to add **`version`** to the entities: `client`, `appointment`, and `date`. (using `standard queue`).~~
  - when a client booked an appointment successfully, send a message to SQS queue, which will trigger another lambda function to send booking confirm emails.
- **Tracking**:
    <p align='center'>
    <img src='https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/tracking_workflow(Upper).PNG' alt='tracking workflow' width='600' />
  </p>
    <p align='center'>
    <img src='https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/tracking_workflow(Lower).PNG' alt='tracking workflow' width='600' />
  </p>

## API endpoints
- **/findtimeslot**:
  - **Use cases:** This API endpoint is responsible for three use cases:
    - It is used to find the next available date and all associated available time slots. `(client side and admin side)`
    - It is used to find all available time slots(if there are any) for a specific date. `(client side)`
    - It is used to keep searching for the next available date and associated time slots by moving forward (**_an extensive usage of first use case_**). `(admin side)`
  - **Request body:** 
    ```
      interface BodyType {
        type: ApptType;
        dateString?: string; // "Wed Jul 28 1993"
        pickedDate?: string; // "Wed Jul 28 1993"
      }
    ```
    - `type`: **ApptType** (see below)
    - `dateString`: when dateString is specified (for admin and client), it will start from the (date + 1) to find the next available date and time slots
    - `pickedDate`: when pickedDate is specified (for client), it will fetch the availability of the specific date
    - `ApptType`:
      ```
      type ApptType =
        | 'Emergency'
        | 'Cleaning'
        | 'Dental Implant'
        | 'Treatment'
        | 'Dental Exam';
      ```
    - **Note:**
      - `dateString` and `pickedDate` cannot be specified both, or throw an exception (bad request)
      - both `dateString` and `pickedDate` are strings of date potion of the given date, for example, `"Wed Jul 28 1993"`
      - when neither `dateString` nor `pickedDate` is specified, then it will start from the (current date + 1) to find the next available date and time slots.
  - **Response:**
    ```
    interface Response {
      targetDate: undefined | string;
      availableTimeslots: [] | {start:string;end:string}[]
    }
    ```
    - when `targetDate` is unspecified in the response body, it means it is the second use case which is the client is picking a certain date to check its available time slots.
    - `targetDate`: `targetDate` is `pickedDate` when it's specified, otherwise it will be the date with available time slots (**format:** `yyyy-mm-dd`,`2023-09-01`).
    - `availableTimeslots`: could be an empty array or an array with time slots (**format:** `[{start:'14:00',end:'15:30'},...]`)
## Challenges

- ~~showing the correct info on a calendar, such as holidays, long weekends, as well as dentist's vacations~~ ✅ **Solution:** adding `customEvent` components for different views when initializing `react-big-calendar`.
- ~~showing all available time slots based on different types of appointments and dates picked~~ ✅ **Solution:** util function `timeslotsFinder` implemented
- ~~showing the next available date and time without clients picking dates one after another~~ ✅ **Solution:** util function `timeslotsFinder` implemented
- ~~concurrency issues of the same timeslots or the timeslots that share overlapping part being chosen at the same time by multiple clients~~✅ **Solution:** applying **OCC(Optimistic Concurrency Control)** via inserting `date` items in which each item has properties: `PK(d#<date_1>)`, `appts([{start:<time_1>, end:<time_2>, date:<date_1>, type: "root canal",c: "c#<email_1>", a: "a#<timestamp_1>", status: "upcoming"}])`, `version#<timestamp>`, `apptNum(number)`.
- ~~properly dealing with `cancel appointments`~~ ✅ **Solution:** first, turn the client to 'inactive'(active->false). Then when a new appointment is made for the client whether by the admin over a phone call or by the client themselves later, turn it back to 'active'(active->true) 

## issues

- ~~avoid a client making multiple appointments.~~ ✅ **Solution:** checking if there's an `upcoming` appointment for the specific client.
- ~~consider applying some limits on how many times a client can modify the appointment and cancellation rules~~ ✅ **Solution:** adding `num_modify` to each appointment item, for cancellation, ask clients to make phone calls.
- ~~limit the time range from which a client can choose for appointment date~~ ✅ **Solution:** Only allow clients to choose a date between this year and next year. (Please refer to `booking_workflow`)

## Security concerns
- XSS & CSRF attacks : add `security headers` & educate end users to follow good practices when using the app.
- User inputs validations (validate and sanitize user inputs at both client-side & server-side)
- ~~Prevent spamming & bot submission~~: ✅ **Solution:** Use `reCAPTCHA`, `MFA` or `honeypot trap`(the picked one) for the booking page and ~~authenticatorModal page~~(cognito has email verification which can be used for prevent bot submissions).
- API protection

## Custom Algorithm (timeslotsFinder)


## Database Design (DynamoDB)
### Entities
- **Client**:
  - email
  - phone
  - fname
  - gname
  - ~~password~~
  - entity
  - ~~isRegistered~~
  - active (true/false)
  - role
  - interval
  - ~~appointment_date~~
  - ~~next_appointment~~
  - ~~last_appointment~~
  - reminder
  - confirm
  - latestAppt
  - ~~version: number (starting with 1)~~
- **Appointment**:
  - entity
  - appointment_date
  - appointment_time
  - appointment_status
  - appointment_type
  - num_modify
  - ~~version: number (starting with 1)~~
- **Issue**:
  - entity
  - ~~appointment_date~~
  - ~~appointment_timestamp~~
  - appointment_date#timestamp
  - appointment_status
  - appointment_type
  - email
  - phone_number
  - family_name
  - given_name
  - is_resolved (true/false)
- **Date(Schedule)**:
  - entity : date
  - schedule_date : `d#<date_1>`
  - appointments_array: `[{start,end}...]`
  - version: number (starting with 1)
- **Holidays**:
  - entity: holiday
  - holidays_array: `['2023-9-02',...]`
- **Vacation**:
  - entity: vacation
  - vacation_start: date_1
  - vacation_end: date_2
---
- **Reserved**: 
  - ~~reserve_date~~
  - ~~reserve_timestamp~~
  - reserve_date#timestamp
  - reserve_type
  - entity
  - ~~email~~
  - expire_timestamp
### Access Patterns
#### Client
- `getClientByClientId` (primary key(PK) + sort key(SK)) : `PK=c#<id>` and `SK=c#<id>`
- `getAppointmentsByClientId` (primary key(PK) + sort key(SK)) : `PK=c#<id>` and `SK begins_with=a#`
#### System
- `getActiveClientsByEntityType`  (GSI2(PK) + GSI2(SK)) : `GSI2-PK=entity_type(client)` and `GSI2-SK begins_with=c#true`
- `getInactiveClientsByEntityType`  (GSI2(PK) + GSI2(SK)) : `GSI2-PK=entity_type(client)` and `GSI2-SK begins_with=c#false`
#### Admin
- `getClientByPhoneNumber` (GSI2(PK)) : `GSI2-PK=client` + **--FilterExpression:** `phone=:phone`
- `getAppointmentByClientIdAndTimestamp` (primary key(PK) + sort key(SK)) : `PK=c#<id:email>` and `SK=a#<id:timestamp>`
- `getAppointmentsByDate` **(day view)** (primary key(PK)) : `PK=d#date_1` 
- `getAppointmentsByDateWithRange` **(month or week view)** (primary key(PK)) : `PK=date_1` (from `date_1` to `date_2`, need `batchReadItems`)
- `getUnresolvedIssuesByEntityType` (GSI3(PK)) : `GSI3-PK=issue` 
- `getUnResolvedIssuesWithTimeRange` (GSI3(PK) + GSI3(SK)) : `GSI3-PK=issue` and `GSI3-SK between (i#false#<timestamp_1>, i#false#<timestamp_2>)`
- `getUnresolvedIssuesNum` (primary key(PK) : `PK=issues`
- `getVacationsByEntityType` (GSI1(PK)) : `GSI1-PK=vacation`
- `getVacationsByTimeRange` (GSI1(PK) + GSI1(SK)) : `GSI1-PK=vacation` and `GSI1-SK between (v#<date_1>, v#<date_2>)`
---
- `getReservesByEntityType` (primary key(PK)) : `PK='reserved'`
- `getReserveByClientId` (primary key(PK) + sort key(SK)) : `PK='reserved'` and `SK=r#<date>#<time>#<c_id>`
~~### Access Patterns (Schedule items: OCC, no GSI applied)~~
~~- `getAppointmentsByDate` (primary key (PK)): `PK=d#<date>`~~
