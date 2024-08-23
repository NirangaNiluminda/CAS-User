'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react';


const ModulePage: React.FC = () => {


    const router = useRouter();



    return (
        <div className="flex justify-center items-center w-screen h-screen bg-white">
            <div className="flex flex-col justify-center items-center gap-12 p-4">
                <div className="relative">
                    <Image
                        className="w-56 h-56"
                        src="/module.jpg"
                        alt="Module Logo"
                        width={380} height={380} 
                    />
                </div>
                <div className="text-center text-black text-2xl font-bold font-inter">
                    Module A B C
                </div>
                <div className="relative">
                    <div className="h-[68px] relative">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="text" id="index" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="XXXX" />
                    </div>
                </div>
                <button
                    type="button"
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={() => router.push('/guidelines')}
                >
                    Enter
                </button>
            </div>
        </div>
    );
};

export default ModulePage;



