import React from 'react';
import './NavElement.scss';
import './ProfileLink.scss';
import { Link } from 'react-router-dom';

function ProfileLink() {
  return (
    <Link to={"/profile"} className='navElement' id='myCard'>
        <div className="userPhotoHolder">
            <div className="userPhoto">
                <img src='/svg/sidebar/user.svg'/>
            </div>
        </div>
        
        <div>
            <p id='username'>ოთარ ლაღაძე</p>
            <p id='viewProfile'>პროფილის ნახვა</p>
        </div>
    </Link>
  )
}

export default ProfileLink