'use client'

import { useRouter } from 'next/navigation'
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';


const Settings: React.FC = () => {
    const router = useRouter();

    const handleUpdate = () => {

    };

    return (
        <div className="w-full h-screen flex flex-col items-center pt-28 pb-6 px-4 overflow-hidden">
            <Navbar />
            
            {/* Profile Section */}
            <div className="w-full max-w-2xl overflow-y-auto scrollbar-hide">
                <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center gap-6 premium-shadow">
                    <div className="text-center">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">Profile Settings</h1>
                        <p className="text-muted-foreground text-sm font-medium">Manage your account information</p>
                    </div>
                    
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 shadow-xl premium-shadow hover:scale-105 transition-all duration-500 group">
                        <Image className="object-cover group-hover:scale-110 transition-transform duration-700" src="/profile.jpg" alt='profile image' fill />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-green-200/30 rounded-full" />
                    </div>
                    
                    <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
                        <div className="text-foreground text-lg font-bold">EG/XXXX/XXXX</div>
                    </div>
                    
                    {/* Editable Fields */}
                    <div className="w-full max-w-md space-y-4">
                        <div className="relative group">
                            <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 pr-12 input-premium text-foreground placeholder:text-muted-foreground font-medium" 
                                placeholder="PERERA A. B. C" 
                            />
                            <button className="absolute right-3 top-[30px] text-muted-foreground hover:text-primary transition-colors duration-300">
                                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                                    />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="relative group">
                            <label className="text-xs font-semibold text-foreground mb-1 block">Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 pr-12 input-premium text-foreground placeholder:text-muted-foreground font-medium" 
                                placeholder="••••••••" 
                            />
                            <button className="absolute right-3 top-[30px] text-muted-foreground hover:text-primary transition-colors duration-300">
                                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Update Button */}
                    <button
                        type="button"
                        className="w-full max-w-md py-3 px-8 gradient-green text-white font-bold text-base rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                        onClick={() => router.push('/dashboard')}
                    >
                        <span className="relative z-10">Update Profile</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
