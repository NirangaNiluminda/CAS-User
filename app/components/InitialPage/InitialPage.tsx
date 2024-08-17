'use client'
import React from 'react';
import { useRouter } from 'next/navigation' // Import the useRouter hook
import Image from 'next/image';

const InitialPage: React.FC = () => {
  const router = useRouter(); // Initialize the useRouter hook

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-[373px] h-auto flex flex-col justify-start items-center gap-11">
        <div className="self-stretch h-[31px] text-center text-black text-[32px] font-extrabold font-['Inter']">
          Getting Started
        </div>
        <Image className="self-stretch h-[373px]" src="/./initialPage.jpg" alt="Initial Page" width={380} height={380} />
        <div className="h-[136px] flex flex-col justify-start items-center gap-3.5">
          <button
            type="button"
            onClick={() => router.push('/signup')} // Add click handler here
            className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => router.push('/signin')}
            className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;
