import React, { useEffect, useState } from "react"
import './App.scss'
import './globals.scss'
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Posts from "./pages/Posts"
import Contests from "./pages/Contests"
import Class from "./pages/Class"
import Problemset from "./pages/Problemset"
import Sports from "./pages/Sports"
import Chat from "./pages/Chat"
import Profile from "./pages/Profile"
import ProblemsetSubject from "./pages/ProblemsetSubject"
import ProblemsetProblem from "./pages/ProblemsetProblem"
import PostsPost from "./pages/PostsPost"
import ClassPage from "./pages/ClassPage"
import { auth } from "./firebase"
import { useDispatch } from "react-redux"
import { setActiveUser } from "./features/userSlice"
import { db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"

function App() {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        setLoading(user ? true : false);
        if (!user) return;

        const docRef = doc(db, 'teachers', user.uid);
        const docSnap = await getDoc(docRef);
        const userRole = (docSnap.exists() ? 'teacher' : 'student');

        dispatch(
          setActiveUser({
            userName: user.displayName,
            userPhotoUrl: user.photoURL,
            userId: user.uid,
            userRole: userRole,
          })
        );
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(fetchData);

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="main">
      <div className="navHeader">
        <div className='menu' onClick={() => setActive(!active)}>
          <img src="/svg/sidebar/menu.svg" alt="menu"/>
        </div>
      </div>

      <div className='nav-holder' style={{width: active ? '' : '0px'}}>
        <Navbar />
      </div>

      <div className="mainRender">
        {!loading && 
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/posts/page/:pageId" element={<Posts />} />s
            <Route path="/posts/:postId" element={<PostsPost />} />

            <Route path="/contests" element={<Contests />} />
            
            <Route path="/class" element={<Class />} />
            <Route path="/class/:classId/:subject" element={<ClassPage />} />

            <Route path="/problemset" element={<Problemset />} />
            <Route path="/problemset/:subject" element={<ProblemsetSubject />} />
            <Route path="/problemset/problem/:problemId" element={<ProblemsetProblem />} />

            <Route path="/sports" element={<Sports />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
        </Routes> }
      </div>
    </div>
  )
}

export default App
