import { db } from '@src/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import TestProblem from './TestProblem';
import TestInstruction from '@components/TestInstruction';

function TestRunning({ timeLeft }) {
  const { testId } = useParams();
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [test, setTest] = useState([]);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const ref = doc(db, 'tests', testId);
        const res = await getDoc(ref);
        const testData = res.data();
        setData(testData);

        const savedTest = localStorage.getItem(`test_${testId}`);
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

  // Generate unique test with random exercises from each problem
  const generateTest = (testData) => {
    if (!testData || !testData.problems) return;

    const generatedTest = [];

    testData.problems.forEach((problem) => {
      if (problem.exercises.length) {
        const randomExercise = problem.exercises[Math.floor(Math.random() * problem.exercises.length)];
        generatedTest.push(randomExercise);
      }
    });

    console.log(generatedTest);
    localStorage.setItem(`test_${testId}`, JSON.stringify(generatedTest));
    setTest(generatedTest);
  };

  const handleSubmit = () => {
    //save subbmisions and then run testEvaluator on them
    messages.forEach(({ problemNumero, message }) => {
      console.log(problemNumero, message);
    });
  }

  // const handleSubmit = () => {
  //   if (!messages || messages.length === 0) {
  //     alert('გთხოვთ შეავსოთ ყველა დავალება');
  //     return;
  //   }

  //   console.log('User responses:', messages);

  //   localStorage.removeItem(`test_${testId}`);
  //   alert('ტესტი დასრულებულია');
  //   window.location.reload();
  // };

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
      <TestInstruction instructionId={data.instructionId}/>
      {
        timeLeft ? <h1>დარჩენილია {timeLeft}</h1> : <></>
      }   
      { test ?
        test.map(({ exerciseId }, ind) => {
          return <TestProblem problemId={exerciseId} numero={ind + 1} setMessages={setMessages} key={ind}/>
        }) : <></>
      }
      <div className='problemSubmit'>
        <button onClick={handleSubmit}>დასრულება</button>
      </div>
    </div>
  )
}

export default TestRunning
