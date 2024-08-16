import React from 'react'
import './TestCountdown.scss'

const formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleString('en-GB', options).replace(/,/, '');
};

function TestCountdown({ testData, display }) {
  return (
    <div className='testCountdownWrapper'>
      <div>
        {testData.classId} {testData.subject}
      </div>
      <div>
        <small>დარჩენილია</small>
        <h1>{display}</h1>
        <small>{formatDate(new Date(testData.startDate.seconds * 1000))}</small>
      </div>
      <br />
    </div>
  )
}

export default TestCountdown
