import React, { useState, useRef } from 'react';

function WpMultipleChoice({ data, setSubmission }) {
  const [shuffledVariants, setShuffledVariants] = useState([...data.display].sort(() => Math.random() - 0.5));
  const variantRefs = useRef(shuffledVariants.map(() => React.createRef()));

  const updateStatus = (variant, index) => {
    variantRefs.current[index].current.classList.toggle('problemActive');

    const curr = [];
    for (let i = 0; i < shuffledVariants.length; i++) {
      if (variantRefs.current[i].current.classList.contains('problemActive')) {
        curr.push(shuffledVariants[i]);
      }
    }
    setSubmission(curr);
  };

  return (
    <div className='problemSolutionContainer'>
      {shuffledVariants.map((variant, ind) => (
        <button
          ref={variantRefs.current[ind]}
          className='problemVariant'
          key={ind}
          onClick={() => updateStatus(variant, ind)}
        >
          <p>{variant}</p>
        </button>
      ))}
    </div>
  );
}

export default WpMultipleChoice;
