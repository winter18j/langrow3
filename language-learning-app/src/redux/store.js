import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wordPairsReducer from './slices/wordPairsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wordPairs: wordPairsReducer,
  },
});