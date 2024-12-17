import { selectUserName } from '@features/userSlice';
import { db } from '@src/firebaseInit';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function CreateTest() {
  const userName = useSelector(selectUserName);
  const subjects = [
    'მათემატიკა', 'ქართული', 'ინგლისური', 'ისტორია',
    'გეოგრაფია', 'ფიზიკა', 'ქიმია', 'ბიოლოგია', 'ხელოვნება',
    'მუსიკა', 'მოქალაქეობა', 'რუსული'
  ];

  const template = {
    author: userName,
    name: '',
    subject: subjects[0],
    problems: [],
    grade: "7",
    maxPoint: 0,
    instructionId: '',
    access: 'სატესტო',
  };

  const savedData = localStorage.getItem('createTestFormData');
  const [formData, setFormData] = useState(savedData ? JSON.parse(savedData) : template);
  const [exerciseId, setExerciseId] = useState(''); 

  useEffect(() => {
    localStorage.setItem('createTestFormData', JSON.stringify(formData));
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    let sumOfPoints = 0;
    if (formData.problems) {
      formData.problems.forEach(problem => {
        sumOfPoints += problem.maxPoint;
      });
    }
    setFormData({
      ...formData,
      maxPoint: sumOfPoints,
    })
  }, [formData.problems])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      problems: [...formData.problems, { exercises: [], maxPoint: 0}],
    });
    setTaskName('');
  };

  const removeTask = (index) => {
    setFormData({
      ...formData,
      problems: formData.problems.filter((_, i) => i !== index),
    });
  };

  const handleExerciseAdd = async () => {
    if (!exerciseId || formData.problems.length === 0) {
      alert('გთხოვთ მიუთითოთ სწორი ინფორმაცია');
      return;
    }

    const ref = doc(db, 'problems', exerciseId.toString());
    const exerciseDoc = await getDoc(ref);
    
    if (!exerciseDoc.exists()) {
      alert('ამოცანა ვერ მოიძებნა');
      return;
    }
    
    const exerciseData = exerciseDoc.data();
    const { name, point } = exerciseData;
    const { coefficient } = exerciseData.workplaceData;
    
    const problemInd = formData.problems.length - 1;
    if (formData.problems[problemInd].exercises.some(ex => ex.point !== point * coefficient)) {
      alert('გთხოვთ მიუთითოთ შესაბამის ქულიანი ამოცანა');
      return;
    }
    
    setFormData({
      ...formData,
      problems: formData.problems.map((problem, idx) => {
        if (idx === problemInd) {
          const newExercise = { exerciseId, name, point: point * coefficient };
          return {
            ...problem,
            exercises: [...problem.exercises, newExercise],
            maxPoint: point * coefficient,
          };
        }
        return problem;
      }),
    });

    setExerciseId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.name === '' ||
      formData.problems.length === 0 ||
      formData.maxPoint === 0
    ) {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }

    let num = 1;
    try {
      num = (await getDoc(doc(db, 'tests', 'countDoc'))).data().count;
    } finally {
      try {
        const obj = {
          ...formData,
          grade: parseInt(formData.grade),
          testId: num + 1,
          date: serverTimestamp(),
        };
        const ref = doc(db, 'tests', `${num + 1}`);
        await setDoc(ref, obj);

        const cntRef = doc(db, 'tests', 'countDoc');
        await updateDoc(cntRef, { count: num + 1 });
      } catch (err) {
        console.log(err);
      } finally {
        localStorage.removeItem('createTestFormData');
        alert('ტესტი შექმნილია');
        window.location.reload();
      }
    }
  };

  return (
    <form className='addPostContainer' onSubmit={handleSubmit}>
      <div>
        <select name='subject' onChange={handleChange} value={formData.subject}>
          {subjects.map((subject, ind) => (
            <option value={subject} key={ind}>
              {subject}
            </option>
          ))}
        </select>
        <select name='grade' onChange={handleChange} value={formData.grade}>
          {[7, 8, 9, 10, 11, 12].map((grade, ind) => (
            <option value={grade} key={ind}>
              {grade}
            </option>
          ))}
        </select>
        <select name='access' onChange={handleChange} value={formData.access}>
          {
            ['საჯარო', 'სატესტო'].map((diff, ind) => {
              return (
                <option value={diff} key={ind}>{
                  diff
                }</option>
              )
            })
          }
        </select>
      </div>

      <input
        type='text'
        name='name'
        value={formData.name}
        onChange={handleChange}
        maxLength={30}
        placeholder='ტესტის სახელი'
        required
      />

      
      <input
        type='text'
        name='instructionId'
        value={formData.instructionId}
        onChange={handleChange}
        maxLength={30}
        placeholder='ინსტრუქციის ID'
      />

      <button type='button' onClick={addTask}>
        დავალების დამატება
      </button>

      <div>
        {formData.problems && formData.problems.map((task, ind) => (
          <div key={ind} className='problemContainer' style={{background: 'white'}}>
            <div>
              დავალება {ind + 1} {task.name} - მაქს. {task.maxPoint} ქულა
              <button type='button' onClick={() => removeTask(ind)}>წაშლა</button>
            </div>
            {task.exercises.map((ex, idx) => (
              <div key={idx}>#{ex.exerciseId} {ex.name} - {ex.point} ქულა</div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <input
          type='number'
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
          placeholder='ამოცანის ID'
        />
        <button type='button' onClick={handleExerciseAdd}>
          ამოცანის დამატება
        </button>
      </div>

      <div className='problemSubmit addPostSubmit'>
        <button type='submit'>დადასტურება</button>
      </div>
    </form>
  );
}

export default CreateTest;
