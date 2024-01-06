import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import { selectUserRole } from '../features/userSlice'

function PrivateRoute({ role, url }) {
  const userRole = useSelector(selectUserRole);
  let pass = false;

  if (userRole === role) pass = true;
  if (role === 'nonGuest' && userRole !== null) pass = true;

  return (
    pass ? <Outlet /> : <Navigate to={url} />
  )
}

export default PrivateRoute
