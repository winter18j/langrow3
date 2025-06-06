import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wordPairsReducer from './slices/wordPairsSlice';
import fillInBlanksReducer from './slices/fillInBlanksSlice';
import wordScrambleReducer from './slices/wordScrambleSlice';
import mapReducer from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wordPairs: wordPairsReducer,
    fillInBlanks: fillInBlanksReducer,
    wordScramble: wordScrambleReducer,
    map: mapReducer,
  },
});