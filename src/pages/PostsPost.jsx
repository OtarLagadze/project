import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import './PostsPost.scss'
import { useSelector } from 'react-redux';
import { selectUserId } from '../features/userSlice';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const comments = [
    {
        username: "მაია მორჩაძე",
        photoSrc: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t1.18169-9/27751813_2460984614127662_895729125387504333_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=be3454&_nc_ohc=KpS9vjldBVMAX_L1KlR&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfCYRixtl7TNbpj3f_zztdC8WbOhmZWea2tJGBIPMBeaAQ&oe=65BB7256",
        comment: "ჩემი ყოჩაღი და ჭკვიანი გოგო! წარმატებებით გევლოს მომავლის გზებზე. ❤❤ aaaaaaaaaaaa aaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaa"
    },
    {
        username: "მარინა რუსაძე",
        photoSrc: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/363939715_6165744476870734_3664077486566132140_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=AJdDi1fUjlMAX9r-I5M&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfBXhsn38OouPNqGmWuRrtsLU6G0s28G1vIOpFDotOB4AA&oe=6599E049",
        comment: "გილოცავ, ნინო!❤ წარმატებები!"
    }
]

function PostsPost() {
    const { postId } = useParams();
    const userId = useSelector(selectUserId);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const ref = doc(db, 'posts', postId);
                const res = await getDoc(ref);

                setData(res.data());

                const comsRef = collection(db, `posts/${postId}/comments`);
                const coms = await getDocs(query(comsRef, orderBy('date', 'asc')));
        
                const obj = coms.docs.map((doc) => {
                  const val = doc.data();
                  return {
                    name: val.name,
                    comment: val.comment,
                    date: (new Date(val.date.seconds * 1000)).toLocaleDateString('en-GB'),
                    image: val.image
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
                            <p id='postDate'>{(new Date(data.date.seconds * 1000)).toLocaleDateString('en-GB')}</p>
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
                    userId ? (
                        <div className="postAddComment">
                            <input type='text' placeholder='კომენტარის დატოვება'/>
                            <button>ატვირთვა</button>
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
                                        <p>{data.comment} {data.date}</p>
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