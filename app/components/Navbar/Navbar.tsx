'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {

    const router = useRouter();

    return (
        <div className='w-full h-[100px] bg-gray-300 flex justify-between items-center px-4'>
            <div className="w-full h-[100px] bg-gray-300 flex justify-between items-center px-4">
                <div className="w-10 h-10 bg-gray-400"></div> {/* Placeholder for logo */}
                <div className="flex space-x-8 text-black text-lg">
                    <button onClick={() => router.push('/dashboard')} className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'>Dashboard</button>
                    <button className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'>Completed</button>
                    <button onClick={() => router.push('/settings')} className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'>Settings</button>
                </div>
                <div className="w-10 h-10">
                    <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        onClick={() => router.push('/signin')}
                        className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'
                    >
                        <path
                            fill="#000"
                            fillRule="evenodd"
                            d="M21.593 10.943c.584.585.584 1.53 0 2.116L18.71 15.95c-.39.39-1.03.39-1.42 0a.996.996 0 010-1.41 9.552 9.552 0 011.689-1.345l.387-.242-.207-.206a10 10 0 01-2.24.254H8.998a1 1 0 110-2h7.921a10 10 0 012.24.254l.207-.206-.386-.241a9.562 9.562 0 01-1.69-1.348.996.996 0 010-1.41c.39-.39 1.03-.39 1.42 0l2.883 2.893zM14 16a1 1 0 00-1 1v1.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v1.505a1 1 0 102 0V5.5A2.5 2.5 0 0012.5 3h-7A2.5 2.5 0 003 5.5v13A2.5 2.5 0 005.5 21h7a2.5 2.5 0 002.5-2.5V17a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div> {/* Placeholder for logout */}
            </div>
        </div>
    )
}

export default Navbar