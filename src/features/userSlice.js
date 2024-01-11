import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userId: null,
  userName: null,
  userPhotoUrl: null,
  userRole: null,
  userClassId: null,
  userClassGroups: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userName = action.payload.userName
      state.userPhotoUrl = action.payload.userPhotoUrl
      state.userRole = action.payload.userRole
      state.userId = action.payload.userId
      state.userClassId = action.payload.userClassId
      state.userClassGroups = action.payload.userClassGroups
    },
    setLogOutUser: state => {
      state.userName = null
      state.userPhotoUrl = null
      state.userRole = null
      state.userId = null
      state.userClassId = null
      state.userClassGroups = null
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
export const selectUserId = state => state.user.userId
export const selectUserClassId = state => state.user.userClassId
export const selectUserClassGroups = state => state.user.userClassGroups


export default userSlice.reducer