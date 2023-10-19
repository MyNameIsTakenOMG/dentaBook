'use client';
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import { grey } from '@mui/material/colors';
Amplify.configure({ ...awsExports, ssr: true });

export default function SearchAndUpdateModal({
  openUpdateModal,
  setOpenUpdateModal,
}: {
  openUpdateModal: boolean;
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [openDateInput, setOpenDateInput] = useState(false);
  const [dateInput, setDateInput] = useState<string | null>('');
  const handleOpenDateInputChange = () => {
    if (openDateInput) {
      setOpenDateInput(false);
      setDateInput('');
    } else setOpenDateInput(true);
  };

  return (
    <Dialog open={openUpdateModal}>
      <DialogTitle>Update the appointment</DialogTitle>
      <DialogContent>
        <Stack direction={'row'} columnGap={'0.8rem'}>
          <FormControlLabel
            control={
              <Checkbox
                checked={openDateInput}
                onChange={handleOpenDateInputChange}
              />
            }
            label="choose start date"
          />
          <DatePicker
            value={dateInput}
            onChange={(newValue) => setDateInput(newValue)}
          />
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
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
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
}
