'use client';

import React from 'react';
import styles from './page.module.css';

import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

Amplify.configure({ ...awsExports, ssr: true });

const menu_item_list = [
  'Profile',
  'Next Appointment',
  'History of Appointments',
  'Log Out',
];

export default function ProfilePage() {
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
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          mb: '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row',
            width: '100%',
            maxWidth: '1200px',
            justifyContent: 'space-between',
            mt: '3rem',
            p: '2rem',
          }}
        >
          <Box sx={{ width: '40%', display: 'flex', flexFlow: 'column' }}>
            <List
              component="nav"
              aria-label="main mailbox folders"
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: grey['100'],
                borderRadius: '30px',
                overflow: 'hidden',
                py: 0,
              }}
            >
              {menu_item_list.map((item, index) => {
                return (
                  <>
                    {index === menu_item_list.length - 1 && <Divider />}
                    <ListItemButton
                      sx={{ p: '1.5rem 1rem' }}
                      key={index}
                      selected={selectedIndex === index}
                      onClick={(e) => handleListItemClick(e, index)}
                    >
                      <ListItemText
                        primary={item}
                        sx={{
                          color:
                            index === menu_item_list.length - 1
                              ? 'red'
                              : 'inherit',
                        }}
                      />
                    </ListItemButton>
                  </>
                );
              })}
            </List>
          </Box>
          <Box sx={{ width: '60%', display: 'flex', flexFlow: 'column' }}>
            <ProfileContents selectedIndex={selectedIndex} />
          </Box>
        </Box>
      </Box>
    </main>
  );
}

const ProfileContents = ({ selectedIndex }: { selectedIndex: number }) => {
  if (selectedIndex === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        <Stack direction={'column'}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            User Profile
          </Typography>
          <Typography variant="body2" color={grey['400']}>
            Here you can view the details of your account.
          </Typography>
        </Stack>
        <Box
          sx={{
            p: '1rem 0',
            display: 'flex',
            flexFlow: 'column nowrap',
            rowGap: '1rem',
          }}
        >
          <Typography
            variant="h6"
            color={grey['700']}
            sx={{ fontWeight: 'bold' }}
          >
            General Infomation
          </Typography>
          <Stack
            direction={'column'}
            sx={{
              borderRadius: '10px',
              px: '1.5rem',
              border: '1px solid lightgrey',
              width: '50%',
            }}
          >
            <Typography variant="body2" color={grey['400']}>
              Family Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              family name
            </Typography>
          </Stack>
          <Stack
            direction={'column'}
            sx={{
              borderRadius: '10px',
              px: '1.5rem',
              border: '1px solid lightgrey',
              width: '50%',
            }}
          >
            <Typography variant="body2" color={grey['400']}>
              Given Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Given name
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            p: '1rem 0',
            display: 'flex',
            flexFlow: 'column nowrap',
            rowGap: '1rem',
          }}
        >
          <Typography
            variant="h6"
            color={grey['700']}
            sx={{ fontWeight: 'bold' }}
          >
            Security
          </Typography>
          <Stack
            direction={'column'}
            sx={{
              borderRadius: '10px',
              px: '1.5rem',
              border: '1px solid lightgrey',
              width: '50%',
            }}
          >
            <Typography variant="body2" color={grey['400']}>
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Email
            </Typography>
          </Stack>
          <Stack
            direction={'column'}
            sx={{
              borderRadius: '10px',
              px: '1.5rem',
              border: '1px solid lightgrey',
              width: '50%',
            }}
          >
            <Typography variant="body2" color={grey['400']}>
              Phone Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Phone Number
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  } else if (selectedIndex === 1) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Next Appointment
        </Typography>
        <Box
          sx={{
            borderRadius: '10px',
            p: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid lightgray',
          }}
        >
          <Stack direction={'column'} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              date and time
            </Typography>
          </Stack>
          <Stack direction={'column'} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Appointment Type
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              appointment type
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <EditCalendarIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  } else if (selectedIndex === 2) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          History of Appointments
        </Typography>
        {/* appointments list  */}
        <Box
          sx={{
            borderRadius: '10px',
            p: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid lightgray',
          }}
        >
          <Stack direction={'row'} sx={{ width: '50%', alignItems: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              date and time
            </Typography>
          </Stack>
          <Stack direction={'row'} sx={{ width: '50%', alignItems: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Appointment Type
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              appointment type
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            borderRadius: '10px',
            p: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid lightgray',
          }}
        >
          <Stack direction={'row'} sx={{ width: '50%', alignItems: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              date and time
            </Typography>
          </Stack>
          <Stack direction={'row'} sx={{ width: '50%', alignItems: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Appointment Type
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              appointment type
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            borderRadius: '10px',
            p: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid lightgray',
          }}
        >
          <Stack direction={'row'} sx={{ width: '50%', alignItems: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              date and time
            </Typography>
          </Stack>
          <Stack direction={'row'} sx={{ width: '50%', alignItems: 'center' }}>
            <Typography variant="body2" color={grey['400']}>
              Appointment Type
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              appointment type
            </Typography>
          </Stack>
        </Box>
        {/* pagination  */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'center',
          }}
        >
          <Pagination count={3} color="primary" />
        </Box>
      </Box>
    );
  } else if (selectedIndex === 3) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        <Typography variant="h6" color={grey['400']}>
          User is logged out...
        </Typography>
      </Box>
    );
  }
};
