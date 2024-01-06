import React from 'react'

import { auth, provider, signInWithPopup } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setLogOutUser,
  selectUserName,
  selectUserPhotoUrl,
  selectUserRole,
  selectUserId
} from '../features/userSlice'

function Profile() {
  const dispatch = useDispatch();

  const userName = useSelector(selectUserName);
  const userPhotoUrl = useSelector(selectUserPhotoUrl);
  const userRole = useSelector(selectUserRole);
  const userId = useSelector(selectUserId);

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((err) => {
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    auth.signOut().then(() => {
      dispatch(setLogOutUser());
    }).catch((err) => {
      console.log(err.message);
    })
  }

  return (
    <div>
      <div>{userName}</div>
      <div>{userId}</div>
      <div>{userRole}</div>
      <img src={userPhotoUrl}/>
      {
        userName ? (
          <button onClick={handleSignOut}>sign out</button>
        ) : (
          <button onClick={handleSignIn}>sign in</button>
        )
      }
    </div>
  )
}

export default Profile