'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const {id} = useParams();
  return (
    <div>
      <h1>Correct Answers</h1>
      <p>for {id}</p>
    </div>
  )
}

export default page