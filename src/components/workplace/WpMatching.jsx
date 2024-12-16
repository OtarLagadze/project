import { MathJax } from 'better-react-mathjax';
import React, { useState, useRef, useEffect } from 'react';
import Xarrow from 'react-xarrows';

function WpMatching({ data, setSubmission }) {
  const [pairs, setPairs] = useState([]);
  const [lastVariant, setLastVariant] = useState(0);
  const [usedVars, setUsedVars] = useState(Array(data.display.length).fill(false));
  const [usedAns, setUsedAns] = useState(Array(data.answer.length).fill(false));
  const [variants, setVariants] = useState([...data.display.first].sort(() => Math.random() - 0.5));
  const [answers, setAnswers] = useState([...data.display.second].sort(() => Math.random() - 0.5));
  const variantRefs = useRef([]);
  const answerRefs = useRef([]);

  const reset = () => {
    setPairs([]);
    setLastVariant(-1);

    setUsedVars(Array(data.display.first.length).fill(false));
    setUsedAns(Array(data.display.second.length).fill(false));

    setVariants([...data.display.first].sort(() => Math.random() - 0.5));
    setAnswers([...data.display.second].sort(() => Math.random() - 0.5));

    setSubmission(null);
  };

  useEffect(() => {
    const answerPairs = [];
    pairs.forEach(child => {
      answerPairs.push({
        first: variants[child.leftIndex],
        second: answers[child.rightIndex],
      })
    });
    setSubmission(answerPairs);
  }, [pairs]);

  const addPair = (rightIndex) => {
    if (lastVariant === -1 || usedVars[lastVariant] || usedAns[rightIndex]) return;
    const leftIndex = lastVariant;
    setPairs(pairs => [...pairs, { leftIndex: leftIndex, rightIndex: rightIndex }]);
    setUsedVars(usedVars => {
      const newUsedVars = [...usedVars];
      newUsedVars[leftIndex] = true;
      return newUsedVars;
    });
    setUsedAns(usedAns => {
      const newUsedAns = [...usedAns];
      newUsedAns[rightIndex] = true;
      return newUsedAns;
    });
    setLastVariant(-1);
  }

  return (
    <div>
      <div className='problemSolutionContainer problemMatchingContainer'>
        <div className="problemMatchingVariants">
          {
            variants.map((val, ind) => {
              variantRefs.current[ind] = variantRefs.current[ind] || React.createRef();
              return (
                <button className='problemVariant' key={ind} onClick={() => setLastVariant(ind)} ref={variantRefs.current[ind]}>
                  <p>{val}</p>
                  <div className='problemVariantPoint'></div>
                </button>
              )
            })
          }
        </div>
        <div className="problemMatchingAnswers">
          {
            answers.map((val, ind) => {
              answerRefs.current[ind] = answerRefs.current[ind] || React.createRef();
              return (
                <button className='problemVariant' key={ind} onClick={() => addPair(ind)} ref={answerRefs.current[ind]}>
                  <div className='problemAnswerPoint'></div>
                  <MathJax className='mathElement'>{val}</MathJax>
                </button>
              )
            })
          }
        </div>
      </div>
      {pairs.map((pair, index) => (
        <Xarrow
          key={index}
          start={variantRefs.current[pair.leftIndex]}
          end={answerRefs.current[pair.rightIndex]}
          strokeWidth={3}
          curveness={0.8}
          headSize={0}
        />
      ))}
      <button className='problemVariant' onClick={reset}>თავიდან</button>
    </div>
  )
}

export default WpMatching;
