import { db } from '@src/firebaseInit';
import { doc, getDoc, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import TestProblem from './TestProblem';
import TestInstruction from '@components/TestInstruction';
import './testRunning.scss';
import ProblemReply from '@components/problemReply/ProblemReply';
import { selectUserId, selectUserName, selectUserRole, selectUserVerified } from '@features/userSlice';
import { useSelector } from 'react-redux';

function TestRunning({ timeLeft, subject, maxPoint }) {
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
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const userTestRecordRef = doc(db, 'userTestRecords', userId);
      let usersPoint = 0;
      messages.forEach(msg => {
        if (msg?.message?.evaluator?.pointsEarned) usersPoint += msg.message.evaluator.pointsEarned;
      });
      const testRecord = {
        [subject]: {
          testId,
          messages,
          maxPoint,
          usersPoint,
          lastUpdated: serverTimestamp(),
        },
      };
      await setDoc(userTestRecordRef, testRecord, { merge: true });
      console.log('Test record updated successfully:', testRecord);
    } catch (error) {
      console.error('Error updating test record:', error);
    } finally {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (timeLeft === '1წმ') {
      handleSubmit();
    }
    console.log(timeLeft);
  }, [timeLeft]);


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
      {timeLeft && (
        <div className="testPopup">
          <small>დარჩენილია</small>
          <h1>{timeLeft}</h1>
        </div>
      )}
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
      <div className="problemSubmit" id="edgeCaseButton">
        <button onClick={handleSubmit}>დასრულება</button>
      </div>
      {/* {messages.map(({ problemNumero, message }, ind) => {
        if (!message) return null;
        return (
          <div className="problemContainer" key={ind}>
            <div className="problemHeader">
              <h1>დავალება {problemNumero}</h1>
            </div>
            <ProblemReply replyData={message} />
          </div>
        );
      })} */}
    </div>
  );
}

export default TestRunning;
