'use client';
// import { Amplify, Auth } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlightIcon from '@mui/icons-material/Flight';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import AddIcon from '@mui/icons-material/Add';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import UpdateAppointmentModal from './UpdateAppointmentModal';

import dayjs from '@/app/utils/dayjs';
import VacationModal from './VacationModal';
import CancelAppointmentModal from './CancelAppointmentModal';
import IntervalModal from './IntervalModal';
import ChangeUserStatusModal from './ChangeUserStatusModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import CustomEvent from './CustomEvent';
import RouteProtector from '../components/RouteProtector';

const localizer = dayjsLocalizer(dayjs);

// Amplify.configure({ ...awsExports, ssr: true });

export default function AdminPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };
  return (
    <RouteProtector>
      <main className={styles.main}>
        <Box
          sx={{
            width: '100%',
            // height: '100vh',
            // padding: '3rem 0',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            // mb: '1rem',
          }}
        >
          {/* side bar  */}
          <Box
            sx={{
              // border: '1px solid black',
              display: 'flex',
              flexFlow: 'column nowrap',
              width: '240px',
              height: '100vh',
              p: '0.8rem',
              rowGap: '1rem',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1250,
              bgcolor: grey['50'],
              color: blue['400'],
              borderRight: '1px solid lightblue',
            }}
          >
            <Stack direction={'column'}>
              <Typography variant="h6">Welcome,</Typography>
              <Typography variant="body2">this is admin panel.</Typography>
            </Stack>
            <Divider />
            <List component="nav">
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon sx={{ color: blue['400'] }}>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
              </ListItemButton>
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon sx={{ color: blue['400'] }}>
                  <FlightIcon />
                </ListItemIcon>
                <ListItemText primary="Vacations" />
              </ListItemButton>
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemIcon sx={{ color: blue['400'] }}>
                  <PersonSearchIcon />
                </ListItemIcon>
                <ListItemText primary="Clients" />
              </ListItemButton>
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemIcon sx={{ color: blue['400'] }}>
                  <RunningWithErrorsIcon />
                </ListItemIcon>
                <ListItemText primary="Issues" />
              </ListItemButton>
            </List>
            <List>
              <Divider />
              <ListItemButton
                sx={{ color: 'red' }}
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemIcon sx={{ color: 'red' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </List>
          </Box>
          {/* dashboard  */}
          <Box
            sx={{
              // border: '1px solid black',
              width: 'calc(100% - 240px)',
              height: '100vh',
              p: '0.8rem',
              overflow: 'auto',
              display: 'flex',
              flexFlow: 'column',
              rowGap: '1rem',
              position: 'fixed',
              top: 0,
              left: 240,
              zIndex: 1250,
              bgcolor: grey['50'],
              color: blue['400'],
            }}
          >
            <DashboardContents selectedIndex={selectedIndex} />
          </Box>
        </Box>
      </main>
    </RouteProtector>
  );
}

const events = [
  {
    start: dayjs('2023-10-22 9:30').toDate(),
    end: dayjs('2023-10-22 10:30').toDate(),
    title: 'MRI Registration',
    resource: {
      id: '12344556 123@123.com',
      title: 'given_name family_name',
      status: 'upcoming', // 'upcoming', 'missed', 'pending','cancelled'
    },
  },
  {
    start: dayjs('2023-10-22 10:30').toDate(),
    end: dayjs('2023-10-22 11:30').toDate(),
    title: 'MRI Registration',
    resource: {
      id: '12344556 244@123.com',
      title: 'given_name family_name',
      status: 'upcoming', // 'upcoming', 'missed', 'pending','cancelled'
    },
  },
  {
    start: dayjs('2023-10-22 11:30').toDate(),
    end: dayjs('2023-10-22 12:30').toDate(),
    title: 'MRI Registration',
    resource: {
      id: '12344556 324@123.com',
      title: 'given_name family_name',
      status: 'upcoming', // 'upcoming', 'missed', 'pending','cancelled'
    },
  },
  {
    start: dayjs('2023-10-22 12:30').toDate(),
    end: dayjs('2023-10-22 13:30').toDate(),
    title: 'MRI Registration',
    resource: {
      id: '12344556 798@123.com',
      title: 'given_name family_name',
      status: 'cancelled', // 'upcoming', 'missed', 'pending','cancelled'
    },
  },
  {
    start: dayjs('2023-10-22 13:30').toDate(),
    end: dayjs('2023-10-22 14:30').toDate(),
    title: 'MRI Registration',
    resource: {
      id: '12344556 57@123.com',
      title: 'given_name family_name',
      status: 'pending', // 'upcoming', 'missed', 'pending','cancelled'
    },
  },
  {
    start: dayjs('2023-10-22 14:30').toDate(),
    end: dayjs('2023-10-22 15:30').toDate(),
    title: 'ENT Appointment',
    resource: {
      id: '12344556 456@123.com',
      title: 'given_name family_name',
      status: 'missed', // 'upcoming', 'missed', 'pending','cancelled'
    },
  },
];

const DashboardContents = ({ selectedIndex }: { selectedIndex: number }) => {
  // updateAppointmentModal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // CancelAppointmentModal
  const [openCancelAppointmentModal, setOpenCancelAppointmentModal] =
    useState(false);

  // intervalModal
  const [openIntervalModal, setOpenIntervalModal] = useState(false);

  // changeUserStatusModal
  const [openUserStatusModal, setOpenUserStatusModal] = useState(false);

  // vacationModal
  const [openVacationModal, setOpenVacationModal] = useState(false);
  const [vacationOption, setVacationOption] = useState<
    'Add' | 'Update' | 'Cancel'
  >('Add');

  // Appointment details modal
  const views = [Views.MONTH, Views.WEEK, Views.DAY];
  // Appointment Modal
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  // onNavigate
  const [selectedDate, setSelectedDate] = useState(null);
  // onSelectEvent
  const [selectedEvent, setSelectedEvent] = useState(null);
  // onView
  const [selectedView, setSelectedView] = useState('day');
  // onRangeChange
  // Note: This method is not fired on initial render,
  // Only as the user navigates through Big Calendar.
  const onRangeChange = (range: any) => {
    console.log('the range: ', range);
  };
  const onNavigate = (newDate: any) => setSelectedDate(newDate);
  const onSelectEvent = (event: any) => {
    if (selectedView === 'week' || selectedView === 'day') {
      console.log('only triggered with view day or week');
      setSelectedEvent(event);
      setOpenAppointmentModal(true);
    }
  };
  const onView = (newView: any) => setSelectedView(newView);
  useEffect(() => {
    console.log('the selected date: ', selectedDate);
    console.log('the selected event: ', selectedEvent);
    console.log('the selected view: ', selectedView);
  }, [selectedDate, selectedEvent, selectedView]);

  // schedule
  if (selectedIndex === 0) {
    return (
      <>
        <AppointmentDetailsModal
          openAppointmentModal={openAppointmentModal}
          setOpenAppointmentModal={setOpenAppointmentModal}
        />
        <Calendar
          defaultView="day"
          localizer={localizer}
          step={30}
          timeslots={1}
          style={{ height: '95vh' }}
          events={events}
          views={views}
          popup
          min={dayjs('2023-10-21 9:00').toDate()}
          max={dayjs('2023-10-21 18:30').toDate()}
          // onNavigate={onNavigate}
          onSelectEvent={onSelectEvent}
          onView={onView}
          onRangeChange={onRangeChange}
          resourceAccessor={'resource'}
          components={{
            event: CustomEvent,
          }}
        />
      </>
    );
  }
  // vacations
  else if (selectedIndex === 1) {
    return (
      <>
        {/* book_an_appointment modal 
      for updating date and time of the upcoming appointment
      or cancelling the appointment  */}
        <VacationModal
          openVacationModal={openVacationModal}
          setOpenVacationModal={setOpenVacationModal}
          option={vacationOption}
        />
        <Typography variant="h6" sx={{ position: 'sticky', top: 0 }}>
          Vacations
        </Typography>
        <Divider />
        <Stack
          direction={'row'}
          columnGap={'1rem'}
          sx={{ width: '100%', maxWidth: '1200px' }}
        >
          {/* current/upcoming vacations  */}
          <Box
            sx={{
              width: '60%',
              border: '1px solid black',
              display: 'flex',
              flexFlow: 'column',
              rowGap: '1rem',
              p: '0.5rem',
            }}
          >
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', mb: '1.5rem' }}
              >
                Upcoming
              </Typography>
              <Button
                sx={{ alignSelf: 'start' }}
                variant="contained"
                disableElevation
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpenVacationModal(true);
                  setVacationOption('Add');
                }}
              >
                add vacation
              </Button>
            </Stack>
            {/* list of vacations  */}
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                border: '1px solid lightblue',
                p: '0.8rem 1.2rem',
                borderRadius: '10px',
              }}
            >
              <Stack direction={'column'}>
                <Typography variant="body2">Year</Typography>
                <Typography variant="body1">2023</Typography>
              </Stack>
              <Stack direction={'column'}>
                <Typography variant="body2">Duration</Typography>
                <Typography variant="body1">Aug13 - Aug28</Typography>
              </Stack>
              <Stack
                direction={'row'}
                columnGap={'0.5rem'}
                sx={{ alignItems: 'center' }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  onClick={() => {
                    setOpenVacationModal(true);
                    setVacationOption('Update');
                  }}
                >
                  update
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setOpenVacationModal(true);
                    setVacationOption('Cancel');
                  }}
                >
                  cancel
                </Button>
              </Stack>
            </Box>
          </Box>
          {/* vacations history */}
          <Box
            sx={{
              width: '40%',
              border: '1px solid black',
              display: 'flex',
              flexFlow: 'column',
              rowGap: '1rem',
              p: '0.5rem',
            }}
          >
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', mb: '1.5rem' }}
              >
                History
              </Typography>
              <Stack
                direction={'row'}
                columnGap={'1.5rem'}
                alignItems={'start'}
              >
                <Select size="small">
                  <MenuItem>Last Week</MenuItem>
                  <MenuItem>Last Month</MenuItem>
                  <MenuItem>Last 3 Months</MenuItem>
                </Select>
                <Button variant="contained">search</Button>
              </Stack>
            </Stack>
            {/* history of vacations  */}
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                border: '1px solid lightblue',
                p: '0.8rem 1.2rem',
                borderRadius: '10px',
              }}
            >
              <Stack direction={'column'}>
                <Typography variant="body2">Year</Typography>
                <Typography variant="body1">2023</Typography>
              </Stack>
              <Stack direction={'column'}>
                <Typography variant="body2">Duration</Typography>
                <Typography variant="body1">Aug13 - Aug28</Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </>
    );
  }
  // clients
  else if (selectedIndex === 2) {
    return (
      <>
        {/* updateAppointment modal 
      for updating date and time of the upcoming appointment */}
        <UpdateAppointmentModal
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
        />
        {/* cancelAppointment modal for cancelling the upcoming appointment  */}
        <CancelAppointmentModal
          openCancelAppointmentModal={openCancelAppointmentModal}
          setOpenCancelAppointmentModal={setOpenCancelAppointmentModal}
        />

        {/* intervalModal for setting intervals for clients  */}
        <IntervalModal
          openIntervalModal={openIntervalModal}
          setOpenIntervalModal={setOpenIntervalModal}
        />

        {/* changeUserStatusModal for changing user status  */}
        <ChangeUserStatusModal
          openUserStatusModal={openUserStatusModal}
          setOpenUserStatusModal={setOpenUserStatusModal}
        />

        <Typography variant="h6" sx={{ position: 'sticky', top: 0 }}>
          Clients
        </Typography>
        <Divider />
        <Stack
          direction={'column'}
          rowGap={'1rem'}
          sx={{ width: '100%', maxWidth: '1200px' }}
        >
          {/* search section  */}
          <Box
            sx={{
              width: '50%',
              border: '1px solid black',
              display: 'flex',
              flexFlow: 'column',
              rowGap: '1rem',
              p: '0.5rem',
            }}
          >
            <Stack direction={'column'} rowGap={'0.5rem'}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Search users
              </Typography>
              <Stack
                direction={'row'}
                columnGap={'0.5rem'}
                alignItems={'center'}
              >
                <TextField size="small" label="Phone number" />
                <Button variant="contained" size="small">
                  Go
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Box
            sx={{
              width: '100%',
              border: '1px solid black',
              display: 'flex',
              flexFlow: 'row',
              columnGap: '1rem',
              p: '0.5rem',
            }}
          >
            {/* user information section  */}
            <Box
              sx={{
                width: '50%',
                display: 'flex',
                flexFlow: 'column',
                rowGap: '1rem',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                User Information
              </Typography>
              <Stack direction={'row'} columnGap={'0.8rem'}>
                <TextField
                  sx={{ width: '50%' }}
                  disabled
                  size="small"
                  label="Given Name"
                />
                <TextField
                  sx={{ width: '50%' }}
                  disabled
                  size="small"
                  label="Family Name"
                />
              </Stack>
              <TextField
                disabled
                size="small"
                type="tel"
                label="Phone Number"
              />
              <TextField disabled size="small" type="email" label="Email" />
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack
                  direction={'row'}
                  columnGap={'1rem'}
                  alignItems={'center'}
                >
                  <Typography variant="body1">Current Status:</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      p: '0.25rem 0.5rem',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: green['500'],
                    }}
                  >
                    Active
                  </Typography>
                </Stack>
                <Button
                  disableElevation
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={() => {
                    setOpenUserStatusModal(true);
                  }}
                >
                  update
                </Button>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="body1">
                  re-exam interval: interval
                </Typography>
                <Button
                  disableElevation
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={() => {
                    setOpenIntervalModal(true);
                  }}
                >
                  update
                </Button>
              </Stack>
            </Box>
            {/* user appointments section  */}
            <Box
              sx={{
                width: '50%',
                display: 'flex',
                flexFlow: 'column',
                rowGap: '1rem',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Appointment
              </Typography>
              <Stack direction={'column'} rowGap={'0.8rem'}>
                <Typography variant="body2">Upcoming</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'space-between',
                    border: '1px solid lightblue',
                    p: '0.8rem 1.2rem',
                    borderRadius: '10px',
                  }}
                >
                  <Stack direction={'column'}>
                    <Typography variant="body2">Date</Typography>
                    <Typography variant="body1">2023-09-21</Typography>
                  </Stack>
                  <Stack direction={'column'}>
                    <Typography variant="body2">Type</Typography>
                    <Typography variant="body1">type</Typography>
                  </Stack>
                  <Stack
                    direction={'row'}
                    columnGap={'0.5rem'}
                    sx={{ alignItems: 'center' }}
                  >
                    <Button
                      disableElevation
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        setOpenUpdateModal(true);
                      }}
                    >
                      update
                    </Button>
                    <Button
                      disableElevation
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setOpenCancelAppointmentModal(true);
                      }}
                    >
                      cancel
                    </Button>
                  </Stack>
                </Box>
                <Divider />
                <Typography variant="body2">Past</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'space-between',
                    border: '1px solid lightblue',
                    p: '0.8rem 1.2rem',
                    borderRadius: '10px',
                  }}
                >
                  <Stack direction={'column'}>
                    <Typography variant="body2">Date</Typography>
                    <Typography variant="body1">2023-09-21</Typography>
                  </Stack>
                  <Stack direction={'column'}>
                    <Typography variant="body2">Type</Typography>
                    <Typography variant="body1">type</Typography>
                  </Stack>
                  <Stack
                    direction={'row'}
                    columnGap={'0.5rem'}
                    sx={{ alignItems: 'center' }}
                  >
                    <Button
                      disabled
                      size="small"
                      variant="contained"
                      color="warning"
                    >
                      attended
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </>
    );
  }
  // issues
  else if (selectedIndex === 3) {
    return (
      <>
        <Typography variant="h6" sx={{ position: 'sticky', top: 0 }}>
          Issues
        </Typography>
        <Divider />
        <Stack direction={'column'} rowGap={'1rem'} sx={{ width: '1000px' }}>
          <Box sx={{ borderBottom: '1.5rem', borderColor: 'divider' }}>
            <Tabs>
              <Tab label="Unresolved" id="unresolved" />
              <Tab label="Resolved" id="resolved" />
            </Tabs>
          </Box>
          {/* unresolved  */}
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'row',
              justifyContent: 'space-between',
              border: '1px solid lightblue',
              p: '0.8rem 1.2rem',
              borderRadius: '10px',
            }}
          >
            <Stack direction={'column'}>
              <Typography variant="body2">Year</Typography>
              <Typography variant="body1">2023</Typography>
            </Stack>
            <Stack direction={'column'}>
              <Typography variant="body2">Duration</Typography>
              <Typography variant="body1">Aug13 - Aug28</Typography>
            </Stack>
            <Stack
              direction={'row'}
              columnGap={'0.5rem'}
              sx={{ alignItems: 'center' }}
            >
              <Button size="small" variant="contained" color="warning">
                resolve
              </Button>
            </Stack>
          </Box>
          {/* resolved  */}
          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ width: '60%' }}
          >
            <Select size="small">
              <MenuItem>Last Week</MenuItem>
              <MenuItem>Last Month</MenuItem>
              <MenuItem>Last 3 Months</MenuItem>
            </Select>
            <Button variant="contained">search</Button>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'row',
              justifyContent: 'space-between',
              border: '1px solid lightblue',
              p: '0.8rem 1.2rem',
              borderRadius: '10px',
            }}
          >
            <Stack direction={'column'}>
              <Typography variant="body2">Year</Typography>
              <Typography variant="body1">2023</Typography>
            </Stack>
            <Stack direction={'column'}>
              <Typography variant="body2">Duration</Typography>
              <Typography variant="body1">Aug13 - Aug28</Typography>
            </Stack>
            <Stack
              direction={'row'}
              columnGap={'0.5rem'}
              sx={{ alignItems: 'center' }}
            >
              <Button disabled size="small" variant="contained" color="error">
                Resolved
              </Button>
            </Stack>
          </Box>
        </Stack>
      </>
    );
  }
};
