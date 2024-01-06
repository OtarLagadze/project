import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import './Posts.scss'
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const PostCard = ({props}) => {
  return (
    <Link to={`/posts/${props.postId}`} className='postsCard'>
      <div className='postsPostImage'>
        <img src={props.postImage} alt='postImage'/>
      </div>
      <div className='postsPostName'>
        <p>{props.postName}</p>
      </div>
    </Link>
  )
}

function Posts() {
  let { pageId } = useParams();
  pageId = parseInt(pageId);

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async() => {
      try {
        //get posts
        const ref = collection(db, `postPages/${pageId}/postCards`);
        const res = await getDocs(query(ref, orderBy('date', 'asc')));

        const obj = res.docs.map((doc) => {
          const val = doc.data();
          return {
            postId: val.id,
            postName: val.name,
            postImage: val.image
          }
        })

        setData(obj);

        //get pageCount
        setPageCount((await getDocs(collection(db, 'postPages'))).size);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [pageId])
  return (
    <>
      {
        !loading && (
        <div className='postsContainer'>
          <div className='postsHOLDER'>
            {
              data.map((data, ind) => {
                return (
                  <PostCard props={data} key={ind}/>
                )
              })
            }
          </div>
          <div className='postsJumpersHolder'>
            <Link to={`/posts/page/${Math.max(1, pageId - 1)}`} className='postsJumper'>&lt;</Link>
            <Link to={`/posts/page/${Math.min(pageCount, pageId + 1)}`} className='postsJumper'>&gt;</Link>
          </div>
        </div>)
      }
    </>
  )
}

export default Posts