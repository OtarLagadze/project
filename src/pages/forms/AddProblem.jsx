import { Timestamp, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserClassGroups, selectUserName } from '@features/userSlice';
import { db } from '@src/firebaseInit';
import Calendar from '@components/Calendar';
import './AddTest.scss';

function AddTest() {
  const userClassGroups = useSelector(selectUserClassGroups);
  const userName = useSelector(selectUserName);

  const template = {
    chosenClass: userClassGroups[0] || {},
    date: new Date(),
    duration: '',
    testId: '',
    testData: null,
  };

  const savedData = localStorage.getItem('AddTestFormData');
  const [formData, setFormData] = useState(savedData ? JSON.parse(savedData) : template);

  useEffect(() => {
    localStorage.setItem('AddTestFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClassChange = (e) => {
    setFormData({
      ...formData,
      chosenClass: JSON.parse(e.target.value),
    });
  };

  const handleTestAdd = async () => {
    if (!formData.testId) return;

    const ref = doc(db, 'tests', formData.testId.toString());
    const test = await getDoc(ref);

    if (!test.exists()) {
      alert('გთხოვთ მიუთითოთ სწორი ტესტის ნომერი');
      return;
    }

    const testData = test.data();
    const { name, maxPoint } = testData;

    setFormData({
      ...formData,
      testData: {
        testId: formData.testId,
        name,
        maxPoint,
      },
      testId: '',
    });
  };

  const submit = async () => {
    if (formData.duration === '' || !formData.testData) {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }

    if (isNaN(formData.date.getTime())) {
      console.error("Invalid date");
    } else {
      const timestamp = Timestamp.fromDate(formData.date);
      const durationMinutes = parseInt(formData.duration, 10);
      const endDate = new Date(formData.date.getTime() + durationMinutes * 60000);
      const endTimestamp = Timestamp.fromDate(endDate);

      try {
        await addDoc(collection(db, 'testRecords'), {
          classId: formData.chosenClass.classId,
          subject: formData.chosenClass.subject,
          testData: formData.testData,
          startDate: timestamp,
          endDate: endTimestamp,
          duration: durationMinutes,
          teacher: userName,
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
      {/* Class Selector */}
      <select
        onChange={handleClassChange}
        value={JSON.stringify(formData.chosenClass)}
      >
        {userClassGroups &&
          userClassGroups.map((obj, ind) => (
            <option value={JSON.stringify(obj)} key={ind}>
              {obj.classId + ' ' + obj.subject}
            </option>
          ))}
      </select>

      {/* Calendar Date Picker */}
      <div>
        <Calendar currDate={formData.date} setCurrDate={(date) => setFormData({ ...formData, date })} />
      </div>

      {/* Duration Input */}
      <input
        type="number"
        value={formData.duration}
        onChange={handleChange}
        name="duration"
        min="0"
        max="300"
        placeholder='ხანგრძლივობა წუთებში'
        required
      />

      {/* Test ID Section */}
      <div className='addPostRow'>
        <input
          type='number'
          value={formData.testId}
          onChange={handleChange}
          name="testId"
          placeholder='ტესტის ნომერი'
        />
        <button type='button' onClick={handleTestAdd}>დამატება</button>
      </div>

      {/* Test Data Summary */}
      {formData.testData?.maxPoint > 0 ? (
        <div>
          <div>ტესტი: {formData.testData.name}</div>
          <div>მაქსიმალური ქულა: {formData.testData.maxPoint}</div>
        </div>
      ) : null}

      {/* Submit Section */}
      <div className='problemSubmit addPostSubmit'>
        <button onClick={submit}>დადასტურება</button>
      </div>
    </div>
  );
}

export default AddTest;
