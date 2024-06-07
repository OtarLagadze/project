import React, { useEffect, useRef, useState } from 'react'
import './ProblemsetProblem.scss'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux';
import { selectUserId, selectVerdicts } from '../features/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Choice from '../components/solutionTypes/Choice';
import Order from '../components/solutionTypes/order';
import Matching from '../components/solutionTypes/Matching';
import WriteNumber from '../components/solutionTypes/WriteNumber';

const ProblemSolution = ({data, problemInd}) => {
  if (data.problemType === "ვარიანტების არჩევა") return <Choice data={data.solutionData} problemInd={problemInd} />
  if (data.problemType === "დალაგება") return <Order data={data.solutionData} problemInd={problemInd} />
  if (data.problemType === "შესაბამისობა") return <Matching data={data.solutionData} problemInd={problemInd} />
  if (data.problemType === "რიცხვის ჩაწერა") return <WriteNumber data={data.solutionData} problemInd={problemInd} />
}

function ProblemsetProblem({ problemId, problemInd }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <ProblemSolution data={data} problemInd={problemInd}/>
    </div>
    }</>
  )
}

export default ProblemsetProblem