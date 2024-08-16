import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import './Class.scss'
import { useSelector } from 'react-redux';
import { selectUserClassGroups, selectUserClassId, selectUserId, selectUserRole } from '@features/userSlice';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@src/firebaseInit';

function Class() {
  const userRole = useSelector(selectUserRole);
  const userId = useSelector(selectUserId);
  const userClassId = useSelector(selectUserClassId);
  const classGroups = useSelector(selectUserClassGroups);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (userRole === 'teacher') {
          setData(classGroups.map(doc => ({
            classId: doc.classId,
            subject: doc.subject,
            display: doc.classId
          })));
        } else {
          const ref = collection(db, `classGroups/${userClassId}/subjects`);
          const res = await getDocs(ref);
          setData(res.docs.map(doc => ({
            classId: userClassId,
            subject: doc.id,
            display: doc.id
          })));
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, [])

  return (
    <div className='classWrapper'>
      <div className="subjects">
        {
          data.map(({classId, subject, display}, ind) => {
            return (
              <Link to={`/class/${classId}/${subject}`} className="subject" key={ind}>
                {display}
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default Class