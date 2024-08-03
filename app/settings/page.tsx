'use client'

import { useRouter } from 'next/navigation'
import React from 'react';


const Settings: React.FC = () => {
    const router = useRouter();

    const handleUpdate = () => {

    };

    return (
        <div className="w-full h-screen flex flex-col items-center bg-white">
            {/* Navigation Bar */}
            <div className="w-full h-[100px] bg-gray-300 flex justify-between items-center px-4">
                <div className="w-10 h-10 bg-gray-400"></div> {/* Placeholder for logo */}
                <div className="flex space-x-8 text-black text-lg">
                    <button onClick={() => router.push('/dashboard')}>Dashboard</button>
                    <button>Completed</button>
                    <button onClick={() => router.push('/settings')}>Settings</button>
                </div>
                <div className="w-10 h-10 bg-gray-400"></div> {/* Placeholder for logout */}
            </div>
            {/* Profile Section */}
            <div className="w-full flex flex-col items-center mt-10">
                <img className="w-[220px] h-30" src="./profile.jpg" alt='sign in image' />
                <div className="text-center text-black text-lg mt-2">EG/XXXX/XXXX</div>
                {/* Editable Fields */}
                <div className="flex flex-col items-center mt-4 space-y-4">
                    <div className="flex items-center w-[300px] h-[40px] rounded-lg px-4">
                        <input type="password" id="confirm-password" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="PERERA A. B. C" />
                        <svg
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex items-center w-[300px] h-[40px] rounded-lg px-4">
                        <input type="password" id="confirm-password" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="PASSWORD" />
                        <svg
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                            ></path>
                        </svg>
                    </div>
                </div>
                {/* Update Button */}
                <button
                    type="button"
                    className="mt-4 focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={() => router.push('/dashboard')}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default Settings;
