'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ScorePage: React.FC = () => {
    const router = useRouter();

    const handleConfirm = () => {
        router.push('/completed');
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-white">
            <div className="text-center text-black text-2xl font-bold mb-4">You have scored</div>
            <div className="text-center text-black text-6xl font-bold mb-4">9/10</div>
            <Image className="w-[293px] h-100 mb-6" src="/score.jpg" alt="score image" width={380} height={380}  />
            <button
                type="button"
                className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                onClick={handleConfirm}
            >
                Confirm
            </button>
        </div>
    );
};

export default ScorePage;

