'use client'
import { useRouter, useParams } from 'next/navigation'; // Use next/navigation in the App Router
import { useEffect, useState } from 'react';
import React from 'react';

const Guidelines: React.FC = () => {

    const router = useRouter();
    const { id } = useParams(); // The 'id' corresponds to the dynamic [id] part of the URL
    console.log(id);

    return (
        <div className="w-full max-w-screen-lg h-[768px] pt-[104px] pb-[181px] bg-white flex justify-center items-center mx-auto">
            <div className="flex flex-col justify-center items-center gap-12 w-full px-4">
                <div className="text-black text-[32px] font-extrabold font-['Inter'] text-center">Guidelines</div>
                <div className="flex flex-col justify-center items-center gap-6 w-full">
                    <div className="flex items-center gap-2 w-full px-4 justify-center">
                        <div className="w-[15px] h-[15px] bg-[#09a307] rounded-full" />
                        <div className="text-black text-base font-normal font-['Inter'] text-center">Line 01</div>
                    </div>
                    <div className="flex items-center gap-2 w-full px-4 justify-center">
                        <div className="w-[15px] h-[15px] bg-[#09a307] rounded-full" />
                        <div className="text-black text-base font-normal font-['Inter'] text-center">Line 02</div>
                    </div>
                    <div className="flex items-center gap-2 w-full px-4 justify-center">
                        <div className="w-[15px] h-[15px] bg-[#09a307] rounded-full" />
                        <div className="text-black text-base font-normal font-['Inter'] text-center">Line 03</div>
                    </div>
                    <div className="flex items-center gap-2 w-full px-4 justify-center">
                        <div className="w-[15px] h-[15px] bg-[#09a307] rounded-full" />
                        <div className="text-black text-base font-normal font-['Inter'] text-center">Line 04</div>
                    </div>
                </div>
                <button
                    type="button"
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={() => router.push(`/assignment/${id}`)}
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default Guidelines;





