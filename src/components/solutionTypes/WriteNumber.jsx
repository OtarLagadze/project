import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectUserId, selectVerdicts, updateVerdicts } from '../../features/userSlice';

function WriteNumber({ data }) {
  const userId = useSelector(selectUserId);
  const [val, setVal] = useState('');

  const dispatch = useDispatch();

  const check = () => {
    let ans = (parseInt(val) === data.answer ? 'სწორია' : 'არასწორია');
    dispatch(updateVerdicts({ taskId: problemInd, verdict: ans }));
    setVal('');
  }

  return (
    <div>
      <div className="problemTutorial">* ჩაწერეთ შესაბამისი მთელი რიცხვი</div>
      <div className='problemSolutionContainer'>
        <input value={val} onChange={(e) => {setVal(e.target.value)}} type='number' className='writeInput'/>
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
    </div>
  )
}

export default WriteNumber
