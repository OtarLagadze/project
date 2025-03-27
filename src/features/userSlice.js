import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userId: null,
  userName: null,
  userPhotoUrl: null,
  userRole: null,
  userVerified: null,
  userClassId: null,
  userClassGroups: null,
  userCity: null,
  userSchool: null,
  userIsHeadTeacher: null,
  userEmail: null,
  userBirthday: null,
  userGrade: null,
  userGradeId: null,
  userSubject: null,
  userClass_uid: null
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
      state.userVerified = action.payload.userVerified
      state.userClassId = action.payload.userClassId
      state.userClassGroups = action.payload.userClassGroups,
      state.userCity = action.payload.userCity
      state.userSchool = action.payload.userSchool
      state.userIsHeadTeacher = action.payload.userIsHeadTeacher
      state.userEmail = action.payload.userEmail,
      state.userBirthday = action.payload.userBirthday
      state.userGrade = action.payload.userGrade
      state.userGradeId = action.payload.userGradeId
      state.userSubject = action.payload.userSubject
      state.userClass_uid = action.payload.userClass_uid
    },
    setLogOutUser: state => {
      state.userName = null
      state.userPhotoUrl = null
      state.userRole = null
      state.userId = null
      state.userVerified = null
      state.userClassId = null
      state.userClassGroups = null
      state.userCity = null
      state.userSchool = null
      state.userIsHeadTeacher = null
      state.userEmail = null
      state.userBirthday = null
      state.userGrade = null
      state.userGradeId = null
      state.userSubject = null
      state.userClass_uid = null
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
export const selectUserVerified = state => state.user.userVerified
export const selectUserClassId = state => state.user.userClassId
export const selectUserClassGroups = state => state.user.userClassGroups
export const selectUserCity = state => state.user.userCity
export const selectUserSchool = state => state.user.userSchool
export const selectUserIsHeadTeacher = state => state.user.userIsHeadTeacher
export const selectUserEmail = state => state.user.userEmail
export const selectUserBirthday = state => state.user.userBirthday
export const selectUserGrade = state => state.user.userGrade
export const selectUserGradeId = state => state.user.userGradeId
export const selectUserSubject = state => state.user.userSubject
export const selectUserClass_uid = state => state.user.userClass_uid

export default userSlice.reducer