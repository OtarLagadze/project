import React, { useState } from 'react'

import { db } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setLogOutUser,
  selectUserName,
  selectUserId,
  selectUserClassId,
  setActiveUser
} from '../features/userSlice'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import './Profile.scss'

const addUsersToFirestore = async () => {
  return;
  try {
      for (const user of users) {
        const obj = {
          name: user.სახელი,
          lastName: user.გვარი,
          username: user.username,
          password: user.password,
          classId: "10ე"
        };
          await addDoc(collection(db, 'testUsers'), obj);
          console.log(`User ${user.username} added successfully`);
      }
      console.log('All users added to Firestore');
  } catch (error) {
      console.error('Error adding users to Firestore:', error);
  }
};

const SignInComponent = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const loginUser = async (userName, password) => {
    try {
      const q = query(collection(db, 'testUsers'), where('username', '==', userName));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, message: 'გთხოვთ ჩაწეროთ სწორი username' };
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.password === password) {
        return {
          success: true,
          userId: userDoc.id,
          userName: userData.userName,
          userClassId: userData.classId
        };
      } else {
        return { success: false, message: 'პაროლი არასწორია' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginUser(userName, password);
    const variants = [
      ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "20", "19", "21", "22", "23", "24"],
      ["6", "5", "9", "8", "7", "10", "12", "11", "16", "15", "14", "13", "17", "18", "19", "20", "24", "23", "22", "21"],
      ["7", "6", "5", "8", "9", "13", "11", "12", "10", "15", "17", "14", "16", "18", "20", "19", "21", "24", "23", "22"],
    ];

    if (result.success) {
      localStorage.setItem('userId', result.userId);
      dispatch(setActiveUser({
        userId: result.userId,
        userName: userName,
        userClassId: result.userClassId,
        tasks: variants[Math.floor(Math.random() % 3)]
      }));
    } else {
      setError(result.message);
    }
  };

  return (
    <div className='formContainer '>
      <form onSubmit={handleLogin} className='formCard'>
        <div className='formRow'>
          <input 
            type="text"
            value={userName}
            placeholder='მომხმარებლის სახელი'
            onChange={(e) => setUserName(e.target.value)} 
          />
        </div>
        <div className='formRow'>
          <input 
            placeholder='პაროლი'
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {error && <span>{error}</span>}
        <div className='formSubmit'>
          <button type="submit">შესვლა</button>
        </div>
      </form>
    </div>
  )
}

function Profile() {
  const dispatch = useDispatch();

  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const userClassId = useSelector(selectUserClassId);

  const handleSignOut = () => {
    // auth.signOut().then(() => {
      dispatch(setLogOutUser());
    // }).catch((err) => {
    //   console.log(err.message);
    // })
  }

  return (
    <div>
      {
        userName ? (
          <div className='formContainer'>
            <div className="formCard">
              <div>id: {userId}</div>
              <div>username: {userName}</div>
              <div>კლასი: {userClassId}</div>
              <button onClick={handleSignOut}>გამოსვლა</button>
            </div>
          </div>
        ) : (
          <div>
            <SignInComponent />
          </div>
        )
      }
    </div>
  )
}

export default Profile