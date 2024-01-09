import React, { useEffect, useState } from 'react'
import './AddProblem.scss'
import './AddPost.scss'
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUserName } from '../features/userSlice';

function AddProblem() {
  const userName = useSelector(selectUserName);

  const subjects = ['მათემატიაკა', 'ქართული', 'ინგლისური', 'ისტორია',
  'გეოგრაფია', 'ფიზიკა', 'ქიმია', 'ბიოლოგია', 'ხელოვნება',
  'მუსიკა', 'მოქალაქეობა', 'რუსული'];
  const [grade, setGrade] = useState(7);
  const [difficulty, setDifficulty] = useState(1);
  const [subject, setSubject] = useState(subjects[0]);
  const [ProblemName, setProblemName] = useState('');
  const [ProblemStatement, setProblemStatement] = useState('');
  const [ProblemPhoto, setProblemPhoto] = useState('');
  const [Variant, setVariant] = useState('');
  const [Solution, setSolution] = useState('');
  const [photos, setPhotos] = useState([]);
  const [variants, setVariants] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    const storedProblemName = localStorage.getItem('ProblemName');
    const storedProblemStatement = localStorage.getItem('ProblemStatement');
    const storedPhotos = localStorage.getItem('photos');
    const storedVariants = localStorage.getItem('ProblemVariants');
    const storedSolutions = localStorage.getItem('ProblemSolutions');

    if (storedProblemName) setProblemName(storedProblemName);
    if (storedProblemStatement) setProblemStatement(storedProblemStatement);
    if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
    if (storedVariants) setVariants(JSON.parse(storedVariants));
    if (storedSolutions) setSolutions(JSON.parse(storedSolutions));
  }, []);

  useEffect(() => {
    localStorage.setItem('ProblemName', ProblemName);
    localStorage.setItem('ProblemStatement', ProblemStatement);
    localStorage.setItem('ProblemVariants', JSON.stringify(variants));
    localStorage.setItem('ProblemSolutions', JSON.stringify(solutions));
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [ProblemName, ProblemStatement, photos, variants, solutions]);

  const submit = async () => {
    if (ProblemName === ''
    || ProblemStatement === '' 
    || variants.length === 0
    || solutions.length === 0) {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }
    let num = 1;
    try {
      num = (await getDoc(doc(db, 'problems', 'countDoc'))).data().count;
    } finally {

    try {
      const obj = {
        number: num,
        author: userName,
        name: ProblemName,
        subject: subject,
        grade: grade,
        difficulty: difficulty,
        problemPhotos: photos,
        problemStatement: ProblemStatement,
        variants: [...variants, ...solutions],
        solutions: solutions,
        date: serverTimestamp()
      }
      const ref = doc(db, 'problems', `${num + 1}`);
      await setDoc(ref, obj); 

      const cntRef = doc(db, 'problems', 'countDoc');
      await updateDoc(cntRef, {count: num + 1});
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.setItem('ProblemName', '');
      localStorage.setItem('ProblemStatement', '');
      localStorage.setItem('ProblemVariants', JSON.stringify([]));
      localStorage.setItem('ProblemSolutions', JSON.stringify([]));
      localStorage.setItem('photos', JSON.stringify([]));

      setProblemName('');
      setProblemStatement('');
      setVariants([]);
      setSolutions([]);
      setPhotos([]);
    }
  }
}

  return (
    <div className='addPostContainer'>
      <input 
        type='text'
        value={ProblemName}
        onChange={(e) => setProblemName(e.target.value)}
        maxLength={50}
        placeholder='ამოცანის სახელი'
        required
      />
      <textarea 
        type='text'
        value={ProblemStatement}
        onChange={(e) => setProblemStatement(e.target.value)}
        maxLength={2000}
        placeholder='ამოცანის პირობა'
        required
      />
      <div className='addPostRow'>
        <input 
          type='text'
          value={ProblemPhoto}
          onChange={(e) => setProblemPhoto(e.target.value)}
          placeholder='ფოტოს მისამართი'
        />
        <button onClick={() => {
          setPhotos([ProblemPhoto, ...photos]);
          setProblemPhoto('');
        }}>დამატება</button>
      </div>
      <div className="postPhotoHolder">
          {
            photos.map((data, ind) => {
              return (
                <img className='postScrollImg' alt='photo' src={data} key={ind} onClick={() => {
                  setPhotos(photos => photos.filter(img => img !== data));
                }}/>
              )
            })
          }
      </div>

      <div className='addPostRow'>
        <input 
          type='text'
          value={Variant}
          onChange={(e) => setVariant(e.target.value)}
          placeholder='ვარიანტის დამატება'
        />
        <button onClick={() => {
          setVariants([Variant, ...variants]);
          setVariant('');
        }}>დამატება</button>
      </div>  
      <div className="addProblemHolder">
        {
          variants.map((variant, ind) => {
            return (
              <div key={ind} className='addProblemVariant' onClick={() => {
                setVariants(variants => variants.filter(curr => variant !== curr));
              }}>{variant}</div>
            )
          })
        }
      </div>

      <div className='addPostRow'>
        <input 
          type='text'
          value={Solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder='სწორი პასუხის დამატება'
        />
        <button onClick={() => {
          setSolutions([Solution, ...solutions]);
          setSolution('');
        }}>დამატება</button>
      </div>
      <div className='addProblemHolder'>
        {
          solutions.map((solution, ind) => {
            return (
              <div key={ind} className='addProblemVariant'
              onClick={() => {
                setSolutions(solutions => solutions.filter(curr => solution !== curr));
              }}>{solution}</div>
            )
          })
        }
      </div>
      <select onChange={(e) => setSubject(e.target.value)} value={subject}>
        {
          subjects.map((subject, ind) => {
            return (
              <option value={subject} key={ind}>{subject}</option>
            )
          })
        }
      </select>
      <select onChange={(e) => setGrade(e.target.value)} value={grade}>
        {
          [7, 8, 9, 10, 11, 12].map((grade, ind) => {
            return (
              <option value={grade} key={ind}>{grade}</option>
            )
          })
        }
      </select>
      <select onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
        {
          [1, 2, 3].map((diff, ind) => {
            return (
              <option value={diff} key={ind}>{
                diff === 1 ? 'ადვილი' : diff == 2 ? 'საშუალო' : 'რთული'
              }</option>
            )
          })
        }
      </select>
      <div className='problemSubmit addPostSubmit'>
          <button onClick={() => {submit()}}>დადასტურება</button>
      </div>
    </div>
  )
}

export default AddProblem
