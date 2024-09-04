import React from 'react'
import NavElement from './NavElement'
import ProfileLink from './ProfileLink'
import './Navbar.scss'

function Navbar() {
  const data = [
    // {dir: "/", name: "მთავარი", icon: "home"},
    {dir: "/", name: "პოსტები", icon: "earth"},
    {dir: "/", name: "ტესტები", icon: "medal"},
    {dir: "/", name: "კლასი", icon: "team"},
    {dir: "/", name: "ამოცანები", icon: "gym"},
    {dir: "/", name: "სპორტი", icon: "sports"},
    {dir: "/", name: "ჩატი", icon: "chat"},
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