import React, { useEffect, useState } from 'react'
import './Problemset.scss'
import { Link, useParams } from "react-router-dom"
import { useSelector } from 'react-redux';
import { selectUserRole } from '../features/userSlice';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

function Problemset() {
  const userRole = useSelector(selectUserRole);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);
  const pageProblemCount = 20;

  let { pageId } = useParams();
  pageId = parseInt(pageId);

  useEffect(() => {
    const fetch = async() => {
      try {
        const ref = collection(db, `problems`);
        const low = (pageId - 1) * pageProblemCount;
        const high = pageId  * pageProblemCount;
        const res = await getDocs(query(ref, where('number', '>=', low), where('number', '<=', high)));
        const obj = res.docs.map((doc) => {
          const val = doc.data();
          return {
            photos: val.problemPhotos,
            statement: val.problemStatement,
            author: val.author,
            date: val.date,
            difficulty: val.difficulty,
            grade: val.grade,
            name: val.name,
            number: val.number,
            solutions: val.solutions,
            variants: val.variants,
            subject: val.subject
          }
        })

        setProblems(obj);
      } catch (err) {
        console.log(err);
      } finally {
        window.scrollTo({top: 0, behavior: 'smooth'});
        setLoading(false);
        setTotalProblems((await getDoc(doc(db, 'problems', 'countDoc'))).data().count);
      }
    }

    fetch();
  }, [pageId])

  return (
    <> { !loading &&
    <div className='wrapper'>
      <div className="list">
        <div className="header">
          <p>ყველა ამოცანა</p>
          { userRole === 'teacher' && 
            <div className='problemAddProblem'>
              <Link to='/addProblem'>ამოცანის დამატება</Link>
            </div>
          }
          <input type='text' placeholder='ნომრით ძებნა'/>
        </div>

        <div className="problems">
          <div className="problem problemsHeader" key={"header"}>
            <div className='problemChilds' id="id">№</div>
            <div className='problemChilds' id="name">ამოცანა</div>
            <div className='problemChilds' id="subject">საგანი</div>
            <div className='problemChilds' id="grade">კლასი</div>
            <div className='problemChilds' id="count"></div>
          </div>
          {
            problems.map(({difficulty, number, name, subject, grade}, ind) => {
              return (
                <Link to={`/problemset/problem/${number}`} className="problem" key={ind}>
                  <div className='problemChilds' id="difficulty"
                    style={{
                      backgroundColor: difficulty == 1 ? "#6AFE9C" : difficulty == 2 ? "#EBFF70" : "#FF725F"
                    }}
                    ></div>

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
        <Link to={`/problemset/${Math.max(1, pageId - 1)}`} className='postsJumper'>&lt;</Link>
        <Link to={`/problemset/${Math.min(Math.floor((totalProblems + pageProblemCount - 1) / pageProblemCount), pageId + 1)}`} className='postsJumper'>&gt;</Link>
      </div>
    </div> }
  </>
  )
}

export default Problemset