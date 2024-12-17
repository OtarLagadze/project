import { db } from '@src/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

function TestInstruction({ instructionId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const ref = doc(db, 'problems', instructionId);
        const res = await getDoc(ref);
        setData(res.data());
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
        
    fetch();
  }, [instructionId]);

  return (
    <div className='problemContainer'>
      <div className="problemStatement">
        <div className='postPhotoHolder' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          { data.photos && 
            data.photos.map((obj, ind) => {
              return (
                <img src={obj.src} key={ind} alt='img' className='postScrollImg'/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default TestInstruction
