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
import { useDispatch, useSelector } from "react-redux"
import { selectUserName, setActiveUser } from "./features/userSlice"

function App() {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading((userName !== null ? true : false));
      if (!user) return;
      dispatch(setActiveUser({
        userName: user.displayName,
        userPhotoUrl: user.photoURL
      }))
      setLoading(false);
    })

    return unsubscribe
  }, [])

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
        </Routes>
        }
      </div>
    </div>
  )
}

export default App
