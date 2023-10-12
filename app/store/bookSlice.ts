import { createSlice } from '@reduxjs/toolkit';

interface BookState {
  isModalOpen: boolean;
}

const initialState: BookState = {
  isModalOpen: false,
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
  },
});

export const { closeModal, openModal } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
