import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useParams } from 'react-router'
import { selectUserClass_uid, selectUserClassGroups, selectUserClassId, selectUserRole } from '@features/userSlice'

function PrivateRoute({ role, url }) {
  const params = useParams();
  const userRole = useSelector(selectUserRole);
  const userClassGroups = useSelector(selectUserClassGroups);
  const userClassId = useSelector(selectUserClassId);
  const userClass_uid = useSelector(selectUserClass_uid)
  let pass = false;

  if (userRole === role) pass = true;

  if (role === 'nonGuest' && userRole !== null) pass = true;

  if (role === 'containClass') {
    if (userClass_uid === params.class_uid) pass = true;
    if (userClassGroups.some(item => item.class_uid === params.class_uid && item.subject_uid === params.subject_uid)) {
      pass = true;
    }
    if (userClassId === params.classId) pass = true;
    if (userClassGroups.some(item => item.classId === params.classId && item.subject === params.subject)) {
      pass = true;
    }
    if (userRole === 'teacher') pass = true;
  }

  return (
    pass ? <Outlet /> : <Navigate to={url} />
  )
}

export default PrivateRoute
