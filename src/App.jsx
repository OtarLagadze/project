import React, { useEffect, useState } from "react"
import './App.scss'
import './globals.scss'
import { Route, Routes } from "react-router-dom"
import Navbar from "@components/Navbar"
import Home from "@pages/Home"
import Posts from "@pages/posts/Posts"
import Contests from "@pages/tests/Contests"
import Class from "@pages/class/Class"
import Problemset from "@pages/problemset/Problemset"
import Sports from "@pages/Sports"
import Chat from "@pages/Chat"
import Profile from "@pages/Profile"
import ProblemsetProblem from "@pages/problemset/ProblemsetProblem"
import PostsPost from "@pages/posts/PostsPost"
import ClassPage from "@pages/class/ClassPage"
import AddProblem from "@pages/forms/AddProblem"
import AddPost from "@pages/forms/AddPost"
import PrivateRoute from "@components/PrivateRoute"
import NotFound from "@components/NotFound"
import AddTopic from "@pages/forms/AddTopic"
import AddTest from "@pages/forms/AddTest"

import { db, auth } from "@src/firebaseInit"
import { useDispatch, useSelector } from "react-redux"
import { selectUserId, selectUserRole, setActiveUser } from "@features/userSlice"
import { doc, getDoc } from "firebase/firestore"
import CreateTest from "@pages/forms/CreateTest"
import TestDistributor from "@pages/tests/TestDistributor"

function App() {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        setLoading(user ? true : false);
        if (!user) return;

        const docRef = doc(db, 'users', user.uid);
        const res = (await getDoc(docRef)).data()

        dispatch(
          setActiveUser({
            userName: user.displayName,
            userPhotoUrl: user.photoURL,
            userId: user.uid,
            userClassId: '10გ',
            userRole: res.role,
            userClassGroups: res.role === 'teacher' ? res.classGroups : []
          })
        );
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      setLoading(false);
      return;
    }
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

            <Route element={<PrivateRoute role={'teacher'} url='/405' />}>
              <Route path="/addPost" element={<AddPost />} />
              <Route path="/addProblem" element={<AddProblem />} />
              <Route path="/addTest" element={<AddTest />} />
              <Route path="/createTest" element={<CreateTest />} />

              <Route element={<PrivateRoute role={'containClass'} url='/405' />}>
                <Route path="/addTopic/:classId/:subject" element={<AddTopic />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute role={'nonGuest'} url='/401'/>}>
              <Route path="/class" element={<Class />} />
              <Route path="/tests/:pageId" element={<Contests />} />
            </Route>

            <Route element={<PrivateRoute role={'containClass'} url='/405'/>}>
              <Route path="/tests/:classId/:subject/:recordId/:testId" element={<TestDistributor />} />
              <Route path="/class/:classId/:subject" element={<ClassPage />} />
            </Route>

            <Route path="/posts/page/:pageId" element={<Posts />} />
            <Route path="/posts/:postId" element={<PostsPost />} />

            <Route path="/problemset/:pageId" element={<Problemset />} />
            <Route path="/problemset/problem/:problemId" element={<ProblemsetProblem />} />

            <Route path="/tests/tests/:testId" element={<TestDistributor />} />

            <Route path="/sports" element={<Sports />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/401" element={<NotFound msg={'გთხოვთ გაიაროთ ავტორიზაცია'}/>} />
            <Route path="/405" element={<NotFound msg={'თქვენ არ გაქვთ ამ გვერდზე წვდომის უფლება'}/>} />
            <Route path="*" element={<NotFound msg={'ეს გვერდი არ არსებობს'}/>} />
        </Routes> }
      </div>
    </div>
  )
}

export default App
