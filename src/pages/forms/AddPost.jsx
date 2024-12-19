// import React, { useEffect, useState } from 'react'
// import './AddPost.scss'
// import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
// import { db } from '@src/firebaseInit';
// import { useSelector } from 'react-redux';
// import { selectUserName, selectUserPhotoUrl } from '@features/userSlice';
// import { validateImage } from '@features/validators/imageValidator';
// import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// function AddPost() {
//   const userName = useSelector(selectUserName);
//   const userImage = useSelector(selectUserPhotoUrl);

//   const [postName, setPostName] = useState('');
//   const [postText, setPostText] = useState('');
//   const [postPhoto, setPostPhoto] = useState('');
//   const [photos, setPhotos] = useState([]);

//   useEffect(() => {
//     const storedPostName = localStorage.getItem('postName');
//     const storedPostText = localStorage.getItem('postText');
//     const storedPhotos = localStorage.getItem('photos');

//     if (storedPostName) setPostName(storedPostName);
//     if (storedPostText) setPostText(storedPostText);
//     if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('postName', postName);
//     localStorage.setItem('postText', postText);
//     localStorage.setItem('photos', JSON.stringify(photos));
//   }, [postName, postText, photos]);

//   const submit = async () => {
//     if (postName === ''
//     || postText === ''
//     || photos.length === 0) {
//       alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
//       return;
//     }
//     let num = 1;
//     try {
//       num = (await getDoc(doc(db, 'posts', 'countDoc'))).data().count;
//     } finally {
//     try {
//       const obj = {
//         number: num + 1,
//         author: userName,
//         authorImage: userImage,
//         date: serverTimestamp(),
//         name: postName,
//         postPhotos: photos,
//         postText: postText
//       }
//       const ref = doc(db, 'posts', `${num + 1}`);
//       await setDoc(ref, obj); 

//       const cntRef = doc(db, 'posts', 'countDoc');
//       await updateDoc(cntRef, {count: num + 1});
//     } catch (err) {
//       console.log(err);
//     } finally {
//       localStorage.setItem('postName', '');
//       localStorage.setItem('postText', '');
//       localStorage.setItem('photos', JSON.stringify([]));
//       setPostName('');
//       setPostText('');
//       setPhotos([]);
//     }
//   }
//   }

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const { valid, errorMessage } = validateImage(file);
//     if (!valid) {
//       alert(errorMessage);
//       return;
//     }
//     try {
//       const fileName = `${file.name}_${uuidv4()}`;
//       const storage = getStorage();
//       const fileRef = `images/posts/${fileName}`;
//       const storageRef = ref(storage, fileRef)
//       await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(storageRef);
//       const obj = {
//         src: downloadURL,
//         ref: fileRef
//       }
//       setPhotos([...photos, obj]);
//     } catch (err) {
//       console.error("error uploading file: ", err);
//     }
//   }

//   const handlePhotoRemove = async (fileRef) => {
//     try {
//       const storage = getStorage();
//       const imageRef = ref(storage, fileRef);
  
//       await deleteObject(imageRef);
//     } catch (err) {
//       console.error("Error deleting file: ", err);
//     }
//   }

//   return (
//     <div className='addPostContainer'>
//       <input 
//         type='text'
//         value={postName}
//         onChange={(e) => setPostName(e.target.value)}
//         maxLength={50}
//         placeholder='პოსტსის სათაური'
//         required
//       />
//       <textarea 
//         type='text'
//         value={postText}
//         onChange={(e) => setPostText(e.target.value)}
//         maxLength={2000}
//         placeholder='ტექსტი'
//         required
//       />
//       <div className='addPostRow'>
//         <label className='custom-file-upload'>
//           <input 
//             type='file'
//             accept='image/*'
//             onChange={handleImageChange}
//           />
//           ფოტოს ატვირთვა
//         </label>
//       </div>
//       <div className="postPhotoHolder">
//           {
//             photos.map((data, ind) => {
//               return (
//                 <img className='postScrollImg' alt='photo' src={data.src} key={ind} onClick={() => {
//                   const newPhotos = photos.filter(img => img !== data);
//                   setPhotos(newPhotos);
//                   handlePhotoRemove(data.ref);
//                 }}/>
//               )
//             })
//           }
//       </div>
//       <div className='problemSubmit addPostSubmit'>
//           <button onClick={() => {submit()}}>დადასტურება</button>
//       </div>
//     </div>
//   )
// }

// export default AddPost
