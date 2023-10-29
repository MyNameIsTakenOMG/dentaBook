'use client';
import React, { ReactNode, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '../store';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { closeModal } from '../store/bookSlice';
import { blue, grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from '@/app/utils/dayjs';
Amplify.configure({ ...awsExports, ssr: true });

const steps = ['DATE & TIME', 'PATIENT INFO', 'CONFIRM'];
const appointment_types = [
  'Emergency',
  'Cleaning',
  'Dental Implant',
  'Treatment',
  'Dental Exam',
];
const appointment_duration = {
  Emergency: 'long',
  Cleaning: 'short',
  'Dental Implant': 'long',
  Treatment: 'short',
  'Dental Exam': 'short',
};

export default function BookModal() {
  const isModalOpen = useAppSelector((state) => state.book.isModalOpen);
  const dispatch = useAppDispatch();

  const [activeStep, setActiveStep] = useState(0);
  // appointment info section
  const [selectedAppmtType, setSelectedAppmtType] = useState('');
  const [appmtDate, setAppmtDate] = useState<dayjs.Dayjs | null>(
    dayjs(undefined)
  );
  const [timeslot, setTimeslot] = useState('');
  const handleTypeChange = (type: string) => {
    return () => {
      setSelectedAppmtType(type);
      // trigger event of fetching appointments via calling api
      // and timeslotsFinder to find all the availalble time slots
      // note: may need to move forward multiple times when trying to
      // find any available slots
      // custom logic here ...(go to redux to create asyncThunk)
      // also add a new api route
    };
  };
  // client info section
  const [family_name, setFamily_name] = useState('');
  const [given_name, setGiven_name] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone_number] = useState('');

  const handleNext = () => {
    if (activeStep === 0) {
      // check if apointment type and time slot have been chosen
      if (selectedAppmtType !== '' && timeslot !== '' && appmtDate)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      else window.alert('please select appointment type or date and time');
    } else if (activeStep === 1) {
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleClose = () => {
    setActiveStep(0);
    dispatch(closeModal());
  };

  return (
    <>
      <Modal open={isModalOpen} sx={{ overflowY: 'auto' }}>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '600px',
            minHeight: '100vh',
            bgcolor: 'background.paper',
            display: 'flex',
            flexFlow: 'column',
            rowGap: '1rem',
          }}
        >
          {/* header  */}
          <Stack
            direction={'row'}
            sx={{
              backgroundColor: blue['600'],
              color: 'white',
              p: '0.5rem 1rem',
              position: 'relative',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" sx={{ alignSelf: 'center' }}>
              Book Your Appointment
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                top: '0.25rem',
                right: '1rem',
              }}
              color="inherit"
              onClick={() => {
                dispatch(closeModal());
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          {/* steppers  */}
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {/* stepper contents  */}
          <StepperContents
            activeStep={activeStep}
            handleClose={handleClose}
            selectedAppmtType={selectedAppmtType}
            handleTypeChange={handleTypeChange}
            appmtDate={appmtDate}
            setAppmtDate={setAppmtDate}
            setTimeslot={setTimeslot}
            email={email}
            family_name={family_name}
            given_name={given_name}
            phone_number={phone_number}
            setEmail={setEmail}
            setFamily_name={setFamily_name}
            setGiven_name={setGiven_name}
            setPhone_number={setPhone_number}
            stepNaviButtons={
              <StepNaviButtons
                activeStep={activeStep}
                handleBack={handleBack}
                handleNext={handleNext}
              />
            }
          />
        </Box>
      </Modal>
    </>
  );
}

const StepperContents = ({
  activeStep,
  handleClose,
  selectedAppmtType,
  handleTypeChange,
  appmtDate,
  setAppmtDate,
  setTimeslot,
  family_name,
  given_name,
  email,
  phone_number,
  setEmail,
  setFamily_name,
  setGiven_name,
  setPhone_number,
  stepNaviButtons,
}: {
  activeStep: number;
  handleClose: () => void;
  selectedAppmtType: string;
  handleTypeChange: (type: string) => () => void;
  appmtDate: dayjs.Dayjs | null;
  setAppmtDate: (appmtDate: dayjs.Dayjs | null) => void;
  setTimeslot: React.Dispatch<React.SetStateAction<string>>;
  family_name: string;
  given_name: string;
  email: string;
  phone_number: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setFamily_name: React.Dispatch<React.SetStateAction<string>>;
  setGiven_name: React.Dispatch<React.SetStateAction<string>>;
  setPhone_number: React.Dispatch<React.SetStateAction<string>>;
  stepNaviButtons: ReactNode;
}) => {
  const [openMoreOptions, setOpenMoreOptions] = useState(false);
  // finished booking appointments
  if (activeStep === steps.length) {
    return (
      <Box sx={{ p: '1.5rem' }}>
        <Typography sx={{ mt: 2, mb: 1 }}>
          You have successfully booked an appointment!
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleClose}>close</Button>
        </Box>
      </Box>
    );
  }
  // appointment info
  else if (activeStep === 0) {
    return (
      <Box
        sx={{
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        {/* appointment type section  */}
        <Typography
          variant="h6"
          sx={{ alignSelf: 'center', color: grey['500'], fontWeight: 'bold' }}
        >
          Appointment Type
        </Typography>
        <Box sx={{ display: 'flex', flexFlow: 'row wrap' }}>
          {appointment_types.map((type, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: '50%',
                  height: '90px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Paper
                  onClick={handleTypeChange(type)}
                  elevation={3}
                  sx={{
                    bgcolor: selectedAppmtType === type ? blue['600'] : 'unset',
                    color: selectedAppmtType === type ? 'white' : blue['600'],
                    width: '95%',
                    height: '80px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': { outline: '1px solid blue' },
                  }}
                >
                  <Typography>{type}</Typography>
                </Paper>
              </Box>
            );
          })}
        </Box>
        <Divider />
        {/* appointment date & time section  */}
        <Stack
          direction={'column'}
          rowGap={'0.5rem'}
          alignItems={'center'}
          sx={{
            bgcolor: grey['200'],
            mb: '1.5rem',
            p: '0.8rem',
            borderRadius: '20px',
          }}
        >
          <Typography variant="body1">
            The next available appointment is on:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            date and time of the available appointment
          </Typography>
          <Button disableElevation variant="contained">
            Schedule it
          </Button>
          <Divider />
          <Button
            disableElevation
            variant="outlined"
            color="warning"
            onClick={() => {
              setOpenMoreOptions((pre) => !pre);
            }}
          >
            More options
          </Button>
        </Stack>
        {openMoreOptions && (
          <>
            <Typography
              variant="h6"
              sx={{
                alignSelf: 'center',
                color: grey['500'],
                fontWeight: 'bold',
              }}
            >
              Select Date and Time
            </Typography>
            {/* calendar  */}
            <DateCalendar
              value={appmtDate}
              onChange={(newDate) => setAppmtDate(newDate)}
              disableHighlightToday={false}
              disablePast={true}
            />
            {/* available time slots  */}
            <Stack direction={'column'}>
              <Typography color={grey['500']}>Time Slots</Typography>
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
                    <Typography>9:30</Typography>
                  </Paper>
                </Box>
              </Box>
            </Stack>
          </>
        )}
        {stepNaviButtons}
      </Box>
    );
  }
  // patient info
  else if (activeStep === 1) {
    return (
      <Box
        component={'form'}
        autoComplete="off"
        noValidate
        sx={{
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        <TextField
          type="text"
          required
          value={family_name}
          label="Family Name"
          id="family_name"
        />
        <TextField
          type="text"
          required
          value={given_name}
          label="Given Name"
          id="given_name"
        />
        <TextField
          type="email"
          required
          value={email}
          label="Email"
          id="email"
        />
        <TextField
          type="tel"
          required
          value={phone_number}
          label="Phone Number"
          id="phone_number"
        />
        {stepNaviButtons}
      </Box>
    );
  }
  // appointment confirmation
  else if (activeStep === 2) {
    return (
      <Box
        sx={{
          p: '1.5rem',
          display: 'flex',
          flexFlow: 'column',
          rowGap: '1rem',
        }}
      >
        {/* appointment summary  */}
        <Typography
          variant="body1"
          sx={{ color: grey['500'], fontWeight: 'bold' }}
        >
          Appointment Summary
        </Typography>
        <Stack direction={'column'} rowGap={'1rem'}>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Type
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              the type of appointment
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Date
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              the date of appointment
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Time
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              the time of appointment
            </Typography>
          </Stack>
        </Stack>
        {/* divider  */}
        <Divider />
        {/* patient summary  */}
        <Typography
          variant="body1"
          sx={{ color: grey['500'], fontWeight: 'bold' }}
        >
          Patient Summary
        </Typography>
        <Stack direction={'column'} rowGap={'1rem'}>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Name
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              the name of patient
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Email
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              the email of patient
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Phone Number
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              the phone number of patient
            </Typography>
          </Stack>
        </Stack>
        {stepNaviButtons}
      </Box>
    );
  }
};

const StepNaviButtons = ({
  activeStep,
  handleBack,
  handleNext,
}: {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
      <Button
        color="inherit"
        disabled={activeStep === 0}
        onClick={handleBack}
        sx={{ mr: 1 }}
      >
        Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={handleNext}>
        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </Box>
  );
};
