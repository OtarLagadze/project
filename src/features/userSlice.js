import { createSlice } from '@reduxjs/toolkit';

const variants = [
  ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "20", "19", "21", "22", "23", "24"],
  ["6", "5", "9", "8", "7", "10", "12", "11", "16", "15", "14", "13", "17", "18", "19", "20", "24", "23", "22", "21"],
  ["7", "6", "5", "8", "9", "13", "11", "12", "10", "15", "17", "14", "16", "18", "20", "19", "21", "24", "23", "22"],
];

const initialState = {
  userId: null,
  userName: null,
  userClassId: null,
  verdicts: [],
  tasks: [],
  usedTasks: null,
  started: null,
  countdown: 1800
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.userClassId = action.payload.userClassId;
      state.verdicts = [];
      state.usedTasks = 0;
      state.tasks = variants[Math.floor(Math.random() % 3)];
      // state.tasks = variants[0];
      state.started = false;
    },
    setLogOutUser: (state) => {
      state.userName = null;
      state.userId = null;
      state.userClassId = null;
      state.verdicts = [];
      state.usedTasks = 0;
      state.tasks = [];
      state.started = false;
      state.countdown = 1800;
    },
    setVerdicts: (state, action) => {
      state.verdicts = action.payload;
    },
    updateVerdicts: (state, action) => {
      const { verdict } = action.payload;
      state.verdicts[state.usedTasks] = verdict;
      state.usedTasks += 1;
    },
    updateStarted: (state, action) => {
      state.started = action.payload;
      if (action.payload) {
        state.countdown = 1800;
      }
    },
    tickCountdown: (state) => {
      if (state.countdown > 0) {
        state.countdown -= 1;
      }
    },
    resetCountdown: (state) => {
      state.countdown = 1800;
    }
  }
});

export const {
  setActiveUser,
  setLogOutUser,
  updateVerdicts,
  updateStarted,
  tickCountdown,
  resetCountdown,
  setVerdicts
} = userSlice.actions;

export const selectUserId = state => state.user.userId;
export const selectUserName = state => state.user.userName;
export const selectUserClassId = state => state.user.userClassId;
export const selectVerdicts = state => state.user.verdicts;
export const selectUsedTasks = state => state.user.usedTasks;
export const selectTasks = state => state.user.tasks;
export const selectStarted = state => state.user.started;
export const selectCountdown = state => state.user.countdown;

export default userSlice.reducer;
