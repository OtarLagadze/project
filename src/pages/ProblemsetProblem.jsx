import React, { useEffect, useRef, useState } from 'react'
import './ProblemsetProblem.scss'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux';
import { selectUserId } from '../features/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


const Choice = ({data}) => {
  const userId = useSelector(selectUserId);
  const variantRefs = data.variants.map(() => useRef(null));
  const mp = new Map();
  const [verdict, setVerdit] = useState(false);
  const [tries, setTries] = useState(0);
  let usedCnt = 0;

  data.variants.sort(() => Math.random() - 0.5);

  const updateStatus = (variant, index) => {
    variantRefs[index].current.classList.toggle('problemActive');
    if (variantRefs[index].current.classList.contains('problemActive')) {
      mp.set(variant, true);
      usedCnt++;
    } else {
      mp.set(variant, false);
      usedCnt--;
    }
  }

  useEffect(() => {
    if (tries > 0) alert(verdict);
    for (let i = 0; i < data.variants.length; i++) {
      variantRefs[i].current.classList.remove('problemActive');
    }
    data.variants.sort(() => Math.random() - 0.5);
    mp.clear();
  }, [tries]);

  const check = () => {
    let ans = true;
    if (usedCnt != data.solutions.length) ans = false;
    for (let i = 0; i < data.solutions.length; i++) {
      if (mp.get(data.solutions[i]) !== true) ans = false;
    }
    setVerdit(ans);
    setTries(tries + 1);
  }

  return (
    <div>
      <div className="problemTutorial">* აირჩიეთ ყველა სწორი პასუხი</div>
      <div className='problemSolutionContainer'>
        {
          data.variants.map((variant, ind) => {
            return (
              <button ref={variantRefs[ind]} className='problemVariant' key={ind} onClick={() => (updateStatus(variant, ind))}>
                <p>{variant}</p>
              </button>
            )
          })
        }
      </div>
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
  )
}

const WriteNumber = ({data}) => {
  const userId = useSelector(selectUserId);
  const [val, setVal] = useState('');

  const check = () => {
    let ans = (parseInt(val) === data.answer ? true : false);
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

const ProblemSolution = ({data}) => {
  return <Choice data={data}/>
  if (data[problemId - 1].type === "choice") return <Choice data={data[problemId - 1]}/>
  if (data[problemId - 1].type === "order") return <Order data={data[problemId - 1]}/>
  if (data[problemId - 1].type === "placeIn") return <PlaceIn data={data[problemId - 1]}/>
  if (data[problemId - 1].type === "writeNumber") return <WriteNumber data={data[problemId - 1]}/>
}

function ProblemsetProblem() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { problemId } = useParams();
  useEffect(() => {
    const fetch = async () => {
        try {
            const ref = doc(db, 'problems', problemId);
            const res = await getDoc(ref);

            setData(res.data());
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
      }
        
      fetch();
    }, [problemId])

  return (
    <> { !loading &&
    <div className='problemContainer'>
      <div className="problemHeader">
        <h1>{data.name}</h1>
      </div>
      <div className="problemStatement">
        <p>{data.problemStatement}</p>
        <div className='postPhotoHolder'>
          {
            data.problemPhotos.map((img, ind) => {
              return (
                <img src={img} key={ind} alt='img' className='postScrollImg'/>
              )
            })
          }
        </div>
      </div>
      <ProblemSolution data={data}/>
    </div>
    }</>
  )
}

export default ProblemsetProblem