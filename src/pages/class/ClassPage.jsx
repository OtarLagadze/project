// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router'
// import './classPage.scss'
// import { Link } from 'react-router-dom';
// import { db } from '@src/firebaseInit';
// import { collection, getDocs } from 'firebase/firestore';
// import { useSelector } from 'react-redux';
// import { selectUserRole } from '@features/userSlice';

// const Topic = ({data}) => {
//     return (
//         <div className='cpageTopic'>
//             <h1>{data.name}</h1>
//             <div>
//                 {
//                     data.comment
//                 }
//             </div>
//             {
//                 data.links.map((link, ind) => {
//                     return (
//                         <div className='cpageLink' key={ind}>
//                             <a href={link} target='_blank' key={ind}>{link}</a>
//                         </div>
//                     )
//                 })

//             }
//             {
//                 data.problems.map((problem, ind) => {
//                     return (
//                         <Link key={ind} to={`/problemset/problem/${problem}`} className='cpageProblem'>
//                             {problem}
//                         </Link>
//                     )
//                 })
//             }
//         </div>
//     )
// }

// function ClassPage() {
//   const params = useParams();
//   const [data, setData] = useState([]);
//   const userRole = useSelector(selectUserRole);
//   useEffect(() => {
//     const fetch = async () => {
//         try {
//             const ref = collection(db, `classGroups/${params.classId}/subjects/${params.subject}/topics`);
//             const res = await getDocs(ref);
//             setData(res.docs.map(doc => ({
//                 name: doc.id,
//                 links: doc.data().links,
//                 problems: doc.data().problems,
//                 comment: doc.data().comments
//             })));
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     fetch();
//   }, [params])

//   return (
//     <div className='cpageContainer'>
//         { userRole === 'teacher' && 
//             <Link to={`/addTopic/${params.classId}/${params.subject}`}>დამატება</Link>
//         }
//         <div className="cpageHeader">
//             <h1>{params.subject}</h1>
//         </div>
//         {
//             data.map((data, ind) => {
//                 return <Topic data={data} key={ind} />
//             })
//         }
//     </div>
//   )
// }

// export default ClassPage