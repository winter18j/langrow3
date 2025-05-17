import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/ipaddress';

const API_URL = BASE_URL;

export const fetchWords = createAsyncThunk(
  'wordScramble/fetchWords',
  async ({ language, level, difficulty }, { getState }) => {
    console.log('Fetching words with params:', { language, level, difficulty });
    const response = await axios.get(`${API_URL}/word-scramble/words`, {
      params: { language, level, difficulty }
    });
    console.log('Fetched words:', response.data);
    return response.data;
  }
);

const powerUps = [
  {
    id: 'reveal_letter',
    name: 'Letter Reveal',
    description: 'Reveals one random letter',
    cost: 50,
    icon: 'eye'
  },
  {
    id: 'extra_time',
    name: 'Time Boost',
    description: '+15 seconds',
    cost: 75,
    icon: 'timer',
    duration: 15
  },
  {
    id: 'skip_word',
    name: 'Skip Word',
    description: 'Skip current word',
    cost: 100,
    icon: 'play-skip-forward'
  },
  {
    id: 'hint',
    name: 'Hint',
    description: 'Shows word translation',
    cost: 60,
    icon: 'bulb'
  }
];

const wordScrambleSlice = createSlice({
  name: 'wordScramble',
  initialState: {
    words: [],
    currentWord: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    gameState: 'menu', // 'menu' | 'playing' | 'paused' | 'gameOver'
    score: 0,
    timeLeft: 0,
    combo: 0,
    powerUps,
    activePowerUps: [], // power-ups currently active in game
    selectedPowerUps: [], // power-ups selected for use in game
    scrambledLetters: [], // current word's letters in scrambled order
    revealedLetters: {}, // indices of revealed letters from power-ups
    showTranslation: false, // whether to show translation from hint power-up
  },
  reducers: {
    startGame: (state) => {
      state.gameState = 'playing';
      state.score = 0;
      state.combo = 0;
      state.activePowerUps = [];
      state.currentWord = null;
      state.timeLeft = 0;
      state.revealedLetters = {};
      state.showTranslation = false;
    },
    pauseGame: (state) => {
      state.gameState = 'paused';
    },
    resumeGame: (state) => {
      state.gameState = 'playing';
    },
    endGame: (state) => {
      state.gameState = 'gameOver';
    },
    setCurrentWord: (state, action) => {
      state.currentWord = action.payload;
      state.timeLeft = action.payload.timeAllowed;
      state.scrambledLetters = action.payload.word
        .split('')
        .sort(() => Math.random() - 0.5);
      state.revealedLetters = {};
      state.showTranslation = false;
    },
    updateTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    incrementScore: (state, action) => {
      state.score += action.payload;
      state.combo += 1;
    },
    resetCombo: (state) => {
      state.combo = 0;
    },
    selectPowerUp: (state, action) => {
      state.selectedPowerUps.push(action.payload);
    },
    removePowerUp: (state, action) => {
      state.selectedPowerUps = state.selectedPowerUps.filter(
        p => p.id !== action.payload
      );
    },
    activatePowerUp: (state, action) => {
      const powerUp = action.payload;
      state.activePowerUps.push({
        ...powerUp,
        activatedAt: Date.now()
      });

      // Apply power-up effects
      switch (powerUp.id) {
        case 'reveal_letter': {
          const unrevealedIndices = state.currentWord.word
            .split('')
            .map((_, i) => i)
            .filter(i => !state.revealedLetters[i]);
          if (unrevealedIndices.length > 0) {
            const randomIndex = unrevealedIndices[
              Math.floor(Math.random() * unrevealedIndices.length)
            ];
            state.revealedLetters[randomIndex] = true;
          }
          break;
        }
        case 'extra_time':
          state.timeLeft += powerUp.duration;
          break;
        case 'hint':
          state.showTranslation = true;
          break;
        // skip_word is handled in the component
      }
    },
    deactivatePowerUp: (state, action) => {
      const powerUpId = action.payload;
      state.activePowerUps = state.activePowerUps.filter(p => p.id !== powerUpId);

      // Revert power-up effects if needed
      switch (powerUpId) {
        case 'hint':
          state.showTranslation = false;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWords.pending, (state) => {
        console.log('fetchWords: pending');
        state.status = 'loading';
      })
      .addCase(fetchWords.fulfilled, (state, action) => {
        console.log('fetchWords: fulfilled with', action.payload);
        state.status = 'succeeded';
        state.words = action.payload;
      })
      .addCase(fetchWords.rejected, (state, action) => {
        console.log('fetchWords: rejected with error', action.error);
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  setCurrentWord,
  updateTimeLeft,
  incrementScore,
  resetCombo,
  selectPowerUp,
  removePowerUp,
  activatePowerUp,
  deactivatePowerUp,
} = wordScrambleSlice.actions;

export default wordScrambleSlice.reducer; 