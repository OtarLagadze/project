import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
        console.error('Error fetching test data: ', e);
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
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
          setStatus('Countdown to Start');
        } else if (now >= startDate && now <= endDate) {
          const timeLeft = endDate - now;
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
          setStatus('Running');
        } else {
          setCountdown('');
          setStatus('Finished');
        }
      };

      updateStatus();
      const interval = setInterval(updateStatus, 1000);

      return () => clearInterval(interval);
    }
  }, [testData]);

  if (!testData) return;

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
      {status === 'Countdown to Start' && <p>Time Left to Start: {countdown}</p>}
      {status === 'Running' && <p>Time Left to End: {countdown}</p>}
    </div>
  );
}

export default TestPage;
