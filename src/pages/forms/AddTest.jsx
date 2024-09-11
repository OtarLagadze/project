import { Timestamp, addDoc, collection, doc, getDoc } from 'firebase/firestore';
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
  const [testId, setTestId] = useState('');
  const [testData, setTestData] = useState(null);

  const submit = async () => {
    if (duration === '' || !testData) {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }
    if (isNaN(date.getTime())) {
      console.error("Invalid date");
    } else {
      const timestamp = Timestamp.fromDate(date);
      const durationMinutes = parseInt(duration, 10);
      const endDate = new Date(date.getTime() + durationMinutes * 60000);
      const endTimestamp = Timestamp.fromDate(endDate);

      try {
        await addDoc(collection(db, 'testRecords'), {
          classId: chosenClass.classId,
          subject: chosenClass.subject,
          testData: testData,
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

  const handleTestAdd = async () => {
    if (!testId) return;

    const ref = doc(db, 'tests', testId.toString());
    const test = await getDoc(ref);
  
    if (!test.exists()) {
      alert('გთხოვთ მიუთითოთ სწორი ტესტის ნომერი');
      return;
    }
  
    const testData = test.data();
    const { name, maxPoint } = testData; 

    setTestData({
      testId: testId,
      name: name,
      maxPoint: maxPoint
    })
    
    setTestId('');
  }

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
      <div className='addPostRow'>
        <input 
          type='number'
          value={testId}
          onChange={(e) => setTestId(parseInt(e.target.value))}
          placeholder='ტესტის ნომერი'
        />
        <button type='button' onClick={handleTestAdd}>დამატება</button>
      </div>
      { (testData && testData.maxPoint > 0) ? 
        <div>
          <div>
            ტესტი: {testData.name}
          </div>
          <div>
            მაქსიმალური ქულა: {testData.maxPoint}
          </div>
        </div> : <></>
      }
      <div className='problemSubmit addPostSubmit'>
        <button onClick={submit}>დადასტურება</button>
      </div>
    </div>
  );
}

export default AddTest;
