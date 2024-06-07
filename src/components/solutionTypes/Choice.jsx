import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserId, updateVerdicts } from '../../features/userSlice';

function Choice({ data, problemInd }) {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const [verdict, setVerdict] = useState(false);
  const [tries, setTries] = useState(0);
  const [variants, setVariants] = useState(data.variants);
  const [solutions, setSolutions] = useState(data.solutions);
  const variantRefs = useMemo(() => data.variants.map(() => React.createRef()), [data.variants]);
  const mp = useRef(new Map());
  let usedCnt = 0;

  const updateStatus = (variant, index) => {
    variantRefs[index].current.classList.toggle('problemActive');
    if (variantRefs[index].current.classList.contains('problemActive')) {
      mp.current.set(variant, true);
      usedCnt++;
    } else {
      mp.current.set(variant, false);
      usedCnt--;
    }
  }

  useEffect(() => {
    for (let i = 0; i < variants.length; i++) {
      variantRefs[i].current.classList.remove('problemActive');
    }
    const shuffledVariants = [...variants].sort(() => Math.random() - 0.5);
    setVariants(shuffledVariants);
    mp.current.clear();
  }, [tries]);

  const check = () => {
    let ans = true;
    if (usedCnt !== solutions.length) ans = false;
    for (let i = 0; i < solutions.length; i++) {
      if (mp.current.get(solutions[i]) !== true) ans = false;
    }
    setVerdict(ans);
    dispatch(updateVerdicts({ verdict: ans }));
    setTries(tries + 1);
    window.location.reload();
  }

  return (
    <div>
      <div className="problemTutorial">* აირჩიეთ ყველა სწორი პასუხი</div>
      <div className='problemSolutionContainer'>
        {
          variants.map((variant, ind) => (
            <button ref={variantRefs[ind]} className='problemVariant' key={ind} onClick={() => updateStatus(variant, ind)}>
              <p>{variant}</p>
            </button>
          ))
        }
      </div>
      <div className='problemSubmit'>
        {
          userId ? (
            <button onClick={() => { check() }}>დადასტურება</button>
          ) : (
            <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
          )
        }
      </div>
    </div>
  );
}

export default Choice;
