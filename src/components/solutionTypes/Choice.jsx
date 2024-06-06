import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/userSlice';

function Choice({ data }) {
  const userId = useSelector(selectUserId);
  const variantRefs = useRef(data.variants.map(() => useRef(null)));
  const mp = useRef(new Map());
  const [verdict, setVerdict] = useState(false);
  const [tries, setTries] = useState(0);
  const [variants, setVariants] = useState(data.variants.sort(() => Math.random() - 0.5));
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! be careful with thiss ^^^^^
  const [solutions, setSolutions] = useState(data.solutions);
  let usedCnt = 0;

  const updateStatus = (variant, index) => {
    variantRefs.current[index].current.classList.toggle('problemActive');
    if (variantRefs.current[index].current.classList.contains('problemActive')) {
      mp.current.set(variant, true);
      usedCnt++;
    } else {
      mp.current.set(variant, false);
      usedCnt--;
    }
  }

  useEffect(() => {
    if (tries > 0) alert(verdict);
    for (let i = 0; i < variants.length; i++) {
      variantRefs.current[i].current.classList.remove('problemActive');
    }
    variants.sort(() => Math.random() - 0.5);
    mp.current.clear();
  }, [tries, variants]);

  const check = () => {
    let ans = true;
    if (usedCnt !== solutions.length) ans = false;
    for (let i = 0; i < solutions.length; i++) {
      if (mp.current.get(solutions[i]) !== true) ans = false;
    }
    setVerdict(ans);
    setTries(tries + 1);
  }

  return (
    <div>
      <div className="problemTutorial">* აირჩიეთ ყველა სწორი პასუხი</div>
      <div className='problemSolutionContainer'>
        {
          variants.map((variant, ind) => {
            return (
              <button ref={variantRefs.current[ind]} className='problemVariant' key={ind} onClick={() => (updateStatus(variant, ind))}>
                <p>{variant}</p>
              </button>
            )
          })
        }
      </div>
      <div className='problemSubmit'>
        {
          userId ? (
            <button onClick={() => {check()}}>დადასტურება</button>
          ) : (
            <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
          )
        }
      </div>
    </div>
  )
}

export default Choice;
