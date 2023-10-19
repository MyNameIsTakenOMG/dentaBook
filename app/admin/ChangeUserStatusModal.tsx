'use client'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, MenuItem, Modal, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material'
import { blue, green } from '@mui/material/colors'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
// import { Amplify } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
// Amplify.configure({ ...awsExports, ssr: true });

export default function ChangeUserStatusModal({ openUserStatusModal, setOpenUserStatusModal }: { openUserStatusModal: boolean, setOpenUserStatusModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Dialog open={openUserStatusModal} >
      <DialogTitle sx={{ color: blue['500'] }}>
        Sure to change status for this client?
      </DialogTitle>
      <DialogContent sx={{ color: blue['500'] }}>
        <Stack direction={'row'} alignItems={'center'} columnGap={'1.5rem'} sx={{ mb: '0.8rem' }}>
          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>Client Status: </Typography>
          <Select size='small'>
            <MenuItem value={'active'}>Active</MenuItem>
            <MenuItem value={'inactive'}>Inactive</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpenUserStatusModal(false) }} color='error'>discard</Button>
        <Button onClick={() => { setOpenUserStatusModal(false) }} autoFocus>
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
