import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@src/firebaseInit";
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
  setLogOutUser,
  selectUserId,
  selectUserName,
  selectUserPhotoUrl,
  selectUserRole,
  selectUserClassId,
  selectUserClassGroups,
  selectUserCity,
  selectUserSchool,
  selectUserIsHeadTeacher,
  selectUserEmail,
  selectUserBirthday,
  selectUserGrade,
  selectUserGradeId,
  selectUserSubject,
  setActiveUser,
  selectUserVerified,
} from "@features/userSlice";
import ReviewRequests from "../auth/ReviewRequests";
import "./Profile.scss";
import PupilVerification from "./PupilVerification";

const cities = ["ქუთაისი"];
const schools = { "ქუთაისი": ["იოსებ ოცხელის სახელობის ქალაქ ქუთაისის №2 საჯარო სკოლა"] };
const grades = [7, 8, 9, 10, 11, 12];
const classIds = ["ა", "ბ", "გ", "დ", "ე", "ვ", "ზ", "თ"];
const subjects = ['მათემატიკა', 'ქართული', 'ინგლისური', 'რუსული', 'ისტორია', 'გეოგრაფია', 'ფიზიკა', 'ქიმია', 'ბიოლოგია', 'ხელოვნება', 'მუსიკა', 'მოქალაქეობა'];

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userPhotoUrl = useSelector(selectUserPhotoUrl);
  const userRole = useSelector(selectUserRole);
  const userClassId = useSelector(selectUserClassId);
  const userClassGroups = useSelector(selectUserClassGroups);
  const userCity = useSelector(selectUserCity);
  const userSchool = useSelector(selectUserSchool);
  const userIsHeadTeacher = useSelector(selectUserIsHeadTeacher);
  const userEmail = useSelector(selectUserEmail);
  const userBirthday = useSelector(selectUserBirthday);
  const userGrade = useSelector(selectUserGrade);
  const userGradeId = useSelector(selectUserGradeId);
  const userSubject = useSelector(selectUserSubject);
  const userVerified = useSelector(selectUserVerified);

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          alert("მონაცემები არ მოიძებნა");
          handleSignOut();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        alert("მომხმარებლის მონაცემები არ მოიძებნა");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(setLogOutUser());
        navigate("/login");
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const handleRequestVerification = async () => {
    if (!userId) return;

    try {
      if (userRole === "teacher") {
        // For teacher, send request to teacherVerificationRequests
        await setDoc(doc(db, "teacherVerificationRequests", userId), {
          userId,
          name: userName,
          role: userRole,
          status: "pending",
          requestDate: new Date(),
        });
      } else if (userRole === "pupil") {
        // For pupil, send request to pupilVerificationRequests
        await setDoc(doc(db, "pupilVerificationRequests", userId), {
          userId,
          name: userName,
          grade: userData.grade,
          classId: userClassId,
          status: "pending",
          requestDate: new Date(),
        });
      }

      alert("მოთხოვნა წარმატებით გაიგზავნა");
    } catch (error) {
      console.error("Error requesting verification: ", error);
      alert("მოთხოვნის გაგზავნის დროს დაფიქსირდა შეცდომა");
    }
  };

  const [role, setRole] = useState(userRole);
  const [formData, setFormData] = useState({
    birthday: userBirthday,
    city: userCity,
    school: userSchool,
    grade: userGrade,
    gradeId: userGradeId,
    classId: userClassId,
    subject: userSubject,
    classGroups: userClassGroups,
    email: userEmail,
    isHeadTeacher: userIsHeadTeacher,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  // When the Head Teacher checkbox changes, clear head-teacher-specific field if unchecked.
  const handleHeadTeacherChange = (e) => {
    const val = e.target.value === "true"; // Converts string to boolean
    setFormData(prevFormData => ({
      ...prevFormData,
      isHeadTeacher: val,
      subject: val ? prevFormData.subject : "", // Clear subject if unchecking
    }));
  };

  // Adds a new (empty) class group entry
  const addClassGroup = () => {
    setFormData({
      ...formData,
      classGroups: [
        ...formData.classGroups,
        { grade: "", gradeId: "", classId: "", subject: "" }
      ]
    });
  };

  // Update a classGroup field. When updating grade or gradeId, recompute combined classId.
  const updateClassGroup = (index, field, value) => {
    const updatedGroups = formData.classGroups.map((group, i) => {
      if (i === index) {
        const updatedGroup = { ...group, [field]: value };
        if (field === "grade" || field === "gradeId") {
          const newGrade = field === "grade" ? value : updatedGroup.grade;
          const newGradeId = field === "gradeId" ? value : updatedGroup.gradeId;
          updatedGroup.classId = `${newGrade}${newGradeId}`;
        }
        return updatedGroup;
      }
      return group;
    });
    setFormData({ ...formData, classGroups: updatedGroups });
  };

  const removeClassGroup = (index) => {
    setFormData({
      ...formData,
      classGroups: formData.classGroups.filter((_, i) => i !== index)
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const mainClassId = `${formData.grade}${formData.gradeId}`;
  
    let validClassGroups = [];
    for (const group of formData.classGroups) {
      if (group.classId === mainClassId) {
        validClassGroups.push(group); // Always keep the main class
        continue;
      }
    
      // Query Firestore to check if the class exists
      const classQuery = query(
        collection(db, "classGroups"),
        where("city", "==", formData.city),
        where("school", "==", formData.school),
        where("classId", "==", group.classId)
      );
    
      const querySnapshot = await getDocs(classQuery);
    
      if (!querySnapshot.empty) {
        // If class exists, add it to the valid list with its Firestore document ID
        const obj = { ...group, class_uid: querySnapshot.docs[0].data().class_uid };
        validClassGroups.push(obj);
      } else {
        // If class doesn't exist, alert and remove it from valid groups
        alert(`${group.classId} კლასი ჯერ არ არის შექმნილი მისი დამრიგებლის მიერ`);
      }
    }

    try {
      // For teachers: if head teacher and main class data is provided, add main class as first element.
      let updatedClassGroups = validClassGroups;
      if (
        role === "teacher" &&
        formData.isHeadTeacher &&
        formData.grade &&
        formData.gradeId &&
        formData.subject
      ) {
        if (!updatedClassGroups.find(group => group.classId === mainClassId)) {
          updatedClassGroups = [
            { grade: formData.grade, gradeId: formData.gradeId, classId: mainClassId, subject: formData.subject },
            ...updatedClassGroups
          ];
        }
      }
  
      // Save user data to Firestore (password is not saved)
      await setDoc(doc(db, "users", userId), {
        role,
        grade: formData.grade,
        gradeId: formData.gradeId,
        classId: mainClassId,
        subject: role === "teacher" ? formData.subject : null,
        classGroups: role === "teacher" ? updatedClassGroups : [],
        isHeadTeacher: formData.isHeadTeacher,
      }, { merge: true });
  
      // Only for teachers, process each classGroup.
      if (role === "teacher") {
        // Process the head teacher's main class first (if it exists in our list)
        const mainGroup = updatedClassGroups.find((group) => group.classId === mainClassId);
        if (formData.isHeadTeacher && mainGroup) {
          // Query to check if a main class document with computedClassId === mainClassId exists
          const classQuery = query(
            collection(db, "classGroups"),
            where("classId", "==", mainClassId)
          );
          const querySnapshot = await getDocs(classQuery);
  
          if (querySnapshot.empty) {
            // No class document exists – create a new one with a random ID.
            const classCollectionRef = collection(db, "classGroups");
            const newClassDocRef = doc(classCollectionRef); // random ID generated
            const createdClass_uid = newClassDocRef.id;
            
            // Create the new class document
            await setDoc(newClassDocRef, {
              city: formData.city,
              school: formData.school,
              grade: formData.grade,
              gradeId: formData.gradeId,
              classId: mainClassId,
              headTeacher: userName,
              class_uid: createdClass_uid,
            });
            console.log(`Main class created with random ID ${createdClass_uid}.`);
  
            // Add the head teacher's subject to the new class's "subjects" subcollection.
            const subjectsRef = collection(db, `classGroups/${createdClass_uid}/subjects`);
            const newSubjectDocRef = doc(subjectsRef); // random subject ID generated
            const subjectDoc_uid = newSubjectDocRef.id;
            await setDoc(newSubjectDocRef, {
              subject: mainGroup.subject,
              teacher: userName,
              subject_uid: subjectDoc_uid,
            });
            console.log(`Added main subject ${mainGroup.subject} with random ID ${subjectDoc_uid} for class ${createdClass_uid}.`);
          } else {
            console.log(`Main class with computedClassId ${mainClassId} already exists.`);
          }
        }
        
        // Process additional class groups (those not matching the mainClassId)
        for (const group of updatedClassGroups) {
          if (group.classId && group.classId !== mainClassId) {
            // Add subject to classGroups collection
            const subjectsRef = collection(db, `classGroups/${group.class_uid}/subjects`);
            const snapshotQuery = query(subjectsRef, where("subject", "==", group.subject), where("teacher", "==", userName));
            
            const querySnapshot = await getDocs(snapshotQuery);

            if (!querySnapshot.empty) {
              console.log("unchanged group skipped:", group);
              continue;
            }
            
            const newSubjectDocRef = doc(subjectsRef);
            const subjectDoc_uid = newSubjectDocRef.id;
            
            await setDoc(newSubjectDocRef, {
              subject: group.subject,
              teacher: userName,
              subject_uid: subjectDoc_uid,
            });
            console.log(`Added subject ${group.subject} with random ID ${subjectDoc_uid} for class ${group.class_uid}.`);
          }
        }
      }
      const updatedUserDoc = await getDoc(doc(db, "users", userId));
      const updatedUserData = updatedUserDoc.data();
      dispatch(setActiveUser({
        userId,
        userName: updatedUserData.username || "No Username",
        userRole: updatedUserData.role || "No Role",
        userClassId: updatedUserData.classId || null,
        userClassGroups: updatedUserData.classGroups || [],
        userVerified: updatedUserData.isVerified || false,
        userCity: updatedUserData.city || "No city",
        userSchool: updatedUserData.school || "No school",
        userEmail: updatedUserData.email || "No email",
        userBirthday: updatedUserData.birthday || "No birthday",
        userIsHeadTeacher: updatedUserData.isHeadTeacher || false,
        userGrade: updatedUserData.grade,
        userGradeId: updatedUserData.gradeId,
        userSubject: updatedUserData.subject || "No subject",
        userClass_uid: updatedUserData.class_uid || '',
      }));
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      handleSignOut();
    }
  };  

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="profile-bg-holder">
        <img src='images/profile-bg.png'/>
      </div>
      <div className="profile-info">
        <div className="user-icon">
          <img src='svg/profile page/user-white.svg'/>
        </div>
        <div className="user-details-holder">
          <h1>{userName}</h1>
          { userClassId && 
            <h2>{userClassId} კლასის {userRole === 'pupil' ? 'მოსწავლე' : (userIsHeadTeacher ? 'დამრიგებელი' : '')}</h2>
          }
          <h2>ქალაქი / რაიონი: {userCity}</h2>
          <h2>სკოლა: {userSchool}</h2>
        </div>
      </div>

      {
        (userRole === 'pupil' && !userVerified) && <PupilVerification />
      }

    {
      userVerified &&
    <form onSubmit={handleRegister}>
      <div className="register-container">
      <h2>პერსონალური მონაცემები</h2>
      
      <div className="register-layout">
        <div className="left-section">
          <label>როლი</label>
          <select className="role-select" defaultValue={userRole} disabled>
            <option value="pupil">მოსწავლე</option>
            <option value="teacher">მასწავლებელი</option>
          </select>

          <label>ქალაქი / რაიონი</label>
          <select name="city" onChange={handleChange} required>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

        </div>

        <div className="right-section">
          <label>დაბადების თარიღი</label>
          <input type="date" name="birthday" onChange={handleChange} disabled defaultValue={userBirthday}/>

          <label>სკოლა</label>
          <select name="school" onChange={handleChange} required defaultValue={formData.userSchool}>
            {schools[formData.city]?.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bottom-section">
        <label>ელექტრონული ფოსტა</label>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} disabled={true} defaultValue={userEmail}/>
      </div>

      
      {role === "teacher" && (
        <div className="teacher-section">
          <label>ხართ თუ არა დამრიგებელი?</label>
          <select name="isHeadTeacher" onChange={handleHeadTeacherChange} required defaultValue={formData.isHeadTeacher}>
            <option value="true">კი</option>
            <option value="false">არა</option>
          </select>

          <label>სადამრიგებლო კლასი</label>
          <select name="grade" onChange={handleChange} disabled={!formData.isHeadTeacher} required defaultValue={formData.grade}>
            <option value="">აირჩიეთ კლასი</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>

          <label>სადამრიგებლო კლასის ნომერი</label>
            <select name="gradeId" onChange={handleChange} disabled={!formData.isHeadTeacher} required defaultValue={formData.gradeId}>
            <option value="">აირჩიეთ ნომერი</option>
            {classIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <label>სადამრიგებლო კლასის საგანი</label>
          <select
            name="subject"
            onChange={handleChange}
            disabled={!formData.isHeadTeacher}
            value={formData.subject}
            required
            defaultValue={formData.subject}
            >
            <option value="">აირჩიეთ საგანი</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>


          <button type="button" className="add-class-btn" onClick={addClassGroup}>
            + ჯგუფის დამატება
          </button>

          {formData.classGroups?.map((group, index) => (
            <div key={index} className="class-group">
              <select disabled={group.classId === formData.classId} onChange={(e) => updateClassGroup(index, "grade", e.target.value)} required defaultValue={group.grade}>
                <option value="">კლასი</option>
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <select disabled={group.classId === formData.classId} onChange={(e) => updateClassGroup(index, "gradeId", e.target.value)} required defaultValue={group.gradeId}>
                <option value="">კლასის ნომერი</option>
                {classIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <select disabled={group.classId === formData.classId} onChange={(e) => updateClassGroup(index, "subject", e.target.value)} required defaultValue={group.subject}>
                <option value="">საგანი</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
              { (group.classId != formData.classId) && 
                <button type="button" className="remove-btn" onClick={() => removeClassGroup(index)}>
                  ❌
                </button>
              }
            </div>
          ))}
          <button type="submit" className="register-btn" onClick={handleRegister}>
            შენახვა
          </button>
        </div>
      )}
    </div>
  </form>
  }

  <div className='register-container' style={{marginBlock: '40px'}}>
  {userData ? (
            userData.isVerified ? (
              <div className="verified-section">
                <h1 className="status success">თქვენი ანგარიში ვალიდირებულია.</h1>
              </div>
            ) : (
              <div className="not-verified-section">
                <h1 className="status warning">
                  თქვენი ანგარიში არ არის ვალიდირებული.
                </h1>
                {userData.verificationRequested ? (
                  <p className="status info">
                    ვალიდაციის მოთხოვნა გაგზავნილია. გთხოვთ დაელოდოთ
                    დამტკიცებას.
                  </p>
                ) : (
                  <button
                    onClick={handleRequestVerification}
                    className="register-btn"
                    style={{display: (userRole === 'pupil' ? 'none' : '')}}
                  >
                    ვალიდაციის მოთხოვნა
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="error-section">
              <p className="status error">
                მონაცემები ვერ ჩაიტვირთა. გთხოვთ სცადოთ თავიდან.
              </p>
            </div>
          )}
    <button onClick={handleSignOut} className="register-btn">
      გასვლა
    </button>
  </div>

      {userName === 'Neo School' && (
        <>
          <div className="user-details">
            <p>ID: {userId}</p>
            <p>Name: {userName}</p>
            {userPhotoUrl && <img src={userPhotoUrl} alt="Profile" />}
            <p>Role: {userRole}</p>
            <p>Class ID: {userClassId}</p>
            <div>
              <h3>Class Groups:</h3>
              {userClassGroups &&
                userClassGroups.map(({ userClassId, subject }, ind) => (
                  <div key={ind}>
                    {userClassId} - {subject}
                  </div>
                ))}
            </div>
          </div>
          <ReviewRequests />
        </>
      )}
    </>
  )
}

export default Profile;
