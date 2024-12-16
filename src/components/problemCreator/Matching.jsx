import { MathJax } from 'better-react-mathjax';
import React, { useEffect, useState } from 'react'

function Matching({ setFormData }) {
    //wp - workplace
  const [wpData, setWpData] = useState({
    coefficient: 0,
    display: {
      first: [],
      second: []
    },
    answer: [],
  })
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('AddProblemFormData'));
    if (savedData && savedData.workplaceData) {
      setWpData(savedData.workplaceData);
    }
  }, [])
  
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      workplaceData: wpData
    }))
  }, [wpData]);

  return (
    <div>
      <div className='addPostRow'>
        <input 
          type='text'
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          maxLength={50}
          placeholder='ვარიანტი'
        />
        <input 
          type='text'
          value={second}
          onChange={(e) => setSecond(e.target.value)}
          maxLength={50}
          placeholder='პასუხი'
          id='addProblemEdge'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: {
              first: [...(prevData.display.first || []), first],
              second: [...(prevData.display.second || []), second],
            },
            answer: [...(prevData.answer || []), {first: first, second: second}],
            coefficient: [...(prevData.answer || []), {first: first, second: second}].length
          }))
          setFirst('');
          setSecond('');
        }}>დამატება</button>
      </div>
      {(wpData && wpData.answer) &&
        wpData.answer.map((curr, ind) => {
          return (
            <div key={ind} onClick={() => {
              const newFirst = wpData.display.first.filter(val => val != curr.first);
              const newSecond = wpData.display.second.filter(val => val != curr.second);
              const newAnswer = wpData.answer.filter(val => val !== curr);
              setWpData({
                ...wpData,
                display: {
                  first: newFirst,
                  second: newSecond,
                },
                answer: newAnswer,
                coefficient: newAnswer.length
              })
            }}
            >
              <span>{curr.first}</span>
              <span><MathJax className='mathElement'>{`${curr.second}`}</MathJax></span>
            </div>
          )
        })
      }
    </div>
  )
}

export default Matching
