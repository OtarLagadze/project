import { db } from '@src/firebaseInit';
import { doc, getDoc, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import TestProblem from './TestProblem';
import TestInstruction from '@components/TestInstruction';
import './TestRunning.scss';
import ProblemReply from '@components/problemReply/ProblemReply';
import { selectUserId, selectUserName, selectUserRole, selectUserVerified } from '@features/userSlice';
import { useSelector } from 'react-redux';

function TestOffline() {
  const { testId } = useParams();
  const userId = useSelector(selectUserId);
  const username = useSelector(selectUserName);
  const userRole = useSelector(selectUserRole);
  const userVerified = useSelector(selectUserVerified);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const ref = doc(db, 'tests', testId);
        const res = await getDoc(ref);

        if (!res.exists()) navigate('/404');

        const testData = res.data();
        setData(testData);

        const savedTest = localStorage.getItem(`${userId}_test_${testId}`);
        if (savedTest) {
          setTest(JSON.parse(savedTest));
        } else {
          generateTest(testData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

  const generateTest = (testData) => {
    if (!testData || !testData.problems) return;

    const generatedTest = [];

    testData.problems.forEach((problem) => {
      if (problem.exercises.length) {
        const randomExercise = problem.exercises[Math.floor(Math.random() * problem.exercises.length)];
        generatedTest.push(randomExercise);
      }
    });

    localStorage.setItem(`${userId}_test_${testId}`, JSON.stringify(generatedTest));
    setTest(generatedTest);
  };

  useEffect(() => {
    if (!loading && data) {
      if (data.access === 'სატესტო' && !(userRole === 'teacher' && userVerified)) {
        navigate('/405');
      }
    }
  }, [loading, data, userRole, userVerified, navigate]);

  if (loading) return <div>იტვირთება...</div>

  return (
    <div>
      <div className="problemContainer">
        <div className="problemHeader">
          <h1>{data.name}</h1>
        </div>
        <div className="problemHeader">
          <small>{data.subject}</small>
        </div>
        <div className="problemHeader">
          <small>მაქსიმალური ქულა - {data.maxPoint}</small>
        </div>
      </div>
      <TestInstruction instructionId={data.instructionId} />
      {test ? (
        test.map(({ exerciseId }, ind) => {
          return (
            <TestProblem
              problemId={exerciseId}
              numero={ind + 1}
              setMessages={setMessages}
              key={ind}
            />
          );
        })
      ) : (
        <></>
      )}
      {messages.map(({ problemNumero, message }, ind) => {
        if (!message) return null;
        return (
          <div className="problemContainer" key={ind}>
            <div className="problemHeader">
              <h1>დავალება {problemNumero}</h1>
            </div>
            <ProblemReply replyData={message} />
          </div>
        );
      })}
    </div>
  );
}

export default TestOffline;
