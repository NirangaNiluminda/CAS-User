'use client'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const { id } = useParams();
    const router = useRouter();
  return (
    <div className='container mx-auto p-4 flex flex-col justify-center items-center w-full'>
        <h1 className='text-2xl md:text-3xl font-bold mb-4 mt-5'>Feedback Page</h1>
        <div className='w-full mt-10 flex flex-col items-center gap-4'>
            <label className='text-lg font-bold'>Tell us about the quiz and markings</label>
            <input type="text" className='p-2 border w-full border-black my-2 h-60 rounded-lg ' />
        </div>
        <div className='w-full mt-10 flex flex-col md:flex-row md:justify-between md:w-1/2 items-center gap-4'>
            <button className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110">Submit</button>
            <button className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110" onClick={() => router.push('/completed')}>Nah I&apos;m fine</button>
        </div>
    </div>
  )
}

export default page