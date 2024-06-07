import React, { useEffect, useState } from 'react';
import './Contests.scss';
import { useDispatch, useSelector } from 'react-redux';
import ProblemsetProblem from './ProblemsetProblem';
import { selectStarted, selectTasks, selectUsedTasks, selectVerdicts, updateStarted, selectCountdown, resetCountdown, selectUserClassId, selectUserId, setVerdicts } from '../features/userSlice';
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Contests() {
  const started = useSelector(selectStarted);
  const index = useSelector(selectUsedTasks);
  const tasks = useSelector(selectTasks);
  const arr = useSelector(selectVerdicts);
  const countdown = useSelector(selectCountdown);
  const dispatch = useDispatch();
  const userClassId = useSelector(selectUserClassId);
  const userId = useSelector(selectUserId);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "testResults", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEnded(true);
          const data = docSnap.data();
          setSolved(data.solved);
          dispatch(setVerdicts(data.verdicts));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dispatch]);

  useEffect(() => {
    if (started && countdown === 0) {
      dispatch(updateStarted(false));
      dispatch(resetCountdown());
      alert("დასრულდა");
      setEnded(true);

      const trueCount = arr.filter((val) => val === true).length;
      const userData = {
        userId: userId,
        classId: userClassId,
        verdicts: arr,
        solved: trueCount,
      };

      const docRef = doc(db, "testResults", userId);
      setDoc(docRef, userData)
        .then(() => {
          console.log("Document successfully written");
        }).finally(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
  }, [countdown, started, dispatch]);

  if (loading) {
    return <div className='consWrapper'>იტვირთება...</div>
  }

  return (
    <div className='consWrapper'>
      {
        (!started && !ended) ? (
          <button className='consStart' onClick={() => dispatch(updateStarted(true))}>დაწყება</button>
        ) : (
          <div className='consWrapper'>
            <div>{!ended && countdown} {!ended && 'წამი'}</div>
            {
              (index === 20 || ended) ? (
                <div>
                  {
                    arr.map((val, ind) => (
                      <div key={ind}>
                        {ind + 1}. {(val === true ? 'სწორია' : 'არასწორია')}
                      </div>
                    ))
                  }
                  ქულა {solved} / 20
                </div>
              ) : (
                <ProblemsetProblem problemId={tasks[index]} problemInd={index + 1} />
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default Contests;
