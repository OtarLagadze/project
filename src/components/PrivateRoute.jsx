import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useParams } from 'react-router'

function PrivateRoute({ role, url }) {
  let pass = true;

  // if (userRole === role) pass = true;

  // if (role === 'nonGuest' && userRole !== null) pass = true;

  // if (role === 'containClass') {
  //   if (userClassId === params.classId) pass = true;
  //   if (userClassGroups.some(item => item.classId === params.classId && item.subject === params.subject)) {
  //     pass = true;
  //   }
  // }

  return (
    pass ? <Outlet /> : <Navigate to={url} />
  )
}

export default PrivateRoute
