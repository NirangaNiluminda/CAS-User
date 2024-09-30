'use client'

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import axios from 'axios';

const Navbar = () => {

    const router = useRouter();

    const { user } = useUser();
    // console.log(user);
    const [apiUrl, setApiUrl] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if(typeof window !== 'undefined') {
            setName(sessionStorage.getItem('name') || user?.name || '');
        }
    }, [user]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // This will run only on the client side
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:3000');
            } else {
                setApiUrl('http://13.228.36.212');
            }
        }
    }, []);
    const handleLogout = async () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('name');
        router.push('/signin');
        //fix below
        // try {
        //     const response = await axios.get(`${apiUrl}/api/v1/logout-user`);
        //     if (response.status === 200 || response.data.success) {

        //         router.push('/signin');
        //     }
        //     else {
        //         alert('Invalid credentials')
        //     }
        // }
        // catch (error) {
        //     console.error('Error during logout:', error);
        //     alert('An error occurred. Please try again.');
        // }
    }

    return (
        <div className='w-full h-[100px] flex justify-between items-center px-4 mt-2'>
            <div className="w-full h-[100px] border-green-500 border-2 rounded-3xl flex justify-between items-center px-4">
                <div className="w-10 h-10 cursor-pointer" onClick={() => router.push('/settings')}>{name}</div>
                <div className="flex space-x-8 text-black text-lg">
                    <button onClick={() => router.push('/dashboard')} className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'>Dashboard</button>
                    <button onClick={() => router.push('/completed')} className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'>Completed</button>
                    <button onClick={() => router.push('/settings')} className='cursor-pointer hover:transform hover:scale-110 transition-transform duration-300'>Settings</button>
                </div>
                <div className="w-10 h-10">
                    <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        onClick={handleLogout} // Add the onClick event
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