import React from 'react'
import { useParams } from 'react-router'

function ProblemsetSubject() {
  const { subject } = useParams();
  return (
    <div>{subject}</div>
  )
}

export default ProblemsetSubject