import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  ApptType,
  BookingErrorType,
  apptTypeAndDuration,
} from '../utils/bookingAppt';

export interface BookState {
  isModalOpen: boolean;
  bookingStatus: 'success' | 'error' | null;
  errorType: 'appt' | 'user' | 'submit' | null;
  error:
    | string
    | null
    | {
        path: string;
        message: string;
      };
  timestamp: string | null;
  timeslots: [] | { start: string; end: string }[];
  isLoading: boolean;
}

// export const bookAppointment = createAsyncThunk(
//   'book/bookAppointment',
//   async()
// )

export const findAvailableTimeSlots = createAsyncThunk(
  'book/findAvailableTimeSlots',
  async (debouncedType: ApptType, { rejectWithValue }) => {
    try {
      // fetch holidays for the next 3 years
      // ...
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/findtimeslot`,
        {
          duration: apptTypeAndDuration[debouncedType],
        }
      );
      console.log('time slots: ', response.data);
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
  timeslots: [],
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
      (state.bookingStatus = 'error'),
        (state.timestamp = new Date().toString());
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
        state.timeslots = action.payload.timeslots;
      })
      .addCase(findAvailableTimeSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.errorType = BookingErrorType.appt;
        state.error = (action.payload as { message: string }).message;
      });
  },
});

export const { closeModal, openModal, loadBookingError } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
