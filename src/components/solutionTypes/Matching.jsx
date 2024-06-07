import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserId, selectVerdicts, updateVerdicts } from '../../features/userSlice';
import Xarrow from 'react-xarrows';

function Matching({ data, problemInd }) {
  const userId = useSelector(selectUserId);
  const [pairs, setPairs] = useState([]);
  const [lastVariant, setLastVariant] = useState(0);
  const [usedVars, setUsedVars] = useState(Array(data.variants.length).fill(false));
  const [usedAns, setUsedAns] = useState(Array(data.answers.length).fill(false));
  const [variants, setVariants] = useState([]);
  const [answers, setAnswers] = useState([]);
  const variantRefs = useRef([]);
  const answerRefs = useRef([]);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const shuffledVariants = [...data.variants].sort(() => Math.random() - 0.5);
    const shuffledAnswers = [...data.answers].sort(() => Math.random() - 0.5);
    setVariants(shuffledVariants);
    setAnswers(shuffledAnswers);
  }, [data]);

  const resetSelection = () => {
    setPairs([]);
    setLastVariant(-1);
    setUsedVars(Array(variants.length).fill(false));
    setUsedAns(Array(answers.length).fill(false));

    const shuffledVariants = [...data.variants].sort(() => Math.random() - 0.5);
    const shuffledAnswers = [...data.answers].sort(() => Math.random() - 0.5);
    setVariants(shuffledVariants);
    setAnswers(shuffledAnswers);
  }

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

  const check = () => {
    if (pairs.length !== data.correct.length) {
      alert('გთხოვთ შეუსაბამოთ თითოეული ვარიანტი');
      return;
    }
    const userSolution = pairs.map(pair => {
      return { variant: variants[pair.leftIndex], answer: answers[pair.rightIndex] };
    })
    let ans = true;
    userSolution.forEach(el => {
      if (!data.correct.some(({ variant, answer }) => variant === el.variant && answer === el.answer)) {
        ans = false;
      }
    })
    dispatch(updateVerdicts({ verdict: ans }));
    resetSelection();
    window.location.reload();
  }

  return (
    <div>
      <div className="problemTutorial">* შეუსაბამეთ სწორი პასუხები</div>
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
                  <p>{val}</p>
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

      <div className='problemSubmit'>
        {
          userId ? (
            <div>
              <button onClick={() => resetSelection()}>თავიდან</button>
              <button onClick={() => check()}>დადასტურება</button>
            </div>
          ) : (
            <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
          )
        }
      </div>
    </div>
  )
}

export default Matching;
