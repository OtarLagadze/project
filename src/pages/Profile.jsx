import React from 'react'

import { auth, provider, signInWithPopup } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setActiveUser, 
  setLogOutUser,
  selectUserName,
  selectUserPhotoUrl,
  selectUserRole
} from '../features/userSlice'

function Profile() {
  const dispatch = useDispatch();

  const userName = useSelector(selectUserName);
  const userPhotoUrl = useSelector(selectUserPhotoUrl);
  const userRole = useSelector(selectUserRole);

  const handleSignIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      dispatch(setActiveUser({
        userName: result.user.displayName,
        userPhotoUrl: result.user.photoURL
      }))
    }).catch((err) => {
      alert(err.message);
    })
  }

  const handleSignOut = () => {
    auth.signOut().then(() => {
      dispatch(setLogOutUser());
    }).catch((err) => {
      alert(err.message);
    })
  }

  return (
    <div>
      <div>{userName}</div>
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