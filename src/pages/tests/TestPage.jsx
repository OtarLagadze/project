import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import { formatTimeLeft } from '@features/formatTimeLeft';
import TestCountdown from './TestCountdown';

function TestPage() {
  const { classId, testId } = useParams();
  const [testData, setTestData] = useState(null);
  const [status, setStatus] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const testDoc = await getDoc(doc(db, 'tests', testId));
        setTestData(testDoc.data());
      } catch (e) {
        console.log(e);
      }
    };

    fetchTestData();
  }, [classId, testId]);

  useEffect(() => {
    if (testData) {
      const startDate = new Date(testData.startDate.seconds * 1000);
      const endDate = new Date(testData.endDate.seconds * 1000);

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
  }, [testData]);

  if (!testData) return null;

  if (status === 'countdown') return <TestCountdown testData={testData} display={countdown}/>
  return (
    <div className='testPage'>
      <h1>Test Details</h1>
      <p>Class ID: {testData.classId}</p>
      <p>Subject: {testData.subject}</p>
      <p>Start Date: {new Date(testData.startDate.seconds * 1000).toLocaleString()}</p>
      <p>End Date: {new Date(testData.endDate.seconds * 1000).toLocaleString()}</p>
      <p>Duration: {testData.duration} minutes</p>
      <p>Teacher: {testData.teacher}</p>
      <p>Status: {status}</p>
      {status === 'countdown' && <p>Time Left to Start: {countdown}</p>}
      {status === 'running' && <p>Time Left to End: {countdown}</p>}
    </div>
  );
}

export default TestPage;
