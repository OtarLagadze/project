import React, { useEffect, useState } from 'react'
import './AddProblem.scss'
import './AddPost.scss'
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import { useSelector } from 'react-redux';
import { selectUserName } from '@features/userSlice';
import { useParams } from 'react-router';
function AddTopic() {
  const params = useParams();

  const [TopicName, setTopicName] = useState('');
  const [TopicComment, setTopicComment] = useState('');
  const [Problem, setProblem] = useState('');
  const [Link, setLink] = useState('');
  const [Problems, setProblems] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const storedTopicName = localStorage.getItem('TopicName');
    const storedTopicComment = localStorage.getItem('TopicComment');
    const storedTopicProblems = localStorage.getItem('TopicProblems');
    const storedlinks = localStorage.getItem('TopicLinks');

    if (storedTopicName) setTopicName(storedTopicName);
    if (storedTopicComment) setTopicComment(storedTopicComment);
    if (storedTopicProblems) setProblems(JSON.parse(storedTopicProblems));
    if (storedlinks) setLinks(JSON.parse(storedlinks));
  }, []);

  useEffect(() => {
    localStorage.setItem('TopicName', TopicName);
    localStorage.setItem('TopicComment', TopicComment);
    localStorage.setItem('TopicProblems', JSON.stringify(Problems));
    localStorage.setItem('TopicLinks', JSON.stringify(links));
  }, [TopicName, TopicComment, Problems, links]);

  const submit = async () => {
    if (TopicName === '') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }

    try {
      const obj = {
        problems: Problems,
        comments: TopicComment,
        links: links
      }
      const ref = doc(db, `classGroups/${params.classId}/subjects/${params.subject}/topics`, `${TopicName}`);
      await setDoc(ref, obj); 
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.setItem('TopicName', '');
      localStorage.setItem('TopicComment', '');
      localStorage.setItem('TopicProblems', JSON.stringify([]));
      localStorage.setItem('TopicLinks', JSON.stringify([]));

      setTopicName('');
      setTopicComment('');
      setProblems([]);
      setLinks([]);
    }
  }

  return (
    <div className='addPostContainer'>
      <input 
        type='text'
        value={TopicName}
        onChange={(e) => setTopicName(e.target.value)}
        maxLength={50}
        placeholder='თემის სათაური'
      />
      <textarea 
        type='text'
        value={TopicComment}
        onChange={(e) => setTopicComment(e.target.value)}
        maxLength={2000}
        placeholder='კომენტარის დატოვება'
      />
      <div className='addPostRow'>
        <input 
          type='text'
          value={Problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder='ამოცანის დამატება'
        />
        <button onClick={() => {
          setProblems([Problem, ...Problems]);
          setProblem('');
        }}>დამატება</button>
      </div>  
      <div className="addProblemHolder">
        {
          Problems.map((Problem, ind) => {
            return (
              <div key={ind} className='addProblemVariant' onClick={() => {
                setProblems(Problems => Problems.filter(curr => Problem !== curr));
              }}>{Problem}</div>
            )
          })
        }
      </div>

      <div className='addPostRow'>
        <input 
          type='text'
          value={Link}
          onChange={(e) => setLink(e.target.value)}
          placeholder='ბმულის დამატება'
        />
        <button onClick={() => {
          setLinks([Link, ...links]);
          setLink('');
        }}>დამატება</button>
      </div>
      <div className='addProblemHolder'>
        {
          links.map((Link, ind) => {
            return (
              <div key={ind} className='addProblemVariant'
              onClick={() => {
                setLinks(links => links.filter(curr => Link !== curr));
              }}>{Link}</div>
            )
          })
        }
      </div>
      <div className='problemSubmit addPostSubmit'>
          <button onClick={() => {submit()}}>დადასტურება</button>
      </div>
    </div>
  )
}

export default AddTopic
