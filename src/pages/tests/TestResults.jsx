import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { db } from '@src/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import { selectUserId, selectUserName } from '@features/userSlice';
import TestProblem from './TestProblem';
import ProblemReply from '@components/problemReply/ProblemReply';
import './testResults.scss'

function TestResults() {
  const { subject } = useParams(); 
  const userName = useSelector(selectUserName); 
  const userId = useSelector(selectUserId);
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const userDocRef = doc(db, 'userTestRecords', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const subjectInfo = userData[subject];
          setSubjectData(subjectInfo);
        } else {
          console.warn('User document not found');
        }
      } catch (error) {
        console.error('Error fetching subject data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [subject, userName]);

  if (loading) {
    return <div className="loading">იტვირთება...</div>;
  }

  if (!subjectData) {
    return (
      <div className="problemContainer">
        <h2>მონაცემები არ მოიძებნა</h2>
      </div>
    );
  }

  const { messages, maxPoint, usersPoint } = subjectData;

  const sortedMessages = messages ? [...messages].sort((a, b) => a.problemNumero - b.problemNumero) : [];

  return (
    <div>
      <div className='problemContainer' id='finalPoints'>
        <h1>თქვენ აიღეთ {usersPoint} ქულა {maxPoint}-დან</h1>
        <h1>თქვენ {usersPoint < 10 ? 'ვერ' : ''} გადახვედით შემდეგ ტურში</h1>
        <h2>ქვემოთ იხილავთ თქვენს მიერ ატვირთულ პასუხებს, რომლებიც შესწორებულია კომპიუტერის მიერ. მწვანე ნიშნავს სწორს, ხოლო წითელი არასწორს. შეკითხვების შემთხვევაში მოგვწერეთ ფეისბუკზე: Neo School</h2>
      </div>
      {sortedMessages.map((child, index) => {
        return (
          <div key={index} className="resultSection">
            <div className='problemContainer'>
              <h1>№{child.problemNumero}</h1>
              {child?.message?.skipped === true ? 
                <h1 key={index}> ცარიელია</h1> 
                :
                <>
                  {child.message && (
                    <ProblemReply replyData={child.message}/>
                  )}
                </>
              }
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default TestResults;
