import React from 'react'
import { Link } from "react-router-dom"
import './Class.scss'
import { useSelector } from 'react-redux';
import { selectUserRole } from '../features/userSlice';

function Class() {
  const userRole = useSelector(selectUserRole);
  const data = ["მათემატიკა", "ქართული", "ინგლისური", "ისტორია", "გეოგრაფია", "ფიზიკა", "ქიმია", "ბიოლოგია", "ხელოვნება", "მუსიკა", "მოქალაქეობა", "რუსული"];
  const classId = 1;

  return (
    <div className='classWrapper'>
      <div className="subjects">
        {
          data.map((name, ind) => {
            return (
              <Link to={`/class/${classId}/${name}`} className="subject" key={ind}>
                {name}
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default Class