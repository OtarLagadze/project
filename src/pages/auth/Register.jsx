import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@src/firebaseInit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Register.scss";

const cities = ["ქუთაისი"];
const schools = {
  "ქუთაისი": ["იოსებ ოცხელის სახელობის ქალაქ ქუთაისის №2 საჯარო სკოლა"]
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "pupil",
    name: "",
    lastName: "",
    birthday: "",
    city: "ქუთაისი",
    school: "იოსებ ოცხელის სახელობის ქალაქ ქუთაისის №2 საჯარო სკოლა",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userId = userCredential.user.uid;

      const { password, ...userData } = formData;
      
      await setDoc(doc(db, "users", userId), {
        ...userData,
        userId,
        username: `${formData.name.trim()} ${formData.lastName.trim()}`,
        isVerified: false,
      });

      alert("რეგისტრაცია წარმატებით გაიარეთ");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user: ", error);
      alert("რეგისტრაციისას დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>რეგისტრაცია</h2>
      <form onSubmit={handleRegister}>
        <label>როლი</label>
        <select name="role" onChange={handleChange} value={formData.role} required>
          <option value="pupil">მოსწავლე</option>
          <option value="teacher">მასწავლებელი</option>
        </select>

        <label>სახელი</label>
        <input
          type="text"
          name="name"
          placeholder="სახელი"
          onChange={handleChange}
          required
        />

        <label>გვარი</label>
        <input
          type="text"
          name="lastName"
          placeholder="გვარი"
          onChange={handleChange}
          required
        />

        <label>დაბადების თარიღი</label>
        <input
          type="date"
          name="birthday"
          onChange={handleChange}
          required
        />

        <label>ქალაქი</label>
        <select name="city" onChange={handleChange} value={formData.city} required>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <label>სკოლა</label>
        <select
          name="school"
          onChange={handleChange}
          value={formData.school}
          required
        >
          {schools[formData.city]?.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>

        <label>ელექტრონული ფოსტა</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <label>პაროლი</label>
        <input
          type="password"
          name="password"
          placeholder="პაროლი"
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "მიმდინარეობს რეგისტრაცია..." : "რეგისტრაცია"}
        </button>
      </form>
      <button onClick={() => navigate('/login')} className="reset-btn"> შესასვლელად დააჭირეთ აქ</button>
    </div>
  );
}

export default Register;
