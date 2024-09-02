import React, { useState, useEffect } from 'react';

function WpSorting({ data, setSubmission }) {
  const sortedDisplay = [...data.display].map(child => ({ variant: child, index: 0 }));
  const [orderedData, setOrderedData] = useState(sortedDisplay.sort(() => Math.random() - 0.5));
  const [usedCnt, setUsedCnt] = useState(0);

  useEffect(() => {
    const sortedArr = [...orderedData].sort((a, b) => a.index - b.index);
    const answerArr = sortedArr.map(({ variant }) => variant);
    if (usedCnt !== data.answer.length) return;
    setSubmission(answerArr);
  }, [orderedData]);

  const updateStatus = (ind) => {
    if (orderedData[ind].index !== 0) return;
    setOrderedData((prevDataArray) => {
      const newDataArray = [...prevDataArray];
      newDataArray[ind].index = usedCnt + 1;
      if (usedCnt + 1 <= orderedData.length) setUsedCnt(usedCnt + 1);
      return newDataArray;
    });
  };

  const reset = () => {
    const arr = [...data.display].map(child => ({ variant: child, index: 0 }));
    const shuffledData = arr.sort(() => Math.random() - 0.5);
    setOrderedData(shuffledData);
    setUsedCnt(0);
    setSubmission(null);
  };

  return (
    <div>
      <div className='problemSolutionContainer'>
        {orderedData.map(({ variant, index }, ind) => {
          return (
            <button
              className="problemVariant"
              key={ind}
              onClick={() => updateStatus(ind)}
            >
              <span style={{ fontWeight: 'bold' }}>{`${index > 0 ? `${index}. ` : ''}`}</span>
              <p>{variant}</p>
            </button>
          );
        })}
      </div>
      <button className='problemVariant' onClick={reset}>თავიდან</button>
    </div>
  );
}

export default WpSorting;
