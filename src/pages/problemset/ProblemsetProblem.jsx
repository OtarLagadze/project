import React, { useEffect, useRef, useState } from 'react'
import './ProblemsetProblem.scss'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux';
import { selectUserId } from '@features/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import Workplace from '@components/workplace/Workplace';
import ProblemReply from '@components/problemReply/ProblemReply';

function ProblemsetProblem() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState(null);
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
      <>
        <div className='problemContainer'>
          <div className="problemHeader">
            <h1>{data.name}</h1>
          </div>
          {
            (data.point !== 0 ? 
              <div>
                მაქსიმალური ქულა: {data.point * data.workplaceData.coefficient}
              </div> : <></>
            )
          }
          <div className="problemStatement">
            <p>{data.statement}</p>
            <div className='postPhotoHolder'>
              {
                data.photos.map((obj, ind) => {
                  return (
                    <img src={obj.src} key={ind} alt='img' className='postScrollImg'/>
                  )
                })
              }
            </div>
          </div>
          <Workplace setReplyData={setReplyData} data={{
            type: data.type,
            WpData: {...data.workplaceData, point: data.point, maxPoint: data.point * data.workplaceData.coefficient}
          }}/>
        </div>
        {replyData !== null ? 
          <div className="problemContainer">
            <ProblemReply replyData={replyData} />
          </div> : <></>
        }
      </>
    }
    </>
  )
}

export default ProblemsetProblem