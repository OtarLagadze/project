import React from 'react'
import './NavElement.scss'
import { Link } from "react-router-dom"

function NavElement({dir, name, icon}) {
  return (
    <Link to={`${dir}`} className='navElement'>
        <img src={`/svg/sidebar/${icon}.svg`} className='icon'/>
        <p>{name}</p>
    </Link> 
  )
}

export default NavElement