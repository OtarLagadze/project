import React from 'react';
import './NavElement.scss';
import './ProfileLink.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserName } from '../features/userSlice';

function ProfileLink() {
  const userName = useSelector(selectUserName);
  return (
    <Link to={"/profile"} className='navElement' id='myCard'>
        <div className="userPhotoHolder">
            <div className="userPhoto">
                <img src={'/svg/sidebar/user.svg'}/>
            </div>
        </div>
        
          <div>
              {userName ? (
                <>
                <p id='username'>{userName}</p>
                <p id='viewProfile'>პროფილის ნახვა</p>
                </>
              ) : (
                <p id='username'>ავტორიზაცია</p>
              )}
          </div>
    </Link>
  )
}

export default ProfileLink