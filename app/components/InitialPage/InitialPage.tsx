'use client'
import React from 'react';
import { useRouter } from 'next/navigation' // Import the useRouter hook
import Image from 'next/image';

const InitialPage: React.FC = () => {
  const router = useRouter(); // Initialize the useRouter hook

  return (
    <div className="w-full h-screen flex justify-center items-center px-4 py-6 overflow-hidden">
      <div className="w-full max-w-lg p-8 glass-card rounded-[2rem] flex flex-col justify-start items-center gap-6 animate-in fade-in zoom-in duration-700 premium-shadow">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Getting Started
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Welcome to your premium assignment system.
          </p>
        </div>
        
        <div className="relative w-full max-w-xs aspect-square rounded-3xl overflow-hidden border-[3px] border-green-100 shadow-2xl premium-shadow hover:shadow-green-200/60 transition-all duration-500 group">
            <Image 
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                src="/initialPage.jpg" 
                alt="Initial Page" 
                fill
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-green-200/20 rounded-3xl" />
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="w-full py-3 px-8 gradient-green text-white font-bold text-base rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Sign up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
          <button
            type="button"
            onClick={() => router.push('/signin')}
            className="w-full py-3 px-8 bg-white text-foreground font-bold text-base rounded-2xl border-2 border-green-200 shadow-lg shadow-green-100/50 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;
