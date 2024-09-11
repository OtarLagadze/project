import { db } from '@src/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import TestProblem from './TestProblem';

function TestRunning({ timeLeft }) {
  const { testId } = useParams();
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const ref = doc(db, 'tests', testId);
        const res = await getDoc(ref);
        setData(res.data());
      } catch (err) {
        console.log(err);
      }
    }
        
    fetch();
  }, [testId]);

  const handleSubmit = () => {
    //save subbmisions and then run testEvaluator on them
    messages.forEach(({ problemNumero, message }) => {
      console.log(problemNumero, message);
    });
  }

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
      uhm running {testId}, time left {timeLeft}
      { data.problems ?
        data.problems.map(({ problemId}, ind) => {
          return <TestProblem problemId={problemId.toString()} numero={ind + 1} setMessages={setMessages} key={ind}/>
        }) : <></>
      }
      <div className='problemSubmit'>
        <button onClick={handleSubmit}>დასრულება</button>
      </div>
    </div>
  )
}

export default TestRunning
