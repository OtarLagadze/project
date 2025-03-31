import React, { useEffect, useRef, useState } from 'react'
import './ProblemsetProblem.scss'
// import '../forms/AddPost.scss'
// import '../forms/AddProblem.scss'
import { useParams } from 'react-router'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectUserId, selectUserRole, selectUserVerified } from '@features/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import Workplace from '@components/workplace/Workplace';
import ProblemReply from '@components/problemReply/ProblemReply';
import TextareaAutosize from 'react-textarea-autosize';

function ProblemsetProblem() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState(null);
  const { problemId } = useParams();
  const userRole = useSelector(selectUserRole);
  const userVerified = useSelector(selectUserVerified);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const ref = doc(db, 'problems', problemId);
        const res = await getDoc(ref);
        if (res.exists()) {
          setData(res.data());
        } else {
          navigate('/404');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (!loading && data) {
      if (data.access === 'სატესტო' && !(userRole === 'teacher' && userVerified)) {
        navigate('/405');
      }
    }
  }, [loading, data, userRole, userVerified, navigate]);
  
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
            <TextareaAutosize 
              type='text'
              value={data.statement}
              readOnly
            />
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