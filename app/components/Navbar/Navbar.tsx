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
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`);
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
        <div className='w-full h-[100px] flex justify-center items-center px-4 mt-6 fixed top-0 z-50'>
            <div className="w-full max-w-7xl h-[85px] glass-card rounded-full flex justify-between items-center px-6 md:px-10 transition-all duration-500 hover:shadow-2xl hover:shadow-green-200/40 premium-shadow">
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => router.push('/settings')}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg shadow-green-300/50 group-hover:scale-110 transition-transform duration-300">
                        {(name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="text-foreground font-bold text-base md:text-xl tracking-tight group-hover:text-primary transition-colors duration-300 truncate max-w-[100px] md:max-w-none">
                        {name || 'User'}
                    </div>
                </div>
                <div className="hidden md:flex space-x-10 text-foreground text-sm font-semibold tracking-wide">
                    <button onClick={() => router.push('/dashboard')} className='hover:text-primary hover:scale-110 transition-all duration-300 relative group'>
                        Dashboard
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </button>
                    <button onClick={() => router.push('/completed')} className='hover:text-primary hover:scale-110 transition-all duration-300 relative group'>
                        Completed
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </button>
                    <button onClick={() => router.push('/settings')} className='hover:text-primary hover:scale-110 transition-all duration-300 relative group'>
                        Settings
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </button>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-red-50 transition-all duration-300 group cursor-pointer" onClick={handleLogout}>
                    <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        className='w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-destructive group-hover:scale-110 transition-all duration-300'
                    >
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M21.593 10.943c.584.585.584 1.53 0 2.116L18.71 15.95c-.39.39-1.03.39-1.42 0a.996.996 0 010-1.41 9.552 9.552 0 011.689-1.345l.387-.242-.207-.206a10 10 0 01-2.24.254H8.998a1 1 0 110-2h7.921a10 10 0 012.24.254l.207-.206-.386-.241a9.562 9.562 0 01-1.69-1.348.996.996 0 010-1.41c.39-.39 1.03-.39 1.42 0l2.883 2.893zM14 16a1 1 0 00-1 1v1.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v1.505a1 1 0 102 0V5.5A2.5 2.5 0 0012.5 3h-7A2.5 2.5 0 003 5.5v13A2.5 2.5 0 005.5 21h7a2.5 2.5 0 002.5-2.5V17a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Navbar