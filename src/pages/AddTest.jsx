import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserClassGroups } from '../features/userSlice';

function AddTest() {
  const userClassGroups = useSelector(selectUserClassGroups);
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [chosenClassId, setClassId] = useState('');

  const submit = () => {
    const [year, month, day] = date.split('-').map(Number);
    const hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);
    
    const newDate = new Date(year, month - 1, day, hourNum, minuteNum);
    const timestamp = Timestamp.fromDate(newDate);
    
    console.log(timestamp);
    console.log('Converted Date:', newDate);
  };
  
  return (
    <div className='addPostContainer'>
      <select onChange={(e) => setClassId(e.target.value)} value={chosenClassId}>
        { userClassGroups &&
          userClassGroups.map(({subject, classId}, ind) => {
            return (
              <option value={classId} key={ind}>
                { classId + ' ' + subject }
              </option>
            )
          })
        }
      </select>
      <input 
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        min="0"
        max="23"
        placeholder='საათი'
        required
      />
      <input
        type="number"
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        min="0"
        placeholder='წუთი'
        max="59"
        required
      />
      
      <div className='problemSubmit addPostSubmit'>
          <button onClick={() => {submit()}}>დადასტურება</button>
      </div>
    </div>
  )
}

export default AddTest
