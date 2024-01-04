import React, { useState } from "react"
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
import Profile from "./pages/profile"
import ProblemsetSubject from "./pages/ProblemsetSubject"
import ProblemsetProblem from "./pages/ProblemsetProblem"
import PostsPost from "./pages/PostsPost"
import ClassPage from "./pages/ClassPage"

function App() {
  const [active, setActive] = useState(true);

  return (
    <div className="main">
      <div className="navHeader">
        <div className='menu' onClick={() => setActive(!active)}>
          <img src="/svg/sidebar/menu.svg" alt="menu"/>
        </div>
        {/* <div className="text">
          <p>მთავარი</p>
        </div> */}
      </div>

      <div className='nav-holder' style={{width: active ? '' : '0px'}}>
        <Navbar />
      </div>

      <div className="mainRender">
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
      </div>
    </div>
  )
}

export default App
