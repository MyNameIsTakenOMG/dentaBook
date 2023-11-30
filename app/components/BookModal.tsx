'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import Modal from '@mui/material/Modal';
import { RootState, useAppDispatch, useAppSelector } from '../store';
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
  bookAppointment,
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
  apptTypeAndDuration,
  appt_types,
} from '@/app/utils/bookingAppt';
import axios from 'axios';
import Script from 'next/script';
Amplify.configure({ ...awsExports, ssr: true });

const steps = ['DATE & TIME', 'PATIENT INFO', 'CONFIRM'];

export default function BookModal() {
  const isModalOpen = useAppSelector((state) => state.book.isModalOpen);
  const dispatch = useAppDispatch();
  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const [activeStep, setActiveStep] = useState(0);
  // client info section
  const [userInfo, setUserInfo] = useState({
    extra: '',
    family_name: authInfo ? authInfo.family_name : '',
    given_name: authInfo ? authInfo.given_name : '',
    email: authInfo ? authInfo.email : '',
    phone_number: authInfo ? authInfo.phone_number : '',
  });
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((pre) => ({
      ...pre,
      [e.target.id]: e.target.value,
    }));
  };
  // appointment info section
  const [selectedApptType, setSelectedApptType] = useState('');
  const debouncedType = useDebounce<string>(selectedApptType, 500);
  const [ApptDate, setApptDate] = useState<dayjs.Dayjs | null>(null);
  const [timeslot, setTimeslot] = useState<null | {
    start: string;
    end: string;
  }>(null);
  const handleTypeChange = (type: string) => {
    return () => {
      setSelectedApptType(type);
    };
  };
  // trigger calling api endpoint '/findtimeslots' to find available time slots,
  // but first call google calendar to fetch holidays
  useEffect(() => {
    if (debouncedType !== '') {
      dispatch(findAvailableTimeSlots({ type: debouncedType as ApptType }));
    }
    return () => {};
  }, [debouncedType]);

  // next and back buttons
  const handleNext = async () => {
    if (activeStep === 0) {
      // if userInfo.extra !=='', then it's bot submission
      if (userInfo.extra !== '') return;

      // transform user input data
      let transformed = {
        email: userInfo.email.toLowerCase().trim(),
        phone_number: userInfo.phone_number.trim(),
        family_name: userInfo.family_name.toLowerCase().trim(),
        given_name: userInfo.given_name.toLowerCase().trim(),
      };
      setUserInfo((pre) => ({
        ...pre,
        ...transformed,
      }));
      // apply zod validation schema
      let copyUserInfo = {
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        family_name: userInfo.family_name,
        given_name: userInfo.given_name,
      };
      const result = userInfoSchema.safeParse(copyUserInfo);
      if (result.success) {
        // TODO: send a request to /clientUpcoming to make sure
        // if the user has an upcoming appointment or not
        // also create a custom snackbar to listen to certain errors or other events
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/clientUpcoming`,
            {
              email: userInfo.email,
              phone: userInfo.phone_number,
              fname: userInfo.family_name,
              gname: userInfo.given_name,
            }
          );
          console.log('upcoming appointment: ', response.data);
          if (response.data.hasUpcoming !== 'no')
            dispatch(
              loadBookingError({
                errorType: BookingErrorType.user,
                error: 'upcoming appointment found',
              })
            );
          else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }
        } catch (error) {
          console.log('cannot fetch client appointment information');
          dispatch(
            loadBookingError({
              errorType: BookingErrorType.user,
              error: 'failed to fetch client appointment information',
            })
          );
        }
      } else {
        let inputError: any = {};
        result.error.issues.map((issue) => {
          inputError.path = issue.path[0];
          inputError.message = issue.message;
        });
        dispatch(
          loadBookingError({
            errorType: BookingErrorType.userInput,
            error: inputError,
          })
        );
      }
    } else if (activeStep === 1) {
      // check if apointment type and time slot have been chosen
      if (selectedApptType !== '' && timeslot && ApptDate) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else
        dispatch(
          loadBookingError({
            errorType: BookingErrorType.appt,
            error: 'Please select type or date&time for the appointment',
          })
        );
    } else if (activeStep === 2) {
      // submit all booking data
      // transform date data first
      let year = ApptDate!.year();
      let month = ApptDate!.month() + 1; // 0 - 11
      let day = ApptDate!.date();

      // transform the userInfo data
      let copyUserInfo = {
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        family_name: userInfo.family_name,
        given_name: userInfo.given_name,
      };

      // submit the data
      let bookingInfo = {
        userInfo: copyUserInfo,
        type: debouncedType,
        timeslot: timeslot!,
        apptDate: `${year}-${month < 10 ? '0' + month : month}-${
          day < 10 ? '0' + day : day
        }`, // should be the format : yyyy-mm-dd
      };
      // dispatch a 'booking' action to submit the body to the endpoint '/book'
      dispatch(bookAppointment({ bookingInfo: bookingInfo }));
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
            debouncedType={debouncedType}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            handleClose={handleClose}
            selectedApptType={selectedApptType}
            handleTypeChange={handleTypeChange}
            ApptDate={ApptDate}
            setApptDate={setApptDate}
            timeslot={timeslot}
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
  debouncedType,
  activeStep,
  setActiveStep,
  handleClose,
  selectedApptType,
  handleTypeChange,
  ApptDate,
  setApptDate,
  timeslot,
  setTimeslot,
  userInfo,
  handleUserInfoChange,
  stepNaviButtons,
}: {
  debouncedType: string;
  activeStep: number;
  setActiveStep: (value: React.SetStateAction<number>) => void;
  handleClose: () => void;
  selectedApptType: string;
  handleTypeChange: (type: string) => () => void;
  ApptDate: dayjs.Dayjs | null;
  setApptDate: (ApptDate: dayjs.Dayjs | null) => void;
  timeslot: null | {
    start: string;
    end: string;
  };
  setTimeslot: React.Dispatch<
    React.SetStateAction<{
      start: string;
      end: string;
    } | null>
  >;
  userInfo: {
    extra: string;
    family_name: string;
    given_name: string;
    email: string;
    phone_number: string;
  };
  handleUserInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stepNaviButtons: ReactNode;
}) => {
  const [openMoreOptions, setOpenMoreOptions] = useState(false);
  const dispatch = useAppDispatch();
  const errorType = useAppSelector((state: RootState) => state.book.errorType);
  const error = useAppSelector((state) => state.book.error);
  const targetDate = useAppSelector((state) => state.book.targetDate);
  const availableTimeSlots = useAppSelector(
    (state) => state.book.availableTimeslots
  );
  const pickedDateTimeslots = useAppSelector(
    (state) => state.book.pickedDateTimeslots
  );

  // trigger calling api endpoint '/dateAvailable' to find available time slots
  // for the selected date-- ApptDate
  const [pickedDate, setPickedDate] = useState<dayjs.Dayjs | null>(null);
  const debouncedPickedDate = useDebounce<dayjs.Dayjs | null>(pickedDate, 500);
  useEffect(() => {
    if (debouncedPickedDate !== null) {
      // call the endpoint to fetch '/findtimeslot' and update the local
      // 'pickedDateTimeslots'
      // note: if picked date is the current date, then shows nothing, cuz
      // booking apppointments on the current date is not appropriate
      let pickedDate = debouncedPickedDate.toDate().toDateString();
      dispatch(
        findAvailableTimeSlots({
          type: debouncedType as ApptType,
          pickedDate: pickedDate,
        })
      );
    }
    return () => {};
  }, [debouncedPickedDate]);

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
  // patient info
  else if (activeStep === 0) {
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
          position: 'relative',
        }}
      >
        {/*  for bot submissions  */}
        <TextField
          type="text"
          value={userInfo.extra}
          label="extra"
          id="extra"
          onChange={handleUserInfoChange}
          sx={{ position: 'absolute', zIndex: 1, opacity: 0 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            rowGap: '1rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <TextField
            type="text"
            required
            autoFocus
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
        </Box>
        {stepNaviButtons}
      </Box>
    );
  }
  // appointment info
  else if (activeStep === 1) {
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
                    '&:hover': { outline: '1px solid lightblue' },
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
            {targetDate
              ? `${targetDate} ${dayjs(targetDate).isoWeekday()}: ${
                  availableTimeSlots[0].start
                }--${availableTimeSlots[0].end}`
              : ''}
          </Typography>
          <Button
            disableElevation
            variant="contained"
            onClick={() => {
              setApptDate(dayjs(targetDate));
              setTimeslot(availableTimeSlots[0]);
              setActiveStep((pre) => pre + 1);
            }}
          >
            Schedule it
          </Button>
          <Divider />
          <Button
            disableElevation
            variant="outlined"
            color="warning"
            onClick={() => {
              setApptDate(dayjs(targetDate));
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
              onChange={(newDate) => {
                setApptDate(newDate);
                setPickedDate(newDate);
              }}
              disableHighlightToday={false}
              disablePast={true}
            />
            {/* available time slots  */}
            <Stack direction={'column'}>
              <Typography color={grey['500']}>Time Slots</Typography>
              <Box sx={{ display: 'flex', flexFlow: 'row' }}>
                {pickedDateTimeslots !== undefined ? (
                  <>
                    {pickedDateTimeslots.map((t, index) => {
                      return (
                        <Box
                          onClick={() => {
                            setTimeslot(t);
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
                              bgcolor:
                                timeslot?.start === t.start &&
                                timeslot.end === t.end
                                  ? blue['600']
                                  : 'unset',
                              color:
                                timeslot?.start === t.start &&
                                timeslot.end === t.end
                                  ? 'white'
                                  : blue['600'],
                              width: '95%',
                              height: '40px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'pointer',
                              '&:hover': { outline: '1px solid lightblue' },
                            }}
                          >
                            <Typography>
                              {t.start}-{t.end}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {availableTimeSlots.map((t, index) => {
                      return (
                        <Box
                          onClick={() => {
                            setTimeslot(t);
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
                              bgcolor:
                                timeslot?.start === t.start &&
                                timeslot.end === t.end
                                  ? blue['600']
                                  : 'unset',
                              color:
                                timeslot?.start === t.start &&
                                timeslot.end === t.end
                                  ? 'white'
                                  : blue['600'],
                              width: '95%',
                              height: '40px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'pointer',
                              '&:hover': { outline: '1px solid lightblue' },
                            }}
                          >
                            <Typography>
                              {t.start}-{t.end}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                  </>
                )}
              </Box>
            </Stack>
          </>
        )}
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
            <Typography sx={{ color: grey['800'] }}>{debouncedType}</Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Date
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              {ApptDate?.toDate().toDateString()}
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Time
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              {`${timeslot?.start} -- ${timeslot?.end}`}
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
              {`${userInfo.given_name} ${userInfo.family_name}`}
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Email
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              {userInfo.email}
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Typography sx={{ color: grey['500'], fontWeight: 'bold' }}>
              Phone Number
            </Typography>
            <Typography sx={{ color: grey['800'] }}>
              {userInfo.phone_number}
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
