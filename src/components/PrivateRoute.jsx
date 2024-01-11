import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useParams } from 'react-router'
import { selectUserClassGroups, selectUserRole } from '../features/userSlice'

function PrivateRoute({ role, url }) {
  const params = useParams();
  const userRole = useSelector(selectUserRole);
  const userClassGroups = useSelector(selectUserClassGroups);
  let pass = false;

  if (userRole === role) pass = true;
  if (role === 'nonGuest' && userRole !== null) pass = true;
  if (role === 'containClass') {
    if (userRole !== 'teacher') {
      pass = false;
    } else {
      if (userClassGroups.some(item => item.classId === params.classId && item.subject === params.subject)) {
        pass = true;
      }
    }
  }

  return (
    pass ? <Outlet /> : <Navigate to={url} />
  )
}

export default PrivateRoute
