import { db } from '@src/firebaseInit';
import { doc, getDoc, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import `collection` and `addDoc`
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import TestProblem from './TestProblem';
import TestInstruction from '@components/TestInstruction';
import './testRunning.scss';
import ProblemReply from '@components/problemReply/ProblemReply';
import { selectUserId, selectUserName } from '@features/userSlice';
import { useSelector } from 'react-redux';

function TestRunning({ timeLeft, subject, maxPoint }) {
  const { testId } = useParams();
  const username = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [test, setTest] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const ref = doc(db, 'tests', testId);
        const res = await getDoc(ref);
        const testData = res.data();
        setData(testData);

        const savedTest = localStorage.getItem(`${username}_test_${testId}`);
        if (savedTest) {
          setTest(JSON.parse(savedTest));
        } else {
          generateTest(testData);
        }
      } catch (err) {
        console.error(err);
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

    localStorage.setItem(`${username}_test_${testId}`, JSON.stringify(generatedTest));
    setTest(generatedTest);
  };

  const handleSubmit = async () => {
    setPopupVisible(true);
    try {
      const userTestRecordRef = doc(db, 'userTestRecords', username + userId);
      let usersPoint = 0;
      messages.forEach(msg => {
        if (msg.message.evaluator.pointsEarned) usersPoint += msg.message.evaluator.pointsEarned;
      });
      const testRecord = {
        [subject]: {
          test,
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
    }
  };

  useEffect(() => {
    if (timeLeft === 2) {
      handleSubmit();
    }
  }, [timeLeft]);

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div>
      {popupVisible && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>თქვენ წარმატებით დაასრულეთ ტესტი</h2>
            <h1>თქვენს შეფასებას გაიგებთ ტესტის დასრულებისთანავე</h1>
            <h1>დასრულებამდე დარჩა: {timeLeft}</h1>
            <button className="closePopupButton" onClick={closePopup}>
              <h1>დახურვა</h1>
            </button>
          </div>
        </div>
      )}
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
      <div className="testPopup">
        <div>
          <small>თქვენი კოდი</small>
          <h1>{userId}</h1>
        </div>
        {timeLeft && (
          <div>
            <small>დარჩენილია</small>
            <h1>{timeLeft}</h1>
          </div>
        )}
      </div>
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
