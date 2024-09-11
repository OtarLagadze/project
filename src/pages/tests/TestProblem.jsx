import React, { useEffect, useRef, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import Workplace from '@components/workplace/Workplace';

function TestProblem({ problemId, numero, setMessages }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState(null);

  useEffect(() => {
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
    <> { !loading &&
      <>
        <div className='problemContainer'>
          <div className="problemHeader">
            <h1>დავალება {numero}</h1>
          </div>
          <div>
            მაქსიმალური ქულა: {data.point * data.workplaceData.coefficient}
          </div>
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
          }} fromTest={true}/>
        </div>
      </>
    }
    </>
  )
}

export default TestProblem
