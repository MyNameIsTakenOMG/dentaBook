'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

// import { Amplify } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import BookModal from '../components/BookModal';
import { useAppDispatch } from '../store';
import { openModal as openBookModal } from '../store/bookSlice';
import RouteProtector from '../components/RouteProtector';

// Amplify.configure({ ...awsExports, ssr: true });

const menu_item_list = [
  'Profile',
  'Next Appointment',
  'History of Appointments',
  'Log Out',
];

export default function ProfilePage() {
  const [selected, setSelected] = useState<number | string>(0);
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelected(index);
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  return (
    <RouteProtector>
      <main className={styles.main}>
        {/* book_an_appointment modal for updating date and time of the upcoming appointment  */}
        <BookModal />

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
              flexFlow: { xs: 'column', md: 'row' },
              width: '100%',
              maxWidth: '1200px',
              justifyContent: { xs: 'unset', md: 'space-between' },
              mt: '3rem',
              p: { xs: '0', md: '2rem' },
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: '30%' },
                display: 'flex',
                flexFlow: 'column',
              }}
            >
              {/* mini list  */}
              <Select
                sx={{ display: { xs: 'block', md: 'none' } }}
                value={
                  typeof selected === 'number'
                    ? menu_item_list[selected]
                    : selected
                }
                onChange={handleSelectChange}
              >
                {menu_item_list.map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>

              <List
                component="nav"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  width: '100%',
                  maxWidth: 270,
                  bgcolor: grey['100'],
                  borderRadius: '30px',
                  overflow: 'hidden',
                  py: 0,
                }}
              >
                {menu_item_list.map((item, index) => {
                  return (
                    <ListItemButton
                      sx={{
                        p: '1.5rem 1rem',
                        borderTop:
                          index === menu_item_list.length - 1
                            ? '1px solid lightgrey'
                            : 'unset',
                      }}
                      key={index}
                      selected={
                        selected === index || selected === menu_item_list[index]
                      }
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
                  );
                })}
              </List>
            </Box>
            <Box
              sx={{
                width: { xs: '100%', md: '70%' },
                display: 'flex',
                flexFlow: 'column',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '750px',
                  p: { xs: '1.5rem 0', md: '1.5rem' },
                  display: 'flex',
                  flexFlow: 'column',
                  rowGap: '1rem',
                }}
              >
                <ProfileContents selected={selected} />
              </Box>
            </Box>
          </Box>
        </Box>
      </main>
    </RouteProtector>
  );
}

const ProfileContents = ({ selected }: { selected: number | string }) => {
  const dispatch = useAppDispatch();

  if (selected === 0 || menu_item_list[0] === selected) {
    return (
      <>
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
              width: { xs: '100%', md: '50%' },
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
              width: { xs: '100%', md: '50%' },
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
              width: { xs: '100%', md: '50%' },
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
              width: { xs: '100%', md: '50%' },
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
      </>
    );
  } else if (selected === 1 || menu_item_list[1] === selected) {
    return (
      <>
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
            overflowX: 'auto',
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
            <IconButton
              onClick={() => {
                dispatch(openBookModal());
              }}
            >
              <EditCalendarIcon />
            </IconButton>
          </Box>
        </Box>
      </>
    );
  } else if (selected === 2 || menu_item_list[2] === selected) {
    return (
      <>
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
            overflowX: 'auto',
          }}
        >
          <Stack
            direction={'column'}
            sx={{ width: '50%', alignItems: 'start' }}
          >
            <Typography variant="body2" color={grey['400']}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              date and time
            </Typography>
          </Stack>
          <Stack
            direction={'column'}
            sx={{ width: '50%', alignItems: 'start' }}
          >
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
            overflowX: 'auto',
          }}
        >
          <Stack
            direction={'column'}
            sx={{ width: '50%', alignItems: 'start' }}
          >
            <Typography variant="body2" color={grey['400']}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              date and time
            </Typography>
          </Stack>
          <Stack
            direction={'column'}
            sx={{ width: '50%', alignItems: 'start' }}
          >
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
      </>
    );
  } else if (selected === 3 || menu_item_list[3] === selected) {
    return (
      <>
        <Typography variant="h6" color={grey['400']}>
          User is logged out...
        </Typography>
      </>
    );
  }
};
