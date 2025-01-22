import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.0.126:3000';

export const fetchWordPairs = createAsyncThunk(
  'wordPairs/fetchWordPairs',
  async ({ sourceLanguage, targetLanguage }, { getState }) => {
    const { auth: { token } } = getState();
    const response = await axios.get(`${API_URL}/word-pairs`, {
      params: {
        sourceLanguage,
        targetLanguage
      }
    });
    return response.data;
  }
);

const wordPairsSlice = createSlice({
  name: 'wordPairs',
  initialState: {
    pairs: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentLanguage: null
  },
  reducers: {
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWordPairs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWordPairs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pairs = action.payload;
      })
      .addCase(fetchWordPairs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setCurrentLanguage } = wordPairsSlice.actions;
export default wordPairsSlice.reducer; 