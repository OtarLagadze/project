import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUser,
  setLogOutUser,
  selectUserName,
  selectUserId,
  selectUserClassId,
} from "@features/userSlice";
import { db } from "@src/firebaseInit";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import './Profile.scss'; // Import the new stylesheet

function Profile() {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const userClassId = useSelector(selectUserClassId);

  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [classId, setClassId] = useState("");
  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState('');

  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  };

  const handleSignUp = async () => {
    if (!username || !classId) {
      setMessage("გთხოვთ შეავსოთ ყველა ველი");
      return;
    }

    const newUserCode = generateCode();
    try {
      const userRef = doc(db,'users', newUserCode);
      await setDoc(userRef, {
        username: username,
        classId: classId,
        userId: newUserCode,
      });

      dispatch(
        setActiveUser({
          userName: username,
          userClassId: classId,
          userId: userRef.id,
        })
      );

      setMessage(`თქვენ წარმატებით დარეგისტრირდით! თქვენი კოდია: ${newUserCode}`);
      setUsername("");
      setClassId("");
      setShowLogin(true);  // After successful registration, switch to login form
    } catch (error) {
      console.log(error.message);
      setMessage(`დაფიქსირდა შეცდომა: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!userCode) {
      setMessage("გთხოვთ ჩაწეროთ თქვენი კოდი");
      return;
    }

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("userId", "==", userCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("კოდი არასწორია");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      dispatch(
        setActiveUser({
          userName: userData.username,
          userClassId: userData.classId,
          userId: querySnapshot.docs[0].id,
        })
      );
      setMessage("თქვენ წარმატებით შეხვედით სისტემაში");
      setUserCode("");
    } catch (error) {
      setMessage(`დაფიქსირდა შეცდომა: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    dispatch(setLogOutUser());
    await storage.removeItem('persist:root'); // Clear persisted Redux state
    setMessage("თქვენ გამოხვედით სისტემიდან");
  };

  return (
    <div className="profile-container">
      {userName ? (
        // Profile view
        <div className="profile-view">
          <h1>მოგესალმებით, {userName}!</h1>
          <h1>თქვენი კოდი: {userId}</h1>
          <h1>თქვენი კლასი: {userClassId}</h1>
          <button className="btn sign-out" onClick={handleSignOut}>გამოსვლა</button>
        </div>
      ) : (
        // Sign-up or login view
        <div className="auth-view">
          {showLogin ? (
            <div className="login-form">
              <h1>შესვლა</h1>
              <input
                type="text"
                placeholder="ჩაწერეთ თქვენი კოდი"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="input"
              />
              <button onClick={handleLogin} className="btn">შესვლა</button>
              <button onClick={() => setShowLogin(false)} className="link-btn">
                რეგისტრაცია
              </button>
            </div>
          ) : (
            <div className="signup-form">
              <h1>რეგისტრაცია</h1>
              <input
                type="text"
                placeholder="ჩაწერეთ სახელი და გვარი"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
              />
              <select value={classId} onChange={(e) => setClassId(e.target.value)} className="select">
                <option value="">აირჩიეთ თქვენი კლასი</option>
                <option value="10ა">10ა</option>
                <option value="10ბ">10ბ</option>
                <option value="10გ">10გ</option>
                <option value="10დ">10დ</option>
                <option value="10ე">10ე</option>
                <option value="10ვ">10ვ</option>
              </select>
              <button onClick={handleSignUp} className="btn">რეგისტრაცია</button>
              <button onClick={() => setShowLogin(true)} className="link-btn">
                შესვლა
              </button>
            </div>
          )}
        </div>
      )}
      <div>
      {message && <h1 className="message">{message}</h1>}
      </div>
    </div>
  );
}

export default Profile;
