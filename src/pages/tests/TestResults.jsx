import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { db } from '@src/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import { selectUserName } from '@features/userSlice';
import TestProblem from './TestProblem';
import ProblemReply from '@components/problemReply/ProblemReply';
import './testResults.scss'

function TestResults() {
  const { subject } = useParams(); 
  const userName = useSelector(selectUserName); 
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const userDocRef = doc(db, 'userTestRecords', userName);
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

  const { test, messages, maxPoint, usersPoint } = subjectData;

  return (
    <div>
      <div className='problemContainer' id='finalPoints'>
        <h1>თქვენ აიღეთ {usersPoint} ქულა {maxPoint}-დან</h1>
        <h2>ეს არის ტესტის პირველი ნაწილის შეფასება. ამ ქულას დაემატება ფურცელზე დაწერილი ტესტის ქულები. ქვემოთ იხილავთ თქვენი ვარიანტის ამოცანებს და თქვენს მიერ ატვირთულ პასუხებს. პასუხები შესწორებულია კომპიუტერის მიერ. მწვანე ნიშნავს სწორს, წითელი არასწორს. შეკითხვების შემთხვევაში მოგვწერეთ ფეისბუკზე: Neo School. დაიმახსოვრეთ კოდი და შეძლებთ საიტზე სახლიდანაც შეხვიდეთ და გადახედოთ თქვენს ნაშრომს. საიტის ლინკი იქნება ჩვენს ფეისბუკზე.</h2>
      </div>
      {test.map((testItem, index) => {
        const message = messages.find(msg => msg.problemNumero === index + 1);
        return (
          <div key={index} className="resultSection">
            <TestProblem problemId={testItem.exerciseId} numero={index + 1}/>
            <div className='problemContainer'>
              {message.message && (
                  <ProblemReply replyData={message.message}/>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TestResults;
