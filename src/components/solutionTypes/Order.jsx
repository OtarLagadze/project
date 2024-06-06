import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/userSlice';

function Order({ data }) {
  const userId = useSelector(selectUserId);
  const [variants, setVariants] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [orderedData, setOrderedData] = useState([]);
  const variantRefs = useRef([]);
  const [usedCnt, setUsedCnt] = useState(0);

  useEffect(() => {
    shuffleData();
  }, [data]);

  const shuffleData = () => {
    const shuffledVariants = [...data.variants].sort(() => Math.random() - 0.5);
    setVariants(shuffledVariants);
    setCorrectOrder(data.correctOrder);
    setOrderedData(shuffledVariants.map((val) => ({ variant: val, index: 0 })));
    setUsedCnt(0);
  };

  const resetSelection = () => {
    shuffleData();
  };

  const updateStatus = (ind) => {
    if (orderedData[ind].index !== 0) return;
    setOrderedData((prevDataArray) => {
      const newDataArray = [...prevDataArray];
      newDataArray[ind].index = usedCnt + 1;
      if (usedCnt + 1 <= orderedData.length) setUsedCnt(usedCnt + 1);
      return newDataArray;
    });
  };

  const check = () => {
    if (usedCnt !== orderedData.length) {
      alert('გთხოვთ აირჩიოთ ყველა ვარიანტი');
      return;
    }

    let ans = true;
    orderedData.forEach((el) => {
      if (correctOrder[el.index - 1] !== el.variant) ans = false;
    });
    alert(ans);
    resetSelection();
  };

  return (
    <div>
      <div className="problemTutorial">* აირჩიეთ სწორი თანმიმდევრობით</div>
      <div className="problemSolutionContainer">
        {orderedData.map(({ variant, index }, ind) => {
          variantRefs.current[ind] = variantRefs.current[ind] || React.createRef();
          return (
            <button
              ref={variantRefs.current[ind]}
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
      <div className="problemSubmit">
        {userId ? (
          <div>
            <button onClick={resetSelection}>თავიდან</button>
            <button onClick={check}>დადასტურება</button>
          </div>
        ) : (
          <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
        )}
      </div>
    </div>
  );
}

export default Order;
