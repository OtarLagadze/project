import React from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import './Posts.scss'

const PostCard = (props) => {
  return (
    <Link to={`/posts/${props.postId}`} className='postsCard'>
      <div className='postsPostImage'>
        <img src={"//www.kings.ge/storage/news/UeXCs7CtJZZ6LBCfLKZwp4YV88Ei8VRqf40Fjw28.png"} alt='photo of the year'/>
      </div>
      <div className='postsPostName'>
        <p>{props.postName}</p>
      </div>
    </Link>
  )
}

function Posts() {
  const data = ["მოგესალმებით, დღეს გაიმართება da dasdfas sdf sdf assd asdf asdf asdf asdf asfd asdf asdf asdf asdf", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic",
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic",
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", 
  "ახალი ოლიმპიადა!", 
  "წლიური შეჯიბრების შედეგები ცნობილია",];
  const pageCount = 5;
  let { pageId } = useParams();
  pageId = parseInt(pageId);
  return (
    <div className='postsContainer'>
      <div className='postsHOLDER'>
        {
          data.map((name, ind) => {
            return (
              <PostCard postName={name} postId={ind} key={ind}/>
            )
          })
        }
      </div>
      <div className='postsJumpersHolder'>
        <Link to={`/posts/page/${Math.max(1, pageId - 1)}`} className='postsJumper'>&lt;</Link>
        <Link to={`/posts/page/${Math.min(pageCount, pageId + 1)}`} className='postsJumper'>&gt;</Link>
      </div>
    </div>
  )
}

export default Posts