import { selectUserName } from '@features/userSlice';
import { db } from '@src/firebaseInit';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function CreateTest() {
  const userName = useSelector(selectUserName);
  const subjects = ['მათემატიაკა', 'ქართული', 'ინგლისური', 'ისტორია',
    'გეოგრაფია', 'ფიზიკა', 'ქიმია', 'ბიოლოგია', 'ხელოვნება',
    'მუსიკა', 'მოქალაქეობა', 'რუსული'];
  const template = {
    author: userName,
    name: '',
    subject: subjects[0],
    grade: "7",
    problems: [],
    maxPoint: 0,
    access: 'სატესტო'
  }
  const savedData = localStorage.getItem('createTestFormData');
  const [formData, setFormData] = useState((savedData ? JSON.parse(savedData) : template));
  const [problemId, setProblemId] = useState('');

  useEffect(() => {
    localStorage.setItem('createTestFormData', JSON.stringify(formData));
  }, [formData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name === '' || !formData.problems || formData.problems.length === 0 || formData.maxPoint === 0) {
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
          date: serverTimestamp()
        }
        const ref = doc(db, 'tests', `${num + 1}`);
        await setDoc(ref, obj); 

        const cntRef = doc(db, 'tests', 'countDoc');
        await updateDoc(cntRef, {count: num + 1});
      } catch (err) {
        console.log(err);
      } finally {
        localStorage.removeItem('createTestFormData');
        alert('ტესტი შექმნილია');
        window.location.reload();
      }
    }
  }

  const handleProblemAdd = async () => {
    if (!problemId) return;

    const ref = doc(db, 'problems', problemId.toString());
    const problem = await getDoc(ref);
  
    if (!problem.exists()) {
      alert('გთხოვთ მიუთითოთ სწორი ამოცანის ნომერი');
      return;
    }
  
    const problemData = problem.data();
    const { name, point, workplaceData } = problemData; 

    const oldMaxPoint = formData.problems.reduce((total, obj) => {
      return total + obj.point;
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      problems: [
        ...prevData.problems,
        { problemId: problemId, problemName: name, point: point * workplaceData.coefficient}
      ],
      maxPoint: oldMaxPoint + point * workplaceData.coefficient
    }));
    
    setProblemId('');
  }

  return (
    <form className='addPostContainer' onSubmit={handleSubmit}>
      <div>
        <select name='subject' onChange={handleChange} value={formData.subject}>
          {
            subjects.map((subject, ind) => {
              return (
                <option value={subject} key={ind}>{subject}</option>
              )
            })
          }
        </select>
        <select name='grade' onChange={handleChange} value={formData.grade}>
          {
            [7, 8, 9, 10, 11, 12].map((grade, ind) => {
              return (
                <option value={grade} key={ind}>{grade}</option>
              )
            })
          }
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
      <div className='addPostRow'>
        <input 
          type='number'
          value={problemId}
          onChange={(e) => setProblemId(parseInt(e.target.value))}
          placeholder='ამოცანის ნომერი'
        />
        <button type='button' onClick={handleProblemAdd}>დამატება</button>
      </div>
      <div>
        {
          formData.problems.map((obj, ind) => {
            return (
              <div key={ind} onClick={() => {
                const newProblems = formData.problems.filter(child => child !== obj);
                const newMaxPoint = newProblems.reduce((total, problem) => {
                  return total + problem.point;
                }, 0);
                setFormData({
                  ...formData,
                  problems: newProblems,
                  maxPoint: newMaxPoint
                })
              }}>
                #{ind + 1} {obj.problemName} - {obj.point} ქულა
              </div>
            )
          })
        }
      </div>
      <div>
        ტესტის ჯამური ქულა - {formData.maxPoint}
      </div>
      <div className='problemSubmit addPostSubmit'>
          <button type='submit'>დადასტურება</button>
      </div>
    </form>
  )
}

export default CreateTest
