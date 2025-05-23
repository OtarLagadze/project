import React, { useEffect, useRef, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import Workplace from '@components/workplace/Workplace';
import TextareaAutosize from 'react-textarea-autosize';

function TestProblem({ problemId, numero, setMessages }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState({skipped: true});

  useEffect(() => {
    if (!setMessages) return;
    setMessages((prevData) => {
      const newMessages = prevData.filter(child => child.problemNumero !== numero);
      return [
        ...newMessages,
        {
          problemNumero: numero,
          message: replyData
        }
      ]
    })
    // console.log(replyData);
  }, [replyData]);

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
    <> { (!loading && data) &&
      <>
        <div className='problemContainer'>
          <div className="problemHeader">
            <h1>დავალება {numero}</h1>
          </div>
          <div>
            მაქსიმალური ქულა: {data.point * data.workplaceData.coefficient}
          </div>
          <div className="problemStatement">
          <TextareaAutosize 
              type='text'
              value={data.statement}
              readOnly
            />
            <div className='problemsetPhotoHolder'>
              {
                data.photos.map((obj, ind) => {
                  return (
                    <img src={obj.src} key={ind} alt='img' className='problemsetImg' style={{ height: '350px', maxWidth: '100%'}}/>
                  )
                })
              }
            </div>
          </div>
          <Workplace setReplyData={setReplyData} data={{
            type: data.type,
            WpData: {...data.workplaceData, point: data.point, maxPoint: data.point * data.workplaceData.coefficient}
          }} fromTest={true}/>
        </div>
      </>
    }
    </>
  )
}

export default TestProblem
