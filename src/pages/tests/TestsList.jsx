import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@src/firebaseInit';

function TestsList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTests, setTotalTests] = useState(0);
  const pageProblemCount = 20;

  let { pageId } = useParams();
  pageId = parseInt(pageId);

  useEffect(() => {
    const fetch = async() => {
      try {
        const ref = collection(db, `tests`);
        const high = (await getDoc(doc(db, 'tests', 'countDoc'))).data().count - (pageId - 1) * pageProblemCount;
        const low = high - pageProblemCount + 1;
        const res = await getDocs(query(ref, orderBy('testId', 'desc'), where('testId', '>=', low), where('testId', '<=', high)));
        const obj = res.docs.map((doc) => {
          const val = doc.data();
          return {
            grade: val.grade,
            name: val.name,
            number: val.testId,
            subject: val.subject
          }
        })
        setTests(obj);
      } catch (err) {
        console.log(err);
      } finally {
        window.scrollTo({top: 0, behavior: 'smooth'});
        setLoading(false);
        setTotalTests((await getDoc(doc(db, 'tests', 'countDoc'))).data().count);
      }
    }
    fetch();
  }, [pageId])

  return (
    <> { !loading &&
    <div className='wrapper'>
      <div className="list">
        <div className="header">
          <p>ყველა ტესტი</p>
          <input type='text' placeholder='ნომრით ძებნა'/>
        </div>

        <div className="problems">
          <div className="problem problemsHeader" key={"header"}>
            <div className='problemChilds' id="id">№</div>
            <div className='problemChilds' id="name">ტესტი</div>
            <div className='problemChilds' id="subject">საგანი</div>
            <div className='problemChilds' id="grade">კლასი</div>
          </div>
          {
            tests.map(({number, name, subject, grade}, ind) => {
              return (
                <Link to={`/tests/test/${number}`} className="problem" key={ind}>
                  <div className='problemChilds' id="id">{number}</div>
                  <div className='problemChilds' id="name">{name}</div>
                  <div className='problemChilds' id="subject">{subject}</div>
                  <div className='problemChilds' id="grade">{grade}</div>
                </Link>
              )
            })
          }
        </div>
      </div>

      <div className='postsJumpersHolder'>
        <Link to={`/tests/${Math.max(1, pageId - 1)}`} className='postsJumper'>&lt;</Link>
        <Link to={`/tests/${Math.min(Math.floor((totalTests + pageProblemCount - 1) / pageProblemCount), pageId + 1)}`} className='postsJumper'>&gt;</Link>
      </div>
    </div> }
  </>
  )
}

export default TestsList
