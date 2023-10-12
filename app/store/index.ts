import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { bookReducer } from './bookSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  book: bookReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
