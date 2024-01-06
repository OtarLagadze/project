import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import './PostsPost.scss'
import { useSelector } from 'react-redux';
import { selectUserId, selectUserName, selectUserPhotoUrl } from '../features/userSlice';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';


function PostsPost() {
    const { postId } = useParams();
    const userName = useSelector(selectUserName);
    const userId = useSelector(selectUserId);
    const userImage = useSelector(selectUserPhotoUrl);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [comments, setComments] = useState([]);
    const [addComment, setAddComment] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const ref = doc(db, 'posts', postId);
                const res = await getDoc(ref);

                setData(res.data());

                const comsRef = collection(db, `posts/${postId}/comments`);
                const coms = await getDocs(query(comsRef, orderBy('date', 'desc')));
        
                const obj = coms.docs.map((doc) => {
                  const val = doc.data();
                  return {
                    name: val.name,
                    comment: val.comment,
                    date: val.date,
                    image: val.image,
                    authorId: val.authorId,
                    postId: doc.id
                  }
                })
        
                setComments(obj);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        
        fetch();
    }, [postId])

    const handleAddComment = async () => {
        if (addComment === '') return;
        try {
            const obj = {
                name: userName,
                comment: addComment,
                date: serverTimestamp(),
                image: userImage,
                authorId: userId
            };

            const ref = collection(db, `posts/${postId}/comments`);
            const docRef = await addDoc(ref, obj);

            obj.postId = docRef.id;
            setComments([obj, ...comments]);

            setAddComment('');
        } catch (err) {
            console.log(err);
        }
    }

    const deleteComment = async (docId) => {
        try {
            const ref = doc(db, `posts/${postId}/comments`, docId);
            setComments(prevComments => prevComments.filter(comment => comment.postId !== docId));
            await deleteDoc(ref);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <> { !loading &&
            <div className='postContainer'>
                <div className="postHeader">
                    <div className="postHeaderImg">
                        <img src={data.authorImage} alt='photo'/>
                    </div>
                    <div className="postHeaderTxt">
                        <h1>{data.name}</h1>
                        <div className="postInfo">
                            <p id='postDate'>{}</p>
                            <p id='postAuthor'>{data.author}</p>
                        </div>
                    </div>
                </div>

                <p className='postTxt'>{data.postText}</p>

                <div className="postPhotoHolder">
                    {
                        data.postPhotos.map((data, ind) => {
                            return (
                                <img className='postScrollImg' alt='photo' src={data} key={ind} />
                                )
                            })
                        }
                </div>
                
                {
                    userName ? (
                        <div className="postAddComment">
                            <input 
                                type='text' 
                                placeholder='კომენტარის დატოვება'
                                value={addComment}
                                maxLength={300}
                                onChange={(e) => setAddComment(e.target.value)}
                            />
                            <button onClick={() => handleAddComment()}>ატვირთვა</button>
                        </div>
                    ) : (
                        <div className='postAddComment'>კომენტარის ასატვირთად გაიარეთ ავტორიზაცია</div>
                        )
                    }

                <div className="postComments">
                    {
                        comments.map((data, ind) => {
                            return (
                                <div className="postComment" key={ind}>
                                    <img alt='photo' src={data.image} />
                                    <div className="postCommentData">
                                        <p id='username'>{data.name}</p>
                                        <p>{data.comment}</p>
                                        <div>
                                            <p>{(new Date(data.date.seconds * 1000)).toLocaleDateString('en-GB')}</p>
                                            {userId === data.authorId &&
                                                <p className='postCommentDelete' onClick={() => deleteComment(data.postId)}>წაშლა</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div> }
        </>
    )
}

export default PostsPost