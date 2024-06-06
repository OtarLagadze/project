import React, { useEffect, useState } from 'react'
import './AddProblem.scss'
import './AddPost.scss'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUserName } from '../features/userSlice';

const ChooseVariants = ({ updateSolutionData }) => {
  const [Variant, setVariant] = useState('');
  const [Solution, setSolution] = useState('');
  const [variants, setVariants] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    const storedProblemVariants = localStorage.getItem('ProblemVariants');
    const storedProblemSolutions = localStorage.getItem('ProblemSolutions');

    if (storedProblemVariants) setVariants(JSON.parse(storedProblemVariants));
    if (storedProblemSolutions) setSolutions(JSON.parse(storedProblemSolutions));
  }, []);

  useEffect(() => {
    localStorage.setItem('ProblemVariants', JSON.stringify(variants));
    localStorage.setItem('ProblemSolutions', JSON.stringify(solutions));
    const newData = {
      variants: [...variants, ...solutions],
      solutions: solutions
    }
    updateSolutionData(newData);
  }, [variants, solutions]);

  return (
    <div>
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
    </div>
  )
}

const Matching = ({ updateSolutionData }) => {
  const [variant, setVariant] = useState('');
  const [answer, setAnswer] = useState('');
  const [variants, setVariants] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [pairs, setPairs] = useState([]);
  
  useEffect(() => {
    const storedProblemMatchingPairs = localStorage.getItem('ProblemMatchingPairs'); 
    const storedProblemMatchingVariants = localStorage.getItem('storedProblemMatchingVariants'); 
    const storedProblemMatchingAnswers = localStorage.getItem('storedProblemMatchingAnswers'); 

    if (storedProblemMatchingPairs) setPairs(JSON.parse(storedProblemMatchingPairs));
    if (storedProblemMatchingVariants) setPairs(JSON.parse(storedProblemMatchingVariants));
    if (storedProblemMatchingAnswers) setPairs(JSON.parse(storedProblemMatchingAnswers));
  }, []);
  
  useEffect(() => {
    localStorage.setItem('ProblemMatchingPairs', JSON.stringify(pairs));
    localStorage.setItem('storedProblemMatchingVariants', JSON.stringify(pairs));
    localStorage.setItem('storedProblemMatchingAnswers', JSON.stringify(pairs));

    const newData = {
      variants: variants,
      answers: answers,
      correct: pairs
    }
    updateSolutionData(newData);
  }, [pairs]);

  return (
    <div>
      <div className='addPostRow'>
        <input 
          type='text'
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          maxLength={50}
          placeholder='ვარიანტი'
          required
        />
        <input 
          type='text'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={50}
          placeholder='პასუხი'
          id='addProblemEdge'
          required
        />
        <button onClick={() => {
          setPairs(pairs => [...pairs, {variant: variant, answer: answer}]);
          setVariants([...variants, variant]);
          setAnswers([...answers, answer]);
          setVariant('');
          setAnswer('');
        }}>დამატება</button>
      </div>
      {
        pairs.map((curr, ind) => {
          return (
            <div key={ind}
              onClick={() => {
                setPairs(pairs => pairs.filter(val => val !== curr));
              }}
            >{curr.variant} - {curr.answer}</div>
          )
        })
      }
    </div>
  )
}

const Order = ({ updateSolutionData }) => {
  const [variant, setVariant] = useState('');
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const storedProblemOrder = localStorage.getItem('ProblemOrder');

    if (storedProblemOrder) setOrder(JSON.parse(storedProblemOrder));
  }, []);

  useEffect(() => {
    localStorage.setItem('ProblemOrder', JSON.stringify(order));
    
    const variants = [...order];
    variants.sort(() => Math.random() - 0.5);
    const newData = {
      variants: variants,
      correctOrder: order
    }
    updateSolutionData(newData);
  }, [order]);

  return (
    <div>
      <div className='addPostRow'>
        <input 
          type='text'
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          maxLength={50}
          placeholder='ვარიანტი'
          required
        />
        <button onClick={() => {
          setOrder(order => [...order, variant])
          setVariant('');
        }}>დამატება</button>
      </div>
      {
        order.map((val, ind) => {
          return (
            <div 
              key={ind}
              onClick={() => {
                setOrder(order => order.filter(old => old !== val));
              }}
            >{ind + 1}. {val}</div>
          )
        })
      }
    </div>
  )
}

function AddProblem() {
  const userName = useSelector(selectUserName);

  const subjects = ['მათემატიაკა', 'ქართული', 'ინგლისური', 'ისტორია',
  'გეოგრაფია', 'ფიზიკა', 'ქიმია', 'ბიოლოგია', 'ხელოვნება',
  'მუსიკა', 'მოქალაქეობა', 'რუსული'];
  const problemTypes = ['ვარიანტების არჩევა', 'შესაბამისობა', 'დალაგება', 'რიცხვის ჩაწერა', 'ფოტოს ამოცნობა', 'გამოტოვებული სიტყვები'];
  
  const [grade, setGrade] = useState(7);
  const [difficulty, setDifficulty] = useState(1);
  const [subject, setSubject] = useState(subjects[0]);
  const [ProblemName, setProblemName] = useState('');
  const [ProblemStatement, setProblemStatement] = useState('');
  const [ProblemPhoto, setProblemPhoto] = useState('');
  const [photos, setPhotos] = useState([]);
  const [problemType, setProblemType] = useState(problemTypes[0]);
  const [solutionData, setSolutionData] = useState({});
  const [problemAccess, setProblemAccess] = useState('');

  useEffect(() => {
    const storedProblemName = localStorage.getItem('ProblemName');
    const storedProblemStatement = localStorage.getItem('ProblemStatement');
    const storedPhotos = localStorage.getItem('photos');
    const storedSolutionData = localStorage.getItem('ProblemSolutionData');
    const storedProblemType = localStorage.getItem('ProblemType');

    if (storedProblemType) setProblemType(storedProblemType);
    if (storedProblemName) setProblemName(storedProblemName);
    if (storedProblemStatement) setProblemStatement(storedProblemStatement);
    if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
    if (storedSolutionData) setSolutionData(JSON.parse(storedSolutionData));
  }, []);

  useEffect(() => {
    localStorage.setItem('ProblemName', ProblemName);
    localStorage.setItem('ProblemStatement', ProblemStatement);
    localStorage.setItem('photos', JSON.stringify(photos));
    localStorage.setItem('ProblemSolutionData', JSON.stringify(solutionData));
    localStorage.setItem('ProblemType', problemType);
  }, [ProblemName, ProblemStatement, photos, solutionData, problemType]);

  const submit = async () => {
    if (ProblemName === ''
    || ProblemStatement === '' 
    || solutionData == {}) {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }
    let num = 1;
    try {
      num = (await getDoc(doc(db, 'problems', 'countDoc'))).data().count;
    } finally {
      try {
        const obj = {
          number: num + 1,
          author: userName,
          name: ProblemName,
          subject: subject,
          grade: grade,
          difficulty: difficulty,
          problemPhotos: photos,
          problemStatement: ProblemStatement,
          problemType: problemType,
          solutionData: solutionData,
          problemAccess: problemAccess,
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
        localStorage.setItem('ProblemType', '');
        localStorage.setItem('ProblemSolutionData', JSON.stringify({}));
        localStorage.setItem('ProblemVariants', JSON.stringify([]));
        localStorage.setItem('ProblemSolutions', JSON.stringify([]));
        localStorage.setItem('ProblemMatchingPairs', JSON.stringify([]));
        localStorage.setItem('photos', JSON.stringify([]));
        localStorage.setItem('ProblemOrder', JSON.stringify([]));

        setProblemName('');
        setProblemStatement('');
        setPhotos([]);
        setSolutionData({});
        setProblemType('');
      }
    }
  }

  const updateSolutionData = (newData) => {
    setSolutionData(newData);
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

      <div>
        ამოცანის ტიპი: 
        <select onChange = {(e) => setProblemType(e.target.value)} value={problemType}>
          {
            problemTypes.map((val, ind) => {
              return (
                <option value={val} key={ind}>{val}</option>
              )
            })
          }
        </select>
      </div>

      <div>
          {problemType === 'ვარიანტების არჩევა' && <ChooseVariants updateSolutionData={updateSolutionData}/>}
          {problemType === 'შესაბამისობა' && <Matching updateSolutionData={updateSolutionData}/>}
          {problemType === 'დალაგება' && <Order updateSolutionData={updateSolutionData}/>}
          {problemType === 'რიცხვის ჩაწერა' && <h2>ეს ფუნქცია მალე დამატება</h2>}
          {problemType === 'ფოტოს ამოცნობა' && <h2>ეს ფუნქცია მალე დამატება</h2>}
          {problemType === 'გამოტოვებული სიტყვები' && <h2>ეს ფუნქცია მალე დამატება</h2>}

      </div>

      <div>
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
        <select onChange={(e) => setProblemAccess(e.target.value)} value={problemAccess}>
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
      <div className='problemSubmit addPostSubmit'>
          <button onClick={() => {submit()}}>დადასტურება</button>
      </div>
    </div>
  )
}

export default AddProblem
