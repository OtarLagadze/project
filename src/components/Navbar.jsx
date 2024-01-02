import React from 'react'
import NavElement from './NavElement'
import ProfileLink from './ProfileLink'
import './Navbar.scss'

function Navbar() {
  const data = [
    {dir: "/", name: "მთავარი", icon: "home"},
    {dir: "/posts/page/1", name: "პოსტები", icon: "earth"},
    {dir: "/contests", name: "კონტესტები", icon: "medal"},
    {dir: "/class", name: "კლასი", icon: "team"},
    {dir: "/problemset", name: "ამოცანები", icon: "gym"},
    {dir: "/sports", name: "სპორტი", icon: "sports"},
    {dir: "/chat", name: "ჩატი", icon: "chat"},
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