import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isModalOpen: boolean;
  isAuth: boolean;
  authInfo: {
    email: string;
    phone_number: string;
    family_name: string;
    given_name: string;
    'custom:role': string;
  } | null;
  error: null | string;
}

const initialState: AuthState = {
  isModalOpen: false,
  isAuth: false,
  authInfo: null,
  error: null,
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
      state.isAuth = true;
      state.authInfo = {
        email: action.payload.email,
        phone_number: action.payload.phone_number,
        family_name: action.payload.family_name,
        given_name: action.payload.given_name,
        'custom:role': action.payload['custom:role'],
      };
    },
    loadErrorInfo: (state, action) => {
      state.isAuth = false;
      state.isModalOpen = false;
      state.error = action.payload.error;
    },
    clearAuthInfo: (state) => {
      state.isAuth = false;
      state.isModalOpen = false;
      state.authInfo = null;
      state.error = null;
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
