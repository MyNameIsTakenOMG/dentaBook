'use client';
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
// import { Amplify } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
// Amplify.configure({ ...awsExports, ssr: true });

const options = ['Upcoming', 'Attended', 'Missed', 'Pending', 'Cancelled'];

export default function AppointmentModal({
  openAppointmentModal,
  setOpenAppointmentModal,
}: {
  openAppointmentModal: boolean;
  setOpenAppointmentModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [value, setValue] = useState(options[0]);
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };
  const handleConfirm = () => {
    setOpenAppointmentModal(false);
  };
  const handleDiscard = () => {
    setOpenAppointmentModal(false);
  };

  return (
    <Modal open={openAppointmentModal} sx={{ overflowY: 'auto', zIndex: 1255 }}>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          minHeight: '60vh',
          bgcolor: 'background.paper',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
          color: blue['500'],
        }}
      >
        <Stack
          direction={'row'}
          sx={{ p: '1rem 1.5rem' }}
          justifyContent={'space-between'}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Appointment Details
          </Typography>
          <IconButton
            onClick={() => {
              setOpenAppointmentModal(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Box sx={{ px: '1.5rem', pb: '1.25rem' }}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ mb: '0.8rem' }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              Appointment Time:
            </Typography>
            <Typography variant="body2">12:30PM - 13:30PM</Typography>
          </Stack>

          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ mb: '0.8rem' }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              Appointment Type:
            </Typography>
            <Typography variant="body2">Clean up</Typography>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ mb: '0.8rem' }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>Client Name:</Typography>
            <Typography variant="body2">Sean Fang</Typography>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ mb: '0.8rem' }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>Phone Number:</Typography>
            <Typography variant="body2">12334578</Typography>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ mb: '0.8rem' }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>Email:</Typography>
            <Typography variant="body2">123@123.com</Typography>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            columnGap={'1.5rem'}
            sx={{ mb: '0.8rem' }}
            justifyContent={'space-between'}
          >
            <Stack direction={'row'} alignItems={'center'} columnGap={'0.8rem'}>
              <Typography sx={{ fontWeight: 'bold' }}>
                Appointment Status:
              </Typography>
              <Select
                size="small"
                value={value}
                label="Status"
                onChange={handleChange}
              >
                {options.map((option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </Stack>
            <Button variant="contained" disableElevation color="warning">
              update
            </Button>
          </Stack>
        </Box>
        <Stack
          direction={'row'}
          sx={{
            p: '0.5rem',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: '0 0 auto',
          }}
        >
          <Button onClick={handleDiscard} disableElevation color="error">
            discard
          </Button>
          <Button onClick={handleConfirm} disableElevation color="primary">
            confirm
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
