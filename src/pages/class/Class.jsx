import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Class.scss";
import { useSelector } from "react-redux";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@src/firebaseInit";
import {
  selectUserClassGroups,
  selectUserClassId,
  selectUserRole,
  selectUserCity,
  selectUserSchool,
} from "@features/userSlice";

function Class() {
  const userRole = useSelector(selectUserRole);
  const userClassGroups = useSelector(selectUserClassGroups);
  const userClassId = useSelector(selectUserClassId);
  const userCity = useSelector(selectUserCity);
  const userSchool = useSelector(selectUserSchool);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === "teacher") {
          let teacherData = [];

          for (const group of userClassGroups) {
            // Query to find the classGroup document
            const classQuery = query(
              collection(db, "classGroups"),
              where("classId", "==", group.classId),
              where("city", "==", userCity),
              where("school", "==", userSchool)
            );
            const classQuerySnapshot = await getDocs(classQuery);

            if (!classQuerySnapshot.empty) {
              const classDoc = classQuerySnapshot.docs[0]; // Get the first matching class
              const classDocId = classDoc.id;

              // Query the subjects subcollection
              const subjectsRef = collection(db, `classGroups/${classDocId}/subjects`);
              const subjectsSnapshot = await getDocs(subjectsRef);

              subjectsSnapshot.docs.forEach((doc) => {
                if (doc.data().subject === group.subject) {
                  teacherData.push({
                    class_uid: classDocId,
                    subject_uid: doc.id,
                    display: `${classDoc.data().classId} ${doc.data().subject}`,
                  });
                }
              });
            }
          }
          setData(teacherData);
        } else {
          if (!userClassId) {
            console.error("userClassId not defined for pupil");
            return;
          }

          const classQuery = query(
            collection(db, "classGroups"),
            where("classId", "==", userClassId),
            where("city", "==", userCity),
            where("school", "==", userSchool)
          );
          const classQuerySnapshot = await getDocs(classQuery);

          if (classQuerySnapshot.empty) {
            console.error("No class document found for the pupil");
            return;
          }

          const classDoc = classQuerySnapshot.docs[0];
          const classDocId = classDoc.id;

          const subjectsRef = collection(db, `classGroups/${classDocId}/subjects`);
          const subjectsSnapshot = await getDocs(subjectsRef);
          const pupilData = subjectsSnapshot.docs.map((doc) => ({
            class_uid: classDocId,
            subject_uid: doc.id,
            display: doc.data().subject,
          }));

          setData(pupilData);
        }
      } catch (err) {
        console.error("Error fetching class data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, userClassGroups, userClassId, userCity, userSchool]);

  if (loading) return <div>იტვირთება...</div>

  return (
    <div className="classWrapper">
      <div className="subjects">
        {data.map(({ class_uid, subject_uid, display }, ind) => (
          <Link key={ind} to={`/class/${class_uid}/${subject_uid}`} className="subject" style={{paddingInline: '15px'}}>
            {display}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Class;
