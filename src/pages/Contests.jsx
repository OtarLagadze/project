import React from 'react'
import './Contests.scss'
import { useSelector } from 'react-redux';
import { selectUserRole } from '../features/userSlice';
import { Link } from 'react-router-dom';

function Contests() {
  const userRole = useSelector(selectUserRole);

  return (
    <div className='consWrapper'>
      { userRole === 'teacher' && 
        <div className='postsAddPost'>
          <Link to='/addTest'>ტესტის დამატება</Link>
        </div>
      }
    </div>
  )
}

export default Contests