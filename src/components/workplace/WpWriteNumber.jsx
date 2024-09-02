import React, { useState } from 'react'

function WpWriteNumber({ data, setSubmission }) {
  const [val, setVal] = useState('');

  return (
    <div className='problemSolutionContainer'>
      <input 
        value={val} 
        onChange={(e) => {
          setVal(e.target.value);
          setSubmission(parseInt(e.target.value));
        }}
        type='number' 
        className='writeInput'
        placeholder='ჩაწერეთ პასუხი'
      />
    </div>
  )
}

export default WpWriteNumber
