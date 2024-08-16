import React, { useEffect, useState } from 'react';
import './Contests.scss';
import { useSelector } from 'react-redux';
import { selectUserRole, selectUserName, selectUserClassId } from '@features/userSlice';
import { Link } from 'react-router-dom';
import { db } from '@src/firebaseInit';
import { collection, query, where, getDocs } from 'firebase/firestore';

const formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleString('en-GB', options).replace(/,/, '');
};

const TestCard = ({ test }) => {
  return (
    <Link to={`/tests/${test.classId}/${test.id}`} key={test.id} className='testItem'>
      <div className='testItemRow'>  
        <p>{test.subject}</p>
        <p>{test.classId}</p>
      </div>
      <div className='testItemRow'>
        <p>{formatDate(new Date(test.startDate.seconds * 1000))}</p>
        <div className='testItemTimer'>
          <img src={`/svg/tests page/timer.svg`} className='icon'/>
          <p>{test.duration}წთ</p>
        </div>
      </div>
    </Link>
  )
}

const TestsRow = ({ testType, arr }) => {
  if (arr.length === 0) return;
  return (
    <div className='testsCategory'>
      <h1> {testType} </h1>
      <div className='testsRow'>
        {
          arr.map(test => (
            <TestCard test={test} key={test.id} />
          ))
        }
      </div>
    </div>
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
        <TestsRow testType={'მიმდინარე'} arr={tests.active}/>
        <TestsRow testType={'დაგეგმილი'} arr={tests.upcoming}/>
        <TestsRow testType={'დასრულებული'} arr={tests.finished}/>
      </div>
    </div>
  );
}

export default Contests;
