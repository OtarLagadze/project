import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/userSlice';

function WriteNumber({ data }) {
  const userId = useSelector(selectUserId);
  const [val, setVal] = useState('');

  const check = () => {
    let ans = (parseInt(val) === data.answer ? 'სწორია' : 'არასწორია');
    alert(ans);
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
