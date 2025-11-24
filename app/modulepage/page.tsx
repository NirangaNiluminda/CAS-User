'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react';


const ModulePage: React.FC = () => {


    const router = useRouter();



    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-lg p-10 glass-card rounded-[2rem] flex flex-col justify-center items-center gap-10 animate-in fade-in zoom-in duration-700 premium-shadow">
                <div className="relative w-56 h-56 rounded-3xl overflow-hidden border-[6px] border-green-100 shadow-2xl premium-shadow hover:scale-105 transition-all duration-500 group">
                    <Image
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        src="/module.jpg"
                        alt="Module Logo"
                        fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-green-200/30 rounded-3xl" />
                </div>
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Module A B C</h2>
                    <p className="text-muted-foreground text-base font-medium">Enter the access code to continue</p>
                </div>
                
                <div className="w-full space-y-3">
                    <label className="text-sm font-semibold text-foreground">Password</label>
                    <input 
                        type="text" 
                        id="index" 
                        className="w-full px-5 py-4 input-premium text-foreground placeholder:text-muted-foreground text-center tracking-[0.5em] text-2xl font-bold" 
                        placeholder="••••" 
                        maxLength={4}
                    />
                </div>

                <button
                    type="button"
                    className="w-full py-4 px-8 gradient-green text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                    onClick={() => router.push('/guidelines')}
                >
                    <span className="relative z-10">Enter Module</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
            </div>
        </div>
    );
};

export default ModulePage;



