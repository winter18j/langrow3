import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import NotificationService from '../../services/NotificationService';

const API_URL = 'http://192.168.1.28:3000';

const initialState = {
  user: null,
  token: null,
  registrationData: null,
  loading: false,
  error: null,
  levelUpNotification: null,
};

export const updateUserData = createAsyncThunk(
  'auth/updateUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user data');
    }
  }
);

export const updatePushToken = createAsyncThunk(
  'auth/updatePushToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, user } = getState().auth;
      if (!user?._id) return;

      const pushToken = await NotificationService.getExpoPushToken();
      if (!pushToken) return;

      await axios.patch(
        `${API_URL}/users/${user._id}`,
        { fcmToken: pushToken }, // We keep the field name as fcmToken for backend compatibility
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return pushToken;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update push token');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      // After successful login, update push token
      dispatch(updatePushToken());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      // After successful registration, update push token
      dispatch(updatePushToken());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegistrationData: (state, action) => {
      state.registrationData = {
        ...state.registrationData,
        ...action.payload
      };
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.registrationData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLevelUpNotification: (state) => {
      state.levelUpNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        const oldLevel = state.user?.level;
        const oldLeague = state.user?.league;
        state.user = action.payload;
        
        // Check for level up or league change
        if (oldLevel && state.user.level > oldLevel) {
          state.levelUpNotification = {
            type: 'LEVEL_UP',
            oldLevel,
            newLevel: state.user.level,
            message: `Félicitations! Vous avez atteint le niveau ${state.user.level}!`
          };
        } else if (oldLeague && state.user.league !== oldLeague) {
          state.levelUpNotification = {
            type: 'LEAGUE_CHANGE',
            oldLeague,
            newLeague: state.user.league,
            message: `Félicitations! Vous êtes maintenant en ligue ${state.user.league}!`
          };
        }
      })
      .addCase(updatePushToken.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          state.user.fcmToken = action.payload;
        }
      });
  },
});

export const selectLoggedIn = (state) => !!state.auth.token;
export const { setRegistrationData, logout, clearError, clearLevelUpNotification } = authSlice.actions;
export default authSlice.reducer;