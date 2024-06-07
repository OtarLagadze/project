import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useParams } from 'react-router'
import { selectUserName } from '../features/userSlice'

function PrivateRoute({ url }) {
  const userName = useSelector(selectUserName);

  return (
    userName ? <Outlet /> : <Navigate to={url} />
  )
}

export default PrivateRoute
