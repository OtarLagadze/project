import { Timestamp, addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserClassGroups, selectUserName } from '@features/userSlice';
import { db } from '@src/firebaseInit';
import Calendar from '@components/Calendar';
import './AddTest.scss';

function AddTest() {
  const userClassGroups = useSelector(selectUserClassGroups);
  const userName = useSelector(selectUserName);
  const [chosenClass, setChosenClass] = useState(userClassGroups[0]);
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState('');

  const submit = async () => {
    if (isNaN(date.getTime())) {
      console.error("Invalid date");
    } else {
      const timestamp = Timestamp.fromDate(date);
      const durationMinutes = parseInt(duration, 10);
      const endDate = new Date(date.getTime() + durationMinutes * 60000);
      const endTimestamp = Timestamp.fromDate(endDate);

      try {
        await addDoc(collection(db, 'tests'), {
          classId: chosenClass.classId,
          subject: chosenClass.subject,
          startDate: timestamp,
          endDate: endTimestamp,
          duration: durationMinutes,
          teacher: userName
        });
      } catch (e) {
        console.error('Error writing document: ', e);
      } finally {
        window.location.reload();
      }
    }
  };

  return (
    <div className='addPostContainer'>
      <select onChange={(e) => setChosenClass(JSON.parse(e.target.value))} value={JSON.stringify(chosenClass)}>
        {userClassGroups &&
          userClassGroups.map((obj, ind) => (
            <option value={JSON.stringify(obj)} key={ind}>
              {obj.classId + ' ' + obj.subject}
            </option>
          ))
        }
      </select>
      <div>
        <Calendar currDate={date} setCurrDate={setDate} />
      </div>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        min="0"
        max="300"
        placeholder='ხანგრძლივობა წუთებში'
        required
      />
      <div className='problemSubmit addPostSubmit'>
        <button onClick={submit}>დადასტურება</button>
      </div>
    </div>
  );
}

export default AddTest;
