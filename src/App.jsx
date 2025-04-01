import React, { useEffect, useState } from "react";
import './App.scss';
import './globals.scss';
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@components/Navbar";
import Home from "@pages/Home";
import Posts from "@pages/posts/Posts";
import Contests from "@pages/tests/Contests";
import Class from "@pages/class/Class";
import Problemset from "@pages/problemset/Problemset";
import Sports from "@pages/Sports";
import Chat from "@pages/Chat";
import Profile from "@pages/profile/Profile";
import ProblemsetProblem from "@pages/problemset/ProblemsetProblem";
import PostsPost from "@pages/posts/PostsPost";
import ClassPage from "@pages/class/ClassPage";
import AddProblem from "@pages/forms/AddProblem";
import AddPost from "@pages/forms/AddPost";
import PrivateRoute from "@components/PrivateRoute";
import NotFound from "@components/NotFound";
import AddTopic from "@pages/forms/AddTopic";
import AddTest from "@pages/forms/AddTest";

import { db, auth } from "@src/firebaseInit";
import { useDispatch } from "react-redux";
import { setLogOutUser, setActiveUser } from "@features/userSlice";
import { doc, getDoc } from "firebase/firestore";
import CreateTest from "@pages/forms/CreateTest";
import TestDistributor from "@pages/tests/TestDistributor";
import TestRunning from "@pages/tests/TestRunning";
import Register from "@pages/auth/Register";
import Login from "@pages/auth/Login";
import TestOffline from "@pages/tests/TestOffline";

function App() {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();

            dispatch(setActiveUser({
              userId: user.uid,
              userName: userData.username || "No Username",
              userRole: userData.role || "No Role",
              userClassId: userData.classId || null,
              userClassGroups: userData.classGroups || [],
              userVerified: userData.isVerified || false,
              userCity: userData.city || "No city",
              userSchool: userData.school || "No school",
              userEmail: userData.email || "No email",
              userBirthday: userData.birthday || "No birthday",
              userIsHeadTeacher: userData.isHeadTeacher || false,
              userGrade: userData.grade || null,
              userGradeId: userData.gradeId || null,
              userSubject: userData.subject || "No subject",
              userClass_uid: userData.class_uid || '',
            }));

            console.log("Fetched user data:", userData);
          } else {
            console.warn("User document does not exist in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        dispatch(setLogOutUser());
        console.log("User signed out, removing active user");
      }
    });

    return () => unsubscribe(); 
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
            <Route path="/" element={<Navigate to="/posts/page/1" />} />

            <Route element={<PrivateRoute role={'teacher'} url='/405' />}>
              <Route path="/addPost" element={<AddPost />} />
              <Route path="/addProblem" element={<AddProblem />} />
              <Route path="/addTest" element={<AddTest />} />
              <Route path="/createTest" element={<CreateTest />} />

              <Route element={<PrivateRoute role={'containClass'} url='/405' />}>
                <Route path="/addTopic/:class_uid/:subject_uid" element={<AddTopic />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute role={'nonGuest'} url='/401'/>}>
              <Route path="/class" element={<Class />} />
              <Route path="/tests/:pageId" element={<Contests />} />
              {/* <Route path="/tests/tests/:testId" element={<TestDistributor />} /> */}
              <Route path="/tests/view/:testId" element={<TestOffline />} />
              {/* <Route path="/tests/test/:testId" element={<TestDistributor />} /> */}
            </Route>

            <Route element={<PrivateRoute role={'containClass'} url='/405'/>}>
              <Route path="/tests/:classId/:subject/:recordId/:testId" element={<TestDistributor />} />
              <Route path="/class/:class_uid/:subject_uid" element={<ClassPage />} />
            </Route>

            <Route path="/posts/page/:pageId" element={<Posts />} />
            <Route path="/posts/:postId" element={<PostsPost />} />

            <Route path="/problemset/:pageId" element={<Problemset />} />
            <Route path="/problemset/problem/:problemId" element={<ProblemsetProblem />} />

            <Route path="/sports" element={<Sports />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/401" element={<NotFound msg={'გთხოვთ გაიაროთ ავტორიზაცია'}/>} />
            <Route path="/405" element={<NotFound msg={'თქვენ არ გაქვთ ამ გვერდზე წვდომის უფლება'}/>} />
            <Route path="*" element={<NotFound msg={'ეს გვერდი არ არსებობს'}/>} />
        </Routes> }
      </div>
    </div>
  );
}

export default App;
