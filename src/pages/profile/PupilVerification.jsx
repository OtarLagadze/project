import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@src/firebaseInit";
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import {
  selectUserId,
  selectUserName,
  selectUserRole,
  selectUserCity,
  selectUserSchool,
} from "@features/userSlice";
import "./Profile.scss";

const grades = [7, 8, 9, 10, 11, 12];
const classIds = ["ა", "ბ", "გ", "დ", "ე", "ვ", "ზ", "თ"];

function PupilVerification() {
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userRole = useSelector(selectUserRole);
  const userCity = useSelector(selectUserCity);
  const userSchool = useSelector(selectUserSchool);

  const [formData, setFormData] = useState({
    grade: "",
    gradeId: "",
  });

  // Ensure the user is logged in.
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { grade, gradeId } = formData;
    if (!grade || !gradeId) {
      alert("გთხოვთ მონიშნოთ კლასი და მისი ნომერიც");
      return;
    }
    const classId = `${grade}${gradeId}`;

    // Check if a verification request already exists for this pupil.
    const verifDocRef = doc(db, "pupilVerificationRequests", userId);
    const verifDocSnap = await getDoc(verifDocRef);
    if (verifDocSnap.exists()) {
      alert("თქვენი მოთხოვნა უკვე განიხილება");
      return;
    }

    // Query Firestore to check if a class with the given parameters exists.
    const classQuery = query(
      collection(db, "classGroups"),
      where("city", "==", userCity),
      where("school", "==", userSchool),
      where("classId", "==", classId)
    );
    const querySnapshot = await getDocs(classQuery);
    if (querySnapshot.empty) {
      alert(
        `${classId} კლასი ჯერ არ არის შექმნილი დამრიგებლის მიერ. თქვენი მოთხოვნა არ გაიგზავნა.`
      );
      return;
    }

    // Class exists; create (or update) a verification request document.
    try {
      await setDoc(doc(db, "pupilVerificationRequests", userId), {
        userId,
        name: userName,
        grade,
        classId,
        gradeId,
        city: userCity,
        school: userSchool,
        status: "pending",
        requestDate: new Date(),
      });
      alert("თქვენი მოთხოვნა გაგზავნილია");
    } catch (error) {
      console.error("Error requesting verification: ", error);
      alert("დაფიქსირდა შეცდომა");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-container">
        <h2>ვერიფიკაციის მოთხოვნა</h2>
        <div className="form-field">
          <label>კლასი:</label>
          <select name="grade" value={formData.grade} onChange={handleChange} required>
            <option value="">აირჩიეთ კლასი</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>კლასის ნომერი:</label>
          <select name="gradeId" value={formData.gradeId} onChange={handleChange} required>
            <option value="">აირჩიეთ ნომერი</option>
            {classIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="register-btn">გაგზავნა</button>
      </form>
  );
}

export default PupilVerification;
