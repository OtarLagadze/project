import React, { useEffect, useState } from "react"
import './App.scss'
import './globals.scss'
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Contests from "./pages/Contests"
import Profile from "./pages/Profile"
import ProblemsetProblem from "./pages/ProblemsetProblem"
import { auth } from "./firebase"
import { useDispatch, useSelector } from "react-redux"
import { selectStarted, selectUserId, setActiveUser, tickCountdown } from "./features/userSlice"
import { db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"
import PrivateRoute from "./components/PrivateRoute"
import NotFound from "./components/NotFound"

function App() {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const started = useSelector(selectStarted);

  useEffect(() => {
    let intervalId;
    if (started) {
      intervalId = setInterval(() => {
        dispatch(tickCountdown());
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [started, dispatch]);

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
            <Route element={<PrivateRoute url='/401'/>}>
              <Route path="/contests" element={<Contests />} />
            </Route>

            <Route path="/problemset/problem/:problemId" element={<ProblemsetProblem />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/401" element={<NotFound msg={'გთხოვთ გაიაროთ ავტორიზაცია'}/>} />
            <Route path="/405" element={<NotFound msg={'თქვენ არ გაქვთ ამ გვერდზე წვდომის უფლება'}/>} />
            <Route path="*" element={<NotFound msg={'ეს გვერდი თქვენთვის მიუწვდომელია'}/>} />
        </Routes> }
      </div>
    </div>
  )
}

export default App
