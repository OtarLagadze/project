import React, { useEffect, useState } from 'react';
import './Contests.scss';
import { useSelector } from 'react-redux';
import { selectUserRole, selectUserName, selectUserClassId } from '../features/userSlice';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const TestCard = ({ test }) => {
  return (
    <Link to={`/tests/${test.classId}/${test.id}`} key={test.id} className='testItem'>
      <p>{test.classId}</p>
      <p>{test.subject}</p>
      <p> Duration: {test.duration} minutes</p>
      <p>{new Date(test.startDate.seconds * 1000).toLocaleString()}</p>
    </Link>
  )
}

function Contests() {
  const userRole = useSelector(selectUserRole);
  const userName = useSelector(selectUserName);
  const userClassId = useSelector(selectUserClassId);
  const [tests, setTests] = useState({ active: [], upcoming: [], finished: [] });

  useEffect(() => {
    const fetchTests = async () => {
      let q;
      if (userRole === 'teacher') {
        q = query(collection(db, 'tests'), where('teacher', '==', userName));
      } else if (userRole === 'student') {
        q = query(collection(db, 'tests'), where('classId', '==', userClassId));
      }
      if (q) {
        try {
          const querySnapshot = await getDocs(q);
          const testsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          categorizeTests(testsData);
        } catch (e) {
          console.error('Error fetching tests: ', e);
        }
      }
    };

    const categorizeTests = (tests) => {
      const now = new Date();
      const active = [];
      const upcoming = [];
      const finished = [];

      tests.forEach(test => {
        const startDate = new Date(test.startDate.seconds * 1000);
        const endDate = new Date(test.endDate.seconds * 1000);

        if (now >= startDate && now <= endDate) {
          active.push(test);
        } else if (now < startDate) {
          upcoming.push(test);
        } else {
          finished.push(test);
        }
      });

      setTests({ active, upcoming, finished });
    };

    fetchTests();
  }, [userRole, userName, userClassId]);

  return (
    <div className='consWrapper'>
      {userRole === 'teacher' && 
        <div className='postsAddPost'>
          <Link to='/addTest'>ტესტის დამატება</Link>
        </div>
      }
      <div className='testsList'>
        {tests.active.length > 0 && (
          <div className='testsCategory'>
            <h1>მიმდინარე</h1>
            <div className='testsRow'>
              {tests.active.length > 0 && (
                tests.active.map(test => (
                  <TestCard test={test} />
                ))
              )}
            </div>
          </div>
        )}

        {tests.upcoming.length > 0 && (
          <div className='testsCategory'>
            <h1>დაგეგმილი</h1>
            <div className='testsRow'>
              {tests.upcoming.length > 0 && (
                tests.upcoming.map(test => (
                  <TestCard test={test} />
                ))
              )}
            </div>
          </div>
        )}

        {tests.finished.length > 0 && (
          <div className='testsCategory'>
            <h1>დასრულებული</h1>
            <div className='testsRow'>
              {tests.finished.length > 0 && (
                tests.finished.map(test => (
                  <TestCard test={test} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contests;
