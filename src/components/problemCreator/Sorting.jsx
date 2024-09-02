import React, { useEffect, useState } from 'react'

function Sorting({ setFormData }) {
  //wp - workplace
  const [wpData, setWpData] = useState({
    coefficient: 0,
    display: [],
    answer: [],
  })

  const [variant, setVariant] = useState('');

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
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          maxLength={50}
          placeholder='ვარიანტი'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: [...(prevData.display || []), variant],
            answer: [...(prevData.answer || []), variant],
            coefficient: [...(prevData.answer || []), variant].length,
          }))
          setVariant('');
        }}>დამატება</button>
      </div>
      {
        wpData.answer.map((val, ind) => {
          return (
            <div 
              key={ind}
              onClick={() => {
                const newAnswer = wpData.answer.filter(variant => val !== variant);
                setWpData({
                  ...wpData,
                  display: newAnswer,
                  answer: newAnswer,
                  coefficient: newAnswer.length
                })
              }}
            >{ind + 1}. {val}</div>
          )
        })
      }
    </div>
  )
}

export default Sorting
