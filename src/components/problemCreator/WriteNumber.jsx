import React, { useEffect, useState } from 'react'

function WriteNumber({ setFormData }) {
  //wp - workplace
  const [wpData, setWpData] = useState({
    coefficient: 1,
    display: 0,
    answer: 0,
  })

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
      <div className="addPostRow">
        <input
          type='number'
          value={wpData.answer}
          onChange={(e) => {
            setWpData(() => ({
              ...wpData,
              display: parseInt(e.target.value),
              answer: parseInt(e.target.value)
            }))
          }}
          placeholder='ჩაწერეთ პასუხი (რიცხვი)'
          required
        />
      </div>
    </div>
  )
}

export default WriteNumber
