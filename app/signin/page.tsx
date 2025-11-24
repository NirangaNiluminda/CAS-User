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
                setApiUrl( process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://52.64.209.177:4000');
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
        <div className='w-full h-screen flex justify-center items-center px-4 py-6 overflow-hidden'>
            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-green-100 text-foreground hover:bg-green-50 hover:border-green-200 transition-all duration-300 shadow-lg hover:shadow-xl z-50 group"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:-translate-x-1 transition-transform duration-300">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <div className="w-full max-w-2xl p-10 glass-card rounded-[2rem] flex flex-col justify-center items-center gap-8 animate-in fade-in zoom-in duration-700 premium-shadow">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Sign in</h1>
                    <p className="text-muted-foreground text-sm font-medium">Enter your credentials to access your account</p>
                </div>
                
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-green-100 shadow-xl premium-shadow hover:scale-105 transition-transform duration-500">
                    <Image className="object-cover" src="/SignIn.png" alt='sign in image' fill />
                    <div className="absolute inset-0 ring-1 ring-inset ring-green-200/30 rounded-full" />
                </div>

                <div className="w-full flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Index</label>
                            <input 
                                type="text" 
                                id="registrationNumber" 
                                value={formData.registrationNumber} 
                                onChange={handleChange} 
                                className="w-full px-5 py-3.5 input-premium text-foreground placeholder:text-muted-foreground font-medium" 
                                placeholder="EG/XXXX/XXXX" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className="w-full px-5 py-3.5 input-premium text-foreground placeholder:text-muted-foreground font-medium" 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                            <input 
                                id="rememberMe" 
                                type="checkbox" 
                                checked={rememberMe} 
                                onChange={(e) => setRememberMe(e.target.checked)} 
                                className="w-4 h-4 rounded border-green-300 bg-white text-primary focus:ring-primary" 
                            />
                            <label htmlFor="rememberMe" className="text-sm font-medium text-foreground cursor-pointer">Remember Me</label>
                        </div>
                        <div className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors">
                            Forgot Password?
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSignIn}
                    className="w-full py-3.5 px-8 gradient-green text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                >
                    <span className="relative z-10">Sign in</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>

                <div className="flex flex-row items-center gap-2 text-sm">
                    <div className="text-muted-foreground font-medium">Don&apos;t have an account?</div>
                    <button
                        onClick={() => router.push('/signup')}
                        className="text-primary font-bold hover:underline hover:text-emerald-700 transition-colors"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
