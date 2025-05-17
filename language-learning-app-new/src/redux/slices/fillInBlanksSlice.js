import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/ipaddress';

const API_URL = BASE_URL;

export const fetchSentences = createAsyncThunk(
  'fillInBlanks/fetchSentences',
  async ({ language }, { getState }) => {
    const response = await axios.get(`${API_URL}/fill-in-blanks`, {
      params: { language }
    });
    return response.data;
  }
);

const fillInBlanksSlice = createSlice({
  name: 'fillInBlanks',
  initialState: {
    sentences: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSentences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSentences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sentences = action.payload;
      })
      .addCase(fetchSentences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default fillInBlanksSlice.reducer; 