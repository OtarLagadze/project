import React from 'react'
import NavElement from './NavElement'
import ProfileLink from './ProfileLink'
import './Navbar.scss'

function Navbar() {
  const data = [
    // {dir: "/", name: "მთავარი", icon: "home"},
    {dir: "/tests/1", name: "პოსტები", icon: "earth"},
    {dir: "/tests/1", name: "ტესტები", icon: "medal"},
    {dir: "/tests/1", name: "კლასი", icon: "team"},
    {dir: "/tests/1", name: "ამოცანები", icon: "gym"},
    {dir: "/tests/1", name: "სპორტი", icon: "sports"},
    {dir: "/tests/1", name: "ჩატი", icon: "chat"},
    // {dir: "/profile", name: "პროფილი", icon: "medal"},
  ]

  return (
    <nav className='navbar'>
        <div>
            {
              data.map((props, ind) => {
                return <NavElement {...props} key={ind} />
              })
            }
            <ProfileLink />
        </div>
    </nav>
  )
}

export default Navbar