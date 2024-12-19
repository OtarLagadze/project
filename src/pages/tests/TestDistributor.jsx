import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import { formatTimeLeft } from '@features/formatTimeLeft';
import TestCountdown from './TestCountdown';
import TestRunning from './TestRunning';
import TestResults from './TestResults';

function TestDistributor() {
  const { recordId } = useParams();
  const [data, setdata] = useState(null);
  const [status, setStatus] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const testDoc = await getDoc(doc(db, 'testRecords', recordId));
        setdata(testDoc.data());
      } catch (e) {
        console.log(e);
      }
    };

    fetchdata();
  }, [recordId]);

  useEffect(() => {
    if (data) {
      const startDate = new Date(data.startDate.seconds * 1000);
      const endDate = new Date(data.endDate.seconds * 1000);

      const updateStatus = () => {
        const now = new Date();

        if (now < startDate) {
          const timeLeft = startDate - now;
          setCountdown(formatTimeLeft(timeLeft));
          setStatus('countdown');
        } else if (now >= startDate && now <= endDate) {
          const timeLeft = endDate - now;
          setCountdown(formatTimeLeft(timeLeft));
          setStatus('running');
        } else {
          setCountdown('');
          setStatus('finished');
        }
      };

      updateStatus();
      const interval = setInterval(updateStatus, 1000);

      return () => clearInterval(interval);
    }
  }, [data]);

  if (!data) return null;

  switch (status) {
    case 'countdown':
      return <TestCountdown testData={data} display={countdown}/>
    case 'running':
      return <TestRunning timeLeft={countdown} subject={data.testData.name} maxPoint={data.testData.maxPoint}/>
    case 'finished':
      return <TestResults />
    default:
      return <div>დაფიქსირდა შეცდომა</div>
  }
  return (
    <div className='TestDistributor'>
      <h1>Test Details</h1>
      <p>Class ID: {data.classId}</p>
      <p>Subject: {data.subject}</p>
      <p>Start Date: {new Date(data.startDate.seconds * 1000).toLocaleString()}</p>
      <p>End Date: {new Date(data.endDate.seconds * 1000).toLocaleString()}</p>
      <p>Duration: {data.duration} minutes</p>
      <p>Teacher: {data.teacher}</p>
      <p>Status: {status}</p>
      <p>testName: {data.testData.name}</p>
      <p>recordId: {data.testData.recordId}</p>
      <p>maxPoint: {data.testData.maxPoint}</p>
      {status === 'countdown' && <p>Time Left to Start: {countdown}</p>}
      {status === 'running' && <p>Time Left to End: {countdown}</p>}
    </div>
  );
}

export default TestDistributor;
