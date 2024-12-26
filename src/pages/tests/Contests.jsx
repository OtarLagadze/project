import React, { useEffect, useState } from 'react';
import './Contests.scss';
import { useSelector } from 'react-redux';
import { selectUserName, selectUserClassId } from '@features/userSlice';
import { Link } from 'react-router-dom';
import { db } from '@src/firebaseInit';
import { collection, query, getDocs } from 'firebase/firestore';
import TestsList from './TestsList';
import * as XLSX from "xlsx";
import Export from './Export';

const formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleString('en-GB', options).replace(/,/, '');
};

const TestCard = ({ test }) => {
  return (
    <Link to={`/tests/${test.subject}/${test.id}/${test.testData.testId}`} key={test.id} className='testItem'>
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
  );
};

const TestsRow = ({ testType, arr }) => {
  if (arr.length === 0) return null;
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
  );
};

function Contests() {
  const userName = useSelector(selectUserName);
  const userClassId = useSelector(selectUserClassId);
  const [tests, setTests] = useState({ active: [], upcoming: [], finished: [] });

  useEffect(() => {
    const fetchTests = async () => {
      let q = query(collection(db, 'testRecords'));
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
  }, [userName, userClassId]);

  return (
    <>
      <div className='consWrapper'>
        {userName === 'neoschool' && 
          <div className='postsAddPost'>
            <Link to='/addTest'>ტესტის ჩანიშვნა</Link>
            <Link to='/createTest'>ტესტის შექმნა</Link>
          </div>
        }
        <div className='testsList'>
          <TestsRow testType={'მიმდინარე'} arr={tests.active}/>
          <TestsRow testType={'დაგეგმილი'} arr={tests.upcoming}/>
          <TestsRow testType={'დასრულებული'} arr={tests.finished}/>
          <div className='testsCategory'>
            <h1> შედეგების ნახვა </h1>
            <div className='testsRow'>
              <Link to={`/results/ქიმია`} className='testItem'>
                <div className=''>  
                  <h1>ქიმია</h1>
                </div>
              </Link>
              <Link to={`/results/ფიზიკა`} className='testItem'>
                <div className=''>  
                  <h1>ფიზიკა</h1>
                </div>
              </Link>
              <Link to={`/results/ბიოლოგია`} className='testItem'>
                <div className=''>  
                  <h1>ბიოლოგია</h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Export />
    </>
  );
}

export default Contests;
