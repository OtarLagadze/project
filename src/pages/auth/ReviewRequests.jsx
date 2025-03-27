import React, { useState, useEffect } from "react";
import { db } from "@src/firebaseInit";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where, addDoc } from "firebase/firestore";

function ReviewRequests() {
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [pupilRequests, setPupilRequests] = useState([]);

  // Fetch teacher requests
  useEffect(() => {
    const fetchTeacherRequests = async () => {
      const requestsRef = collection(db, "teacherVerificationRequests");
      const snapshot = await getDocs(requestsRef);
      const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeacherRequests(requests);
    };

    fetchTeacherRequests();
  }, []);

  // Fetch pupil requests
  useEffect(() => {
    const fetchPupilRequests = async () => {
      const requestsRef = collection(db, "pupilVerificationRequests");
      const snapshot = await getDocs(requestsRef);
      const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPupilRequests(requests);
    };

    fetchPupilRequests();
  }, []);

  const handleAcceptTeacher = async (request) => {
    try {
      const userRef = doc(db, "users", request.userId);
      await setDoc(userRef, { isVerified: true }, { merge: true });
      await deleteDoc(doc(db, "teacherVerificationRequests", request.id));
      setTeacherRequests((prev) => prev.filter((r) => r.id !== request.id));
      alert("Teacher verification accepted.");
    } catch (error) {
      console.error("Error accepting teacher verification:", error);
    }
  };

  const handleDeclineTeacher = async (request) => {
    try {
      await deleteDoc(doc(db, "teacherVerificationRequests", request.id));
      setTeacherRequests((prev) => prev.filter((r) => r.id !== request.id));
      alert("Teacher verification declined.");
    } catch (error) {
      console.error("Error declining teacher verification:", error);
    }
  };

  const handleAcceptPupil = async (request) => {
    try {
      const classQuery = query(
        collection(db, "classGroups"),
        where("city", "==", request.city),
        where("school", "==", request.school),
        where("classId", "==", request.classId)
      );
      const querySnapshot = await getDocs(classQuery);

      if (querySnapshot.empty) {
        alert("Class does not exist. Head teacher must create it first.");
        return;
      }
      const classDoc = querySnapshot.docs[0];
      const classDocId = classDoc.id;

      const pupilsListRef = collection(db, `classGroups/${classDocId}/pupilsList`);
      await addDoc(pupilsListRef, {
        userId: request.userId,
        username: request.name,
      });

      const userRef = doc(db, "users", request.userId);
      await setDoc(userRef, { class_uid: classDocId, grade: request.grade, gradeId: request.gradeId, classId: request.classId, isVerified: true }, { merge: true });
      await deleteDoc(doc(db, "pupilVerificationRequests", request.id));
      setPupilRequests((prev) => prev.filter((r) => r.id !== request.id));
      alert("Pupil verification accepted.");
    } catch (error) {
      console.error("Error accepting pupil verification:", error);
    }
  };

  const handleDeclinePupil = async (request) => {
    try {
      await deleteDoc(doc(db, "pupilVerificationRequests", request.id));
      setPupilRequests((prev) => prev.filter((r) => r.id !== request.id));
      alert("Pupil verification declined.");
    } catch (error) {
      console.error("Error declining pupil verification:", error);
    }
  };

  return (
    <div>
      <h1>Verification Requests</h1>

      <h2>Teacher Requests</h2>
      {teacherRequests.length === 0 ? (
        <p>No teacher verification requests found.</p>
      ) : (
        teacherRequests.map((request) => (
          <div key={request.id}>
            <p>Name: {request.name}</p>
            <p>Email: {request.email}</p>
            <button onClick={() => handleAcceptTeacher(request)}>Accept</button>
            <button onClick={() => handleDeclineTeacher(request)}>Decline</button>
          </div>
        ))
      )}

      <h2>Pupil Requests</h2>
      {pupilRequests.length === 0 ? (
        <p>No pupil verification requests found.</p>
      ) : (
        pupilRequests.map((request) => (
          <div key={request.id}>
            <p>Name: {request.name}</p>
            <p>Grade: {request.grade}</p>
            <p>Class ID: {request.classId}</p>
            <button onClick={() => handleAcceptPupil(request)}>Accept</button>
            <button onClick={() => handleDeclinePupil(request)}>Decline</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewRequests;
