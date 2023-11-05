'use client';
import React, { ReactNode, useEffect, useState } from 'react';
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
import {
  closeModal,
  findAvailableTimeSlots,
  loadBookingError,
} from '../store/bookSlice';
import { blue, grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from '@/app/utils/dayjs';
import { userInfoSchema } from '../utils/zodSchema';
import useDebounce from '../hooks/useDebounce';
import {
  ApptType,
  BookingErrorType,
  appt_types,
} from '@/app/utils/bookingAppt';
Amplify.configure({ ...awsExports, ssr: true });

const steps = ['DATE & TIME', 'PATIENT INFO', 'CONFIRM'];

export default function BookModal() {
  const isModalOpen = useAppSelector((state) => state.book.isModalOpen);
  const dispatch = useAppDispatch();
  const authInfo = useAppSelector((state) => state.auth.authInfo);

  const [activeStep, setActiveStep] = useState(0);
  // appointment info section
  const [selectedApptType, setSelectedApptType] = useState('');
  const debouncedType = useDebounce(selectedApptType, 800);
  const [ApptDate, setApptDate] = useState<dayjs.Dayjs | null>(
    dayjs(undefined)
  );
  const [timeslot, setTimeslot] = useState<null | {
    start: string;
    end: string;
  }>(null);
  const handleTypeChange = (type: string) => {
    return () => {
      setSelectedApptType(type);
    };
  };
  // trigger calling api to find available time slots
  useEffect(() => {
    if (debouncedType !== '') {
      dispatch(findAvailableTimeSlots(debouncedType as ApptType));
    }
    return () => {};
  }, [debouncedType]);

  // client info section
  const [userInfo, setUserInfo] = useState({
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
  });
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((pre) => ({
      ...pre,
      [e.target.id]: e.target.value,
    }));
  };
  const handleNext = () => {
    if (activeStep === 0) {
      // check if apointment type and time slot have been chosen
      if (selectedApptType !== '' && timeslot && ApptDate) {
        // then populate the authInfo to the userInfo section
        // if the client is already logged in
        if (authInfo) {
          setUserInfo({
            family_name: authInfo.family_name,
            given_name: authInfo.given_name,
            email: authInfo.email,
            phone_number: authInfo.phone_number,
          });
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else
        dispatch(
          loadBookingError({
            errorType: BookingErrorType.appt,
            error: 'Please select type or date&time for the appointment',
          })
        );
    } else if (activeStep === 1) {
      // transform user input data
      let transformed = {
        email: userInfo.email.toLowerCase(),
        phone_number: userInfo.phone_number,
        family_name: userInfo.family_name.toLowerCase(),
        given_name: userInfo.given_name.toLowerCase(),
      };
      setUserInfo((pre) => ({
        ...transformed,
      }));
      // apply zod validation schema
      const result = userInfoSchema.safeParse(userInfo);
      if (result.success) setActiveStep((prevActiveStep) => prevActiveStep + 1);
      else {
        let inputError: any = {};
        result.error.issues.map((issue) => {
          inputError.path = issue.path[0];
          inputError.message = issue.message;
        });
        dispatch(
          loadBookingError({
            errorType: BookingErrorType.user,
            error: inputError,
          })
        );
      }
    } else if (activeStep === 2) {
      // submit all booking data
      // transform date data first
      const theDate = `${ApptDate?.year()}-${
        ApptDate!.month() + 1
      }-${ApptDate?.date()}`;
      const time = timeslot;
      const type = selectedApptType;

      // submit the data to decide if it is available to
      // book an appointment
      // ...
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
            selectedApptType={selectedApptType}
            handleTypeChange={handleTypeChange}
            ApptDate={ApptDate}
            setApptDate={setApptDate}
            setTimeslot={setTimeslot}
            userInfo={userInfo}
            handleUserInfoChange={handleUserInfoChange}
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
  selectedApptType,
  handleTypeChange,
  ApptDate,
  setApptDate,
  setTimeslot,
  userInfo,
  handleUserInfoChange,
  stepNaviButtons,
}: {
  activeStep: number;
  handleClose: () => void;
  selectedApptType: string;
  handleTypeChange: (type: string) => () => void;
  ApptDate: dayjs.Dayjs | null;
  setApptDate: (ApptDate: dayjs.Dayjs | null) => void;
  setTimeslot: React.Dispatch<
    React.SetStateAction<{
      start: string;
      end: string;
    } | null>
  >;
  userInfo: {
    family_name: string;
    given_name: string;
    email: string;
    phone_number: string;
  };
  handleUserInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stepNaviButtons: ReactNode;
}) => {
  const [openMoreOptions, setOpenMoreOptions] = useState(false);
  const errorType = useAppSelector((state) => state.book.errorType);
  const error = useAppSelector((state) => state.book.error);

  const availableTimeSlots = useAppSelector((state) => state.book.timeslots);

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
          {appt_types.map((type, index) => {
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
                    bgcolor: selectedApptType === type ? blue['600'] : 'unset',
                    color: selectedApptType === type ? 'white' : blue['600'],
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
              value={ApptDate}
              onChange={(newDate) => setApptDate(newDate)}
              disableHighlightToday={false}
              disablePast={true}
            />
            {/* available time slots  */}
            <Stack direction={'column'}>
              <Typography color={grey['500']}>Time Slots</Typography>
              <Box sx={{ display: 'flex', flexFlow: 'row' }}>
                {availableTimeSlots.length !== 0 ? (
                  <>
                    {availableTimeSlots.map((timeslot, index) => {
                      return (
                        <Box
                          onClick={() => {
                            setTimeslot(timeslot);
                          }}
                          key={index}
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
                            <Typography>
                              {timeslot.start}-{timeslot.end}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
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
          value={userInfo.family_name}
          label="Family Name"
          id="family_name"
          onChange={handleUserInfoChange}
          error={
            errorType === 'user' &&
            typeof error !== null &&
            typeof error !== 'string' &&
            error?.path === 'family_name'
          }
          helperText={
            typeof error !== null && typeof error !== 'string'
              ? error?.message
              : null
          }
        />
        <TextField
          type="text"
          required
          value={userInfo.given_name}
          label="Given Name"
          id="given_name"
          onChange={handleUserInfoChange}
          error={
            errorType === 'user' &&
            typeof error !== null &&
            typeof error !== 'string' &&
            error?.path === 'given_name'
          }
          helperText={
            typeof error !== null && typeof error !== 'string'
              ? error?.message
              : null
          }
        />
        <TextField
          type="email"
          required
          value={userInfo.email}
          label="Email"
          id="email"
          onChange={handleUserInfoChange}
          error={
            errorType === 'user' &&
            typeof error !== null &&
            typeof error !== 'string' &&
            error?.path === 'email'
          }
          helperText={
            typeof error !== null && typeof error !== 'string'
              ? error?.message
              : null
          }
        />
        <TextField
          type="tel"
          required
          value={userInfo.phone_number}
          label="Phone Number"
          id="phone_number"
          onChange={handleUserInfoChange}
          error={
            errorType === 'user' &&
            typeof error !== null &&
            typeof error !== 'string' &&
            error?.path === 'phone_number'
          }
          helperText={
            typeof error !== null && typeof error !== 'string'
              ? error?.message
              : null
          }
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
