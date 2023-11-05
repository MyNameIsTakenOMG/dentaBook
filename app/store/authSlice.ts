import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isModalOpen: boolean;
  isLoading: boolean;
  authInfo: {
    email: string;
    phone_number: string;
    family_name: string;
    given_name: string;
    'custom:role': string;
  } | null;
  errorType: 'userInput' | 'internalError' | 'badRequest' | null;
  error:
    | string
    | null
    | {
        path: string;
        message: string;
      };
  timestamp: string | null;
}

const initialState: AuthState = {
  isModalOpen: false,
  isLoading: true,
  authInfo: null,
  error: null,
  errorType: null,
  timestamp: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    loadAuthInfo: (state, action) => {
      state.isModalOpen = false;
      state.isLoading = false;
      if (action.payload)
        state.authInfo = {
          email: action.payload.email,
          phone_number: action.payload.phone_number,
          family_name: action.payload.family_name,
          given_name: action.payload.given_name,
          'custom:role': action.payload['custom:role'],
        };
    },
    loadErrorInfo: (state, action) => {
      state.isLoading = false;
      state.isModalOpen = false;
      state.error = action.payload.error;
      state.errorType = action.payload.errorType;
    },
    clearAuthInfo: (state) => {
      state.isLoading = true;
      state.isModalOpen = false;
      state.authInfo = null;
      state.error = null;
      state.errorType = null;
      state.timestamp = null;
    },
  },
});

export const {
  clearAuthInfo,
  closeModal,
  loadAuthInfo,
  loadErrorInfo,
  openModal,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
