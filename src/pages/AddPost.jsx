import React, { useEffect, useState } from 'react'
import './AddPost.scss'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUserName, selectUserPhotoUrl } from '../features/userSlice';

function AddPost() {
  const userName = useSelector(selectUserName);
  const userImage = useSelector(selectUserPhotoUrl);

  const [postName, setPostName] = useState('');
  const [postText, setPostText] = useState('');
  const [postPhoto, setPostPhoto] = useState('');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const storedPostName = localStorage.getItem('postName');
    const storedPostText = localStorage.getItem('postText');
    const storedPhotos = localStorage.getItem('photos');

    if (storedPostName) setPostName(storedPostName);
    if (storedPostText) setPostText(storedPostText);
    if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
  }, []);

  useEffect(() => {
    localStorage.setItem('postName', postName);
    localStorage.setItem('postText', postText);
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [postName, postText, photos]);

  const addPhoto = () => {
    setPhotos([postPhoto, ...photos]);
    setPostPhoto('');
  }

  const submit = async () => {
    try {
      const obj = {
        author: userName,
        authorImage: userImage,
        name: postName,
        postPhotos: photos,
        postText: postText
      }
      const ref = collection(db, 'postRequests');
      await addDoc(ref, obj);
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.setItem('postName', '');
      localStorage.setItem('postText', '');
      localStorage.setItem('photos', JSON.stringify([]));
      setPostName('');
      setPostText('');
      setPhotos([]);
    }
  }

  return (
    <div className='addPostContainer'>
      <input 
        type='text'
        value={postName}
        onChange={(e) => setPostName(e.target.value)}
        maxLength={50}
        placeholder='პოსტსის სათაური'
        required
      />
      <textarea 
        type='text'
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        maxLength={2000}
        placeholder='ტექსტი'
        required
      />
      <div className='addPostRow'>
        <input 
          type='text'
          value={postPhoto}
          onChange={(e) => setPostPhoto(e.target.value)}
          placeholder='ფოტოს მისამართი'
        />
        <button onClick={() => addPhoto()}>დამატება</button>
      </div>
      <div className="postPhotoHolder">
          {
            photos.map((data, ind) => {
              return (
                <img className='postScrollImg' alt='photo' src={data} key={ind} onClick={() => {
                  setPhotos(photos => photos.filter(img => img !== data));
                }}/>
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

export default AddPost
