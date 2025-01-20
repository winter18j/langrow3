import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVisibleOnMap: false,
  userMessage: '',
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setVisibleOnMap: (state, action) => {
      state.isVisibleOnMap = action.payload;
    },
    setUserMessage: (state, action) => {
      state.userMessage = action.payload;
    },
  },
});

export const { setVisibleOnMap, setUserMessage } = mapSlice.actions;
export default mapSlice.reducer; 