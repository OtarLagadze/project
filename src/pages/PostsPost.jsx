import React from 'react'
import { useParams } from 'react-router'
import './PostsPost.scss'


function PostsPost() {
    const { postId } = useParams();
    return (
        <div>{postId}</div>
    )
}

export default PostsPost