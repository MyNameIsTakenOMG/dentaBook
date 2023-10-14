'use client';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import React from 'react';
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
  Stack,
  Typography,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlightIcon from '@mui/icons-material/Flight';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import AddIcon from '@mui/icons-material/Add';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';

const localizer = dayjsLocalizer(dayjs);

Amplify.configure({ ...awsExports, ssr: true });

export default function AdminPage() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };
  return (
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
            zIndex: 2000,
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
            zIndex: 2000,
            bgcolor: grey['50'],
            color: blue['400'],
          }}
        >
          <DashboardContents selectedIndex={selectedIndex} />
        </Box>
      </Box>
    </main>
  );
}

const DashboardContents = ({ selectedIndex }: { selectedIndex: number }) => {
  // schedule
  if (selectedIndex === 0) {
    return (
      <Calendar
        localizer={localizer}
        step={30}
        timeslots={1}
        style={{ height: '95vh' }}
      />
    );
  }
  // vacations
  else if (selectedIndex === 1) {
    return (
      <>
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
                <Button size="small" variant="contained" color="info">
                  edit
                </Button>
                <Button size="small" variant="contained" color="error">
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: '1.5rem' }}>
              History
            </Typography>
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
  }
  // issues
  else if (selectedIndex === 3) {
  }
};
