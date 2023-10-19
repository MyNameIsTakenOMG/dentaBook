'use client'
import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
// import { Amplify } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
// Amplify.configure({ ...awsExports, ssr: true });

export default function CancelAppointmentModal({ openCancelAppointmentModal, setOpenCancelAppointmentModal }: { openCancelAppointmentModal: boolean, setOpenCancelAppointmentModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Dialog open={openCancelAppointmentModal} >
      <DialogTitle>
        Sure to cancel this appointment?
      </DialogTitle>
      <DialogContent>
        <DialogContentText >
          Once the appointment is cancelled, the operation cannot be reverted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpenCancelAppointmentModal(false) }} color='error'>Disagree</Button>
        <Button onClick={() => { setOpenCancelAppointmentModal(false) }} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
