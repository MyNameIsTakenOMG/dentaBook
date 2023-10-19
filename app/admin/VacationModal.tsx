'use client'
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import dayjs from '@/app/utils/dayjs'
import { DatePicker } from '@mui/x-date-pickers';
import { blue } from '@mui/material/colors';

export default function VacationModal({ openVacationModal, setOpenVacationModal, option }: { openVacationModal: boolean, setOpenVacationModal: React.Dispatch<React.SetStateAction<boolean>>, option: 'Add' | 'Update' | 'Cancel' }) {

  const [startDate, setStartDate] = useState(dayjs(undefined))
  const [endDate, setEndDate] = useState(dayjs(undefined))

  return (
    <Modal open={openVacationModal} sx={{ overflowY: 'auto', zIndex: 1255 }}>
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
          color: blue['500']
        }}
      >
        <Stack direction={'row'} sx={{ p: '1rem 1.5rem' }} justifyContent={'space-between'}>
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{option} the appointment</Typography>
          <IconButton onClick={() => {
            setOpenVacationModal(false);
          }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ px: '1.5rem', pb: '1.25rem' }}>
          <Stack direction={'row'} alignItems={'center'} columnGap={'1.5rem'} sx={{ mb: '0.8rem' }}>
            <Typography sx={{ fontWeight: 'bold', width: '40%' }}>
              Start date:
            </Typography>
            <DatePicker
              value={startDate}
              onChange={(newValue) => {
                if (newValue) setStartDate(newValue)
              }} />
          </Stack>
          <Stack direction={'row'} alignItems={'center'} columnGap={'1.5rem'} sx={{ mb: '0.8rem' }}>
            <Typography sx={{ fontWeight: 'bold', width: '40%' }}>
              End date:
            </Typography>
            <DatePicker
              value={startDate}
              onChange={(newValue) => {
                if (newValue) setStartDate(newValue)
              }} />
          </Stack>
        </Box>
        <Stack direction={'row'} sx={{ p: '0.5rem', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-end', flex: '0 0 auto' }}>
          <Button
            onClick={() => {
              setOpenVacationModal(false);
            }}
            disableElevation
            color="error"
          >
            discard
          </Button>
          <Button
            onClick={() => {
              setOpenVacationModal(false);
            }}
            disableElevation
            color="primary"
          >
            confirm
          </Button>

        </Stack>
      </Box>
    </Modal>
  )
}
