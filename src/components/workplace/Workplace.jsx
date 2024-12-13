import { selectUserId } from '@features/userSlice';
import React, { Component, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import WpMultipleChoice from './WpMultipleChoice';
import { evaluateProblem } from '@features/evaluators/problemEvaluator';
import WpWriteNumber from './WpWriteNumber';
import WpMatching from './WpMatching';
import WpSorting from './WpSorting';
import WpMissingWords from './WpMissingWords';

const ComponentToRender = ({ type, setSubmission, data }) => {
  switch (type) {
    case 'ვარიანტების არჩევა':
      return <WpMultipleChoice setSubmission={setSubmission} data={data}/>;
    case 'შესაბამისობა': 
      return <WpMatching setSubmission={setSubmission} data={data}/>;
    case 'დალაგება': 
      return <WpSorting setSubmission={setSubmission} data={data}/>;
    case 'რიცხვის ჩაწერა': 
      return <WpWriteNumber setSubmission={setSubmission} data={data}/>;
    case 'გამოტოვებული სიტყვები': 
      return <WpMissingWords setSubmission={setSubmission} data={data}/>;
    case 'ტექსტური': 
      return;
    default:
      return <div>დაფიქსირდა შეცდომა</div>
  }
}

function Workplace({ data, setReplyData, fromTest }) {
  const userId = useSelector(selectUserId);
  const [submission, setSubmission] = useState(null);

  const evaluate = () => {
    if (!submission && submission !== 0) {
      if (!fromTest) {
        alert("გთხოვთ შეასრულოთ დავალება");
      }
      return;
    }
    const obj = {
      type: data.type,
      submission: submission,
      answer: (data.type === 'რიცხვის ჩაწერა' ? data.WpData.answer : [...data.WpData.answer]),
      point: data.WpData.point,
    }
    // const { verdict, pointsEarned } = evaluateProblem(obj);
    // console.log(submission, data.WpData.answer);
    // console.log(verdict, pointsEarned);
    // const res = evaluateProblem(obj);
    const res = {
      type: data.type,
      maxPoint: data.WpData.maxPoint,
      evaluator: evaluateProblem(obj),
    }
    if (fromTest && res.evaluator.verdict.length === 0) {
      setReplyData(null);
      return;
    }
    setReplyData(res);
    //answer not in variants
  }

  useEffect(() => {
    if (!fromTest) return;
    evaluate();
  }, [submission]);

  return (
    <div>
      <ComponentToRender type={data.type} data={data.WpData} setSubmission={setSubmission}/>
      {
        (!fromTest && data.type !== 'ტექსტური') ?
          <div className='problemSubmit'>
            {
              userId ? (
                <button onClick={evaluate}>დადასტურება</button>
              ) : (
                <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
              )
            }
          </div> : <></>
      }
    </div>
  )
}

export default Workplace
