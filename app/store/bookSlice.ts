import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ApptType, BookingErrorType } from '../utils/bookingAppt';

export interface BookState {
  isModalOpen: boolean;
  bookingStatus: 'success' | 'error' | null;
  errorType: BookingErrorType | null;
  error:
    | string
    | null
    | {
        path: string;
        message: string;
      };
  timestamp: string | null;
  availableTimeslots: [] | { start: string; end: string }[];
  targetDate: null | string;
  // pickedDate: null | string;
  pickedDateTimeslots: undefined | [] | { start: string; end: string }[];
  isLoading: boolean;
}

interface BookingInfoType {
  userInfo: {
    email: string;
    phone_number: string;
    family_name: string;
    given_name: string;
  };
  type: string;
  timeslot: {
    start: string;
    end: string;
  };
  apptDate: string;
}

export const bookAppointment = createAsyncThunk(
  'book/bookAppointment',
  async (
    { bookingInfo }: { bookingInfo: BookingInfoType },
    { rejectWithValue }
  ) => {
    try {
      // the whole body data needs to be sanitized and validated at the backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/book`,
        bookingInfo
      );
      console.log('successfully booked an appointment', response.data);
      return response.data;
    } catch (error) {
      console.log('booking an appointment error: ', error);
      return rejectWithValue({ message: 'failed to book an appointment' });
    }
  }
);

interface BodyType {
  type: ApptType;
  // when dateString is specified (for admin and client), it will start from the (date + 1) to find the next available date and time slots
  dateString?: string;
  // when pickedDate is specified (for client), it will fetch the availability of the specific date
  pickedDate?: string;
  // dateString and pickedDate cannot be specified both, or throw an exception (bad request)
  // both dateString and pickedDate are strings of date potion of the given date, for example, "Wed Jul 28 1993"
  // when neither dateString nor pickedDate is specified, then it will start from the (current date + 1) to find the next available date and time slots.
}

export const findAvailableTimeSlots = createAsyncThunk(
  'book/findAvailableTimeSlots',
  async (
    {
      type,
      dateString,
      pickedDate,
    }: { type: ApptType; dateString?: string; pickedDate?: string },
    { rejectWithValue }
  ) => {
    try {
      let body: BodyType = {
        type: type,
        dateString: undefined,
        pickedDate: undefined,
      };
      if (dateString) body.dateString = dateString;
      if (pickedDate) body.pickedDate = pickedDate;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/findtimeslot`,
        body
      );
      console.log('available date and time slots: ', response.data);
      return response.data;
    } catch (error) {
      console.log('fetch time slots error: ', error);
      return rejectWithValue({ message: 'failed to fetch time slots' });
    }
  }
);

const initialState: BookState = {
  isModalOpen: false,
  bookingStatus: null,
  errorType: null,
  error: null,
  timestamp: null,
  targetDate: null, // 'yyyy-mm-dd'
  availableTimeslots: [],
  pickedDateTimeslots: undefined,
  isLoading: false,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    loadBookingError: (state, action) => {
      state.timestamp = new Date().toString();
      state.error = action.payload.error;
      state.errorType = action.payload.errorType;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findAvailableTimeSlots.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(findAvailableTimeSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.targetDate) {
          state.targetDate = action.payload.targetDate;
          state.availableTimeslots = action.payload.availableTimeslots;
        }
        // picked date
        else {
          state.pickedDateTimeslots = action.payload.availableTimeslots;
        }
      })
      .addCase(findAvailableTimeSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.errorType = BookingErrorType.appt;
        state.error = (action.payload as { message: string }).message;
        state.timestamp = new Date().toString();
      });
  },
});

export const { closeModal, openModal, loadBookingError } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
