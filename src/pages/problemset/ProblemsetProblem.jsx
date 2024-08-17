import React, { useEffect, useRef, useState } from 'react'
import './ProblemsetProblem.scss'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux';
import { selectUserId } from '@features/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import Choice from '@components/solutionTypes/Choice';
import Order from '@components/solutionTypes/order';
import Matching from '@components/solutionTypes/Matching';
import WriteNumber from '@components/solutionTypes/WriteNumber';
import { evaluateProblem } from '@features/evaluators/problemEvaluator';

const ProblemSolution = ({data}) => {
  if (data.problemType === "ვარიანტების არჩევა") return <Choice data={data.solutionData}/>
  if (data.problemType === "დალაგება") return <Order data={data.solutionData}/>
  if (data.problemType === "შესაბამისობა") return <Matching data={data.solutionData}/>
  if (data.problemType === "რიცხვის ჩაწერა") return <WriteNumber data={data.solutionData}/>
}

function ProblemsetProblem() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { problemId } = useParams();

  const jsonData = {
      problemType: "რიცხვის ჩაწერა",
      maxPoint: 5,
      point: 5,
      submission: 11,
      answer: 10,
  }

  useEffect(() => {
    console.log(jsonData.maxPoint, evaluateProblem(jsonData));
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