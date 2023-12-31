import React from 'react'
import { useParams } from 'react-router'

function ProblemsetProblem() {
  const { problemId } = useParams();

  return (
    <div>{problemId}</div>
  )
}

export default ProblemsetProblem