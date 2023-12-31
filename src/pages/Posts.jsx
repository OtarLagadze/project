import React from 'react'
import './Posts.scss'
import { Link } from 'react-router-dom';

const PostCard = (props) => {
  return (
    <Link to={`/posts/${props.postId}`} className='postsCard'>
      <div className='postsPostImage'>
        <img src={"//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg"} alt='photo of the year'/>
      </div>
      <div className='postsPostName'>
        <p>{props.postName}</p>
      </div>
    </Link>
  )
}

function Posts() {
  const rows = ["მთავარი", "პროექტები", "სპორტი"];
  const data = ["მოგესალმებით, დღეს გაიმართება da dasdfas sdf sdf assd asdf asdf asdf asdf asfd asdf asdf asdf asdf", 
  "ჩვენს სკოლაში ახლახანს daemata axali website romelic", "ჩვენს სკოლაში ახლახანს daemata axali website romelic", "ჩვენს სკოლაში ახლახანს daemata axali website romelic", "ჩვენს სკოლაში ახლახანს daemata axali website romelic", "ჩვენს სკოლაში ახლახანს daemata axali website romelic"];
  return (
    <div className='postsContainer'>
        {
          rows.map((rowName, ind) => {
            return (
              <div key={ind} className='postsRow'>
                <h1>{rowName}</h1>
                <div className='postsScroll'>
                  <div className='postsHOLDER'>
                    {
                      data.map((name, ind) => {
                        return (
                          <PostCard postName={name} postId={ind} key={ind}/>
                        )
                      })
                    }
                    <div className="postsToAll">
                      <Link to={`/posts/all`}>...</Link>
                    </div>
                  </div>
                </div>
              </div> 
            )
          })
        }
    </div>
  )
}

export default Posts