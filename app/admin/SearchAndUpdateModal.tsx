'use client';
import React, { useState } from 'react';
// import { Amplify } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import dayjs from '@/app/utils/dayjs'
import { blue, grey } from '@mui/material/colors';
// Amplify.configure({ ...awsExports, ssr: true });

export default function SearchAndUpdateModal({
  openUpdateModal,
  setOpenUpdateModal,
}: {
  openUpdateModal: boolean;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [openDateInput, setOpenDateInput] = useState(false);
  const [dateInput, setDateInput] = useState(dayjs(undefined));
  const handleOpenDateInputChange = () => {
    if (openDateInput) {
      setOpenDateInput(false);
      setDateInput(dayjs(undefined));
    } else setOpenDateInput(true);
  };

  return (
    <Modal open={openUpdateModal} sx={{ overflowY: 'auto', zIndex: 1255 }}>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          minHeight: '80vh',
          bgcolor: 'background.paper',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
          color: blue['500']
        }}
      >
        <Stack direction={'row'} sx={{ p: '1rem 1.5rem' }} justifyContent={'space-between'}>
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Update the appointment</Typography>
          <IconButton onClick={() => {
            setOpenUpdateModal(false);
          }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ px: '1.5rem', pb: '1.25rem' }}>
          <Stack direction={'row'} columnGap={'0.8rem'} sx={{ mb: '0.8rem' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={openDateInput}
                  onChange={handleOpenDateInputChange}
                />
              }
              label="choose start date"
            />
            {openDateInput &&
              <DatePicker
                value={dateInput}
                onChange={(newValue) => {
                  if (newValue) setDateInput(newValue)
                }}
              />
            }
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} sx={{ mb: '0.8rem' }}>
            <Button variant="contained" disableElevation>
              next available date
            </Button>
            <Typography sx={{ fontWeight: 'bold' }}>
              wednesday, aug 26 2024
            </Typography>
          </Stack>
          <Divider />
          {/* calendar  */}
          <DateCalendar disableHighlightToday={false} disablePast={true} />
          {/* available time slots  */}
          <Stack direction={'column'}>
            <Typography color={grey['500']}>Morning</Typography>
            <Box sx={{ display: 'flex', flexFlow: 'row' }}>
              <Box
                sx={{
                  width: '25%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: '0.5rem',
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    width: '95%',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { outline: '1px solid blue' },
                  }}
                >
                  <Typography>9:30am</Typography>
                </Paper>
              </Box>
            </Box>
          </Stack>
        </Box>
        <Stack direction={'row'} sx={{ p: '0.5rem', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-end', flex: '0 0 auto' }}>
          <Button
            onClick={() => {
              setOpenUpdateModal(false);
            }}
            disableElevation
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenUpdateModal(false);
            }}
            disableElevation
            color="primary"
          >
            update
          </Button>

        </Stack>
      </Box>
    </Modal>
  );
}
