import React, { useEffect, useState } from 'react'
import './AddProblem.scss'
import './AddPost.scss'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseInit';
import { useSelector } from 'react-redux';
import { selectUserName } from '@features/userSlice';
import CreateProblem from '@components/problemCreator/CreateProblem';
import { validateImage } from '@features/validators/imageValidator';
import { v4 as uuidv4 } from 'uuid';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { MathJax } from 'better-react-mathjax';

function AddProblem() {
  const userName = useSelector(selectUserName);

  const subjects = ['მათემატიკა', 'ქართული', 'ინგლისური', 'ისტორია',
  'გეოგრაფია', 'ფიზიკა', 'ქიმია', 'ბიოლოგია', 'ხელოვნება',
  'მუსიკა', 'მოქალაქეობა', 'რუსული'];
  const problemTypes = ['ვარიანტების არჩევა', 'შესაბამისობა', 'დალაგება', 'რიცხვის ჩაწერა', 'ფოტოს ამოცნობა', 'გამოტოვებული სიტყვები', 'ტექსტური'];
  const [problemPhoto, setProblemPhoto] = useState('');
  const template = {
    // id: 0,
    author: userName,
    // date: '',
    name: '',
    subject: subjects[0],
    grade: "7",
    difficulty: "1",
    statement: '',
    photos: [],
    type: problemTypes[0],
    point: "1",
    // workplaceData: {
    //   coefficient: 0,
    //   display: [],
    //   answer: [],
    // },
    access: 'სატესტო',
  }
  const savedData = localStorage.getItem('AddProblemFormData');
  const [formData, setFormData] = useState((savedData ? JSON.parse(savedData) : template))

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('AddProblemFormData'));
    if (savedData) {
      setFormData(savedData);
    } else {
      localStorage.setItem('AddProblemFormData', JSON.stringify(formData));
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('AddProblemFormData', JSON.stringify(formData));
    console.log(formData);
  }, [formData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { valid, errorMessage } = validateImage(file);
    if (!valid) {
      alert(errorMessage);
      return;
    }
    try {
      const fileName = `${file.name}_${uuidv4()}`;
      
      const storage = getStorage();
      const fileRef = `images/problems/${fileName}`;
      const storageRef = ref(storage, fileRef)
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const obj = {
        src: downloadURL,
        ref: fileRef
      }

      setFormData({
        ...formData,
        photos: [...formData.photos, obj]
      })
    } catch (err) {
      console.error("error uploading file: ", err);
    }
  }

  const handlePhotoRemove = async (fileRef) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, fileRef);
  
      await deleteObject(imageRef);
    } catch (err) {
      console.error("Error deleting file: ", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name === '' || (formData.type !== 'ტექსტური' && (!formData.workplaceData || formData.workplaceData.coefficient === 0))) {
      alert('გთხოვთ შეავსოთ ყველა საჭირო ველი');
      return;
    }
    
    let num = 1;
    try {
      num = (await getDoc(doc(db, 'problems', 'countDoc'))).data().count;
    } finally {
      try {
        const obj = {
          ...formData,
          point: parseInt(formData.point),
          grade: parseInt(formData.grade),
          difficulty: parseInt(formData.difficulty),
          problemId: num + 1,
          date: serverTimestamp()
        }
        const ref = doc(db, 'problems', `${num + 1}`);
        await setDoc(ref, obj); 

        const cntRef = doc(db, 'problems', 'countDoc');
        await updateDoc(cntRef, {count: num + 1});
      } catch (err) {
        console.log(err);
      } finally {
        localStorage.removeItem('AddProblemFormData');
        alert('ამოცანა დამატებულია');
        window.location.reload();
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className='addPostContainer'>
      <div>
        <select name='subject' onChange={handleChange} value={formData.subject}>
          {
            subjects.map((subject, ind) => {
              return (
                <option value={subject} key={ind}>{subject}</option>
              )
            })
          }
        </select>
        <select name='grade' onChange={handleChange} value={formData.grade}>
          {
            [7, 8, 9, 10, 11, 12].map((grade, ind) => {
              return (
                <option value={grade} key={ind}>{grade}</option>
              )
            })
          }
        </select>
        <select name='difficulty' onChange={handleChange} value={formData.difficulty}>
          {
            [1, 2, 3].map((diff, ind) => {
              return (
                <option value={diff} key={ind}>{
                  diff === 1 ? 'ადვილი' : diff == 2 ? 'საშუალო' : 'რთული'
                }</option>
              )
            })
          }
        </select>
        <select name='access' onChange={handleChange} value={formData.access}>
          {
            ['საჯარო', 'სატესტო'].map((diff, ind) => {
              return (
                <option value={diff} key={ind}>{
                  diff
                }</option>
              )
            })
          }
        </select>
      </div>
      <input 
        type='text'
        name='name'
        value={formData.name}
        onChange={handleChange}
        maxLength={30}
        placeholder='ამოცანის სახელი'
        required
      />
      <textarea 
        type='text'
        name='statement'
        value={formData.statement}
        onChange={handleChange}
        maxLength={2000}
        placeholder='ამოცანის პირობა'
      />
      <div className='addPostRow'>
        <label className='custom-file-upload'>
          <input 
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
          ფოტოს ატვირთვა
        </label>
      </div>
      <div className="postPhotoHolder">
          {
            formData.photos.map((data, ind) => {
              return (
                <img className='postScrollImg' alt='photo' src={data.src} key={ind} onClick={() => {
                  const newPhotos = formData.photos.filter(img => img !== data);
                  setFormData({
                    ...formData,
                    photos: newPhotos
                  })
                  handlePhotoRemove(data.ref);
                }}/>
              )
            })
          }
      </div>

      <div>
        ამოცანის ტიპი: 
        <select name='type' onChange={(e) => {
          const { workplaceData, ...restForm } = formData;
          setFormData(restForm);
          localStorage.setItem('AddProblemFormData', JSON.stringify(restForm));
          handleChange(e);
        }} value={formData.type}>
          {
            problemTypes.map((val, ind) => {
              return (
                <option value={val} key={ind}>{val}</option>
              )
            })
          }
        </select>
      </div>  
      
      <CreateProblem setFormData={setFormData} type={formData.type}/>
      
      { (formData && formData.workplaceData && formData.workplaceData.coefficient) ?
        <>
          <div>
            ქულა თითო სწორი პასუხისთვის: 
            <select name='point' onChange={handleChange} value={formData.point}>
              {
                [1, 2, 3].map((val, ind) => {
                  return (
                    <option value={val} key={ind}>{val}</option>
                  )
                })
              }
            </select>
          </div>
          <div>
              მაქსიმალური ჯამური ქულა = {formData.workplaceData.coefficient} * {formData.point} = {formData.workplaceData.coefficient * formData.point}
          </div>
        </> : <></>
      }
      <div className='problemSubmit addPostSubmit'>
          <button type='submit'>დადასტურება</button>
      </div>
    </form>
  )
}

export default AddProblem