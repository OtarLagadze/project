import React, { useEffect, useState } from 'react'

function MultipleChoice({ setFormData }) {
  //wp - workplace
  const [wpData, setWpData] = useState({
    coefficient: 0,
    display: [],
    answer: [],
  })
  const [variant, setVariant] = useState('');
  const [solution, setSolution] = useState('');

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
          placeholder='ვარიანტის დამატება'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: [...(prevData.display || []), variant]
          }))
          setVariant('');
        }}>დამატება</button>
      </div>  

      {(wpData && wpData.display) ?
        <div className="addProblemHolder">
          {
            wpData.display.map((variant, ind) => {
              return (
                <div key={ind} className='addProblemVariant' onClick={() => {
                  const newDisplay = wpData.display.filter(val => val !== variant);
                  const newAnswer = wpData.answer.filter(val => val !== variant);

                  setWpData({
                    ...wpData,
                    display: newDisplay,
                    answer: newAnswer
                  })
                }}>{variant}</div>
              )
            })
          }
        </div> : <></>
      }

      <div className='addPostRow'>
        <input 
          type='text'
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder='სწორი პასუხის დამატება'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: [...(prevData.display || []), solution],
            answer: [...(prevData.answer || []), solution],
            coefficient: [...(prevData.answer || []), solution].length
          }))
          setSolution('');
        }}>დამატება</button>
      </div>
      { (wpData && wpData.answer) &&
        <div className='addProblemHolder'>
          {
            wpData.answer.map((solution, ind) => {
              return (
                <div key={ind} className='addProblemVariant' onClick={() => {
                  const newDisplay = wpData.display.filter(val => val !== solution);
                  const newAnswer = wpData.answer.filter(val => val !== solution);

                  setWpData({
                    ...wpData,
                    display: newDisplay,
                    answer: newAnswer,
                    coefficient: newAnswer.length
                  })
                }}>{solution}</div>
              )
            })
          }
        </div>
      }
    </div>
  )
}

export default MultipleChoice