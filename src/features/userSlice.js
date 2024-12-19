import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userName: null,
  userClassId: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userName = action.payload.userName;
      state.userClassId = action.payload.userClassId;
      state.userId = action.payload.userId;
    },
    setLogOutUser: (state) => {
      state.userName = null;
      state.userClassId = null;
      state.userId = null;
    }
  }
});

export const {
  setActiveUser,
  setLogOutUser
} = userSlice.actions;

export const selectUserName = state => state.user.userName;
export const selectUserClassId = state => state.user.userClassId;
export const selectUserId = state => state.user.userId;

export default userSlice.reducer;
