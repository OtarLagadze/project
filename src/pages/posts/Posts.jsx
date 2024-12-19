// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
// import { useParams } from 'react-router'
// import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
// import { db } from '@src/firebaseInit';
// import { useSelector } from 'react-redux';
// import { selectUserRole } from '@features/userSlice';
// import './Posts.scss'

// const PostCard = ({props}) => {
//   return (
//     <Link to={`/posts/${props.postId}`} className='postsCard'>
//       <div className='postsPostImage'>
//         <img src={props.postImage} alt='postImage'/>
//       </div>
//       <div className='postsPostName'>
//         <p>{props.postName}</p>
//       </div>
//     </Link>
//   )
// }

// function Posts() {
//   let { pageId } = useParams();
//   pageId = parseInt(pageId);

//   const userRole = useSelector(selectUserRole);
//   const [data, setData] = useState([]);
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const pageCount = 10;

//   useEffect(() => {
//     const fetch = async() => {
//       try {
//         const ref = collection(db, `posts`);
//         const high = (await getDoc(doc(db, 'posts', 'countDoc'))).data().count - (pageId - 1) * pageCount;
//         const low = high - pageCount + 1;
//         const res = await getDocs(query(ref, orderBy('number', 'desc'), where('number', '>=', low), where('number', '<=', high)));

//         const obj = res.docs.map((doc) => {
//           const val = doc.data();
//           const img = val.postPhotos;
//           // console.log(img[0]);
//           return {
//             postId: doc.id,
//             postName: val.name,
//             postImage: (img[0] ? img[0].src : "")
//           }
//         })

//         setData(obj);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         window.scrollTo({top: 0, behavior: 'smooth'});
//         setLoading(false);
//         setTotalPosts((await getDoc(doc(db, 'posts', 'countDoc'))).data().count);
//       }
//     }
//     fetch();
//   }, [pageId])
  
//   return (
//     <>
//       {
//         !loading && (
//         <div className='postsContainer'>
//           { userRole === 'teacher' && 
//             <div className='postsAddPost'>
//               <Link to='/addPost'>პოსტის დამატება</Link>
//             </div>
//           }
//           <div className='postsHOLDER'>
//             {
//               data.map((data, ind) => {
//                 return (
//                   <PostCard props={data} key={ind}/>
//                 )
//               })
//             }
//           </div>
//           <div className='postsJumpersHolder'>
//             <Link to={`/posts/page/${Math.max(1, pageId - 1)}`} className='postsJumper'>&lt;</Link>
//             <Link to={`/posts/page/${Math.min(Math.floor((totalPosts + pageCount - 1) / pageCount), pageId + 1)}`} className='postsJumper'>&gt;</Link>
//           </div>
//         </div>)
//       }
//     </>
//   )
// }

// export default Posts