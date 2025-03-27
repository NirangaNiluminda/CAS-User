'use client'
require("dotenv").config();
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { toast } from "sonner";


const SignIn = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        registrationNumber: '',
        password: '',
    })

    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    }

    const { setUser } = useUser();
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // This will run only on the client side
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl('http://52.64.209.177:4000');
            }
        }
    }, []);
    const handleSignIn = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/v1/login-user`, {
                registrationNumber: formData.registrationNumber,
                password: formData.password,
            })

            if (response.status === 200 || response.data.success) {
                const token = response.data.accessToken; // accesstoken
                sessionStorage.setItem('name', response.data.user.name);
                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                setUser(response.data.user)
                toast.success('Logged in successfully!');
                router.push('/dashboard');
            }
            else {
                alert('Invalid credentials')
                toast.error('Invalid credentials');
            }
        }
        catch (error) {
            // console.error('Error during sign in:', error);
            alert(`An error occurred. Please try again. ${error}`);
            toast.error('An error occurred. Please try again.');
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className="w-[830px] h-[640px] flex flex-col justify-center items-center gap-[42px]">
                <div className="self-stretch h-[25px] text-center text-black text-[32px] font-bold font-['Inter']">Sign in</div>
                <Image className="w-[273px] h-60" src="/SignIn.png" alt='sign in image' width={380} height={380} />
                <div className="self-stretch flex flex-col justify-center items-center gap-[20px]">
                    <div className="flex gap-[86px]">
                        <div className="h-[68px] relative">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Index</label>
                            <input type="text" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="EG/XXXX/XXXX" />
                        </div>
                        <div className="h-[68px] relative">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Password" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full mt-4">
                        <div className="flex items-center">
                            <input id="rememberMe" type="radio" checked={rememberMe} onChange={handleRememberMeChange} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember Me</label>
                        </div>
                        <div className="flex items-center">
                            <div className="w-[169px] h-4 text-black text-xl font-medium font-['Inter'] cursor-pointer">Forgot Password ?</div>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSignIn}
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"

                >
                    Sign in
                </button>
                <div className="flex flex-row items-center gap-2">
                    <div className="text-black text-xl font-light font-['Inter']">Don&apos;t have an account?</div>
                    <button
                        onClick={() => router.push('/signup')}
                        className="text-blue-500 hover:underline text-xl font-bold font-['Inter']"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
