import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wordPairsReducer from './slices/wordPairsSlice';
import fillInBlanksReducer from './slices/fillInBlanksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wordPairs: wordPairsReducer,
    fillInBlanks: fillInBlanksReducer,
  },
});