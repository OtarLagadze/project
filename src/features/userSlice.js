import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userName: null,
  userPhotoUrl: null,
  userRole: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userName = action.payload.userName
      state.userPhotoUrl = action.payload.userPhotoUrl
      state.userRole = action.payload.userRole
    },
    setLogOutUser: state => {
      state.userName = null
      state.userPhotoUrl = null
      state.userRole = null
    }
  }
});

export const {
  setActiveUser,
  setLogOutUser
} = userSlice.actions

export const selectUserName = state => state.user.userName
export const selectUserPhotoUrl = state => state.user.userPhotoUrl
export const selectUserRole = state => state.user.userRole

export default userSlice.reducer