import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setActiveUser } from "@features/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@src/firebaseInit";
import "./Login.scss";
import { useNavigate } from "react-router";

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Save user data to Redux (handle missing fields gracefully)
        dispatch(
          setActiveUser({
            userId,
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
            userGrade: userData.grade,
            userGradeId: userData.gradeId,
            userSubject: userData.subject || "No subject",
            userClass_uid: userData.class_uid || ""
          })
        );
      } else {
        setError("მონაცემები არ მოიძებნა");
      }
      navigate('/profile')
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("ამ მეილით მომხმარებელი არ მოიძებნა");
      } else if (error.code === "auth/wrong-password") {
        setError("პაროლი არასწორია");
      } else {
        setError(error.message);
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      setError("Failed to send reset email.");
    }
  };

  return (
    <div className="login-container">
      <h2>შესვლა</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="პაროლი"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "შედიხართ..." : "შესვლა"}
        </button>
      </form>
      <button onClick={() => navigate('/register')} className="reset-btn"> რეგისტრაცისთვის დააჭირეთ აქ</button>
      {/* <button onClick={handleForgotPassword} className="reset-btn">პაროლი დაგავიწყდათ?</button> */}
    </div>
  );
}

export default Login;
