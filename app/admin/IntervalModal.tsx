'use client'
import { Box, Button, FormControlLabel, IconButton, Modal, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
// import { Amplify } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
// Amplify.configure({ ...awsExports, ssr: true });

export default function IntervalModal({ openIntervalModal, setOpenIntervalModal }: { openIntervalModal: boolean, setOpenIntervalModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Modal open={openIntervalModal} sx={{ overflowY: 'auto', zIndex: 1255 }}>
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
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Set Re-Exam Interval</Typography>
          <IconButton onClick={() => {
            setOpenIntervalModal(false);
          }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ px: '1.5rem', pb: '1.25rem' }}>
          <Stack direction={'row'} alignItems={'center'} columnGap={'1.5rem'} sx={{ mb: '0.8rem' }}>
            <Typography sx={{ fontWeight: 'bold' }}>Choose time unit: </Typography>
            <RadioGroup
              row

            >
              <FormControlLabel value="week" control={<Radio />} label="Week" />
              <FormControlLabel value="month" control={<Radio />} label="Month" />
              <FormControlLabel value="year" control={<Radio />} label="Year" />
            </RadioGroup>
          </Stack>

          <Stack direction={'row'} alignItems={'center'} columnGap={'1.5rem'} sx={{ mb: '0.8rem' }}>
            <Typography sx={{ fontWeight: 'bold' }}>Please specify the time length: </Typography>
            <TextField
              size='small'
              type='number'
              inputProps={{
                min: 0
              }}
              defaultValue={0}
            />
          </Stack>
        </Box>
        <Stack direction={'row'} sx={{ p: '0.5rem', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-end', flex: '0 0 auto' }}>
          <Button
            onClick={() => {
              setOpenIntervalModal(false);
            }}
            disableElevation
            color="error"
          >
            discard
          </Button>
          <Button
            onClick={() => {
              setOpenIntervalModal(false);
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
