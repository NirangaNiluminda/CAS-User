'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPen } from 'react-icons/fa'; // Import an icon for the edit button

const ProfilePage: React.FC = () => {
    const router = useRouter();

    const handleUpdate = () => {
        router.push('/dashboard');
    };

    return (
        <div className="w-full h-screen flex flex-col items-center bg-white">
            {/* Navigation Bar */}
            <div className="w-full h-[100px] bg-gray-300 flex justify-between items-center px-4">
                <div ><img src="./logo.jpeg" alt="Logo" className="w-10 h-10 object-cover" />
                </div> {/* Placeholder for logo */}
                <div className="flex space-x-8 text-black text-lg">
                    <button onClick={() => router.push('/dashboard')}>Dashboard</button>
                    <button onClick={() => router.push('/completed')}>Completed</button>
                    <button onClick={() => router.push('/settings')}>Settings</button>
                </div>
                <div className="w-10 h-10 bg-gray-400"></div> {/* Placeholder for logout */}
            </div>
            {/* Profile Section */}
            <div className="w-full flex flex-col items-center mt-10">
                <img className="w-[220px] h-30" src="./profile.jpg" alt="profile image" />
                <div className="text-center text-black text-lg mt-2">EG/XXXX/XXXX</div>
                {/* Editable Fields */}
                <div className="flex flex-col items-center mt-4 space-y-4">
                    <div className="flex items-center w-[300px] h-[40px] bg-[#89f587] rounded-lg px-4">
                        <input
                            className="w-full bg-transparent outline-none text-black"
                            type="text"
                            value="Perera A. B. C." /* Bind this to a state variable if needed */
                            readOnly
                        />
                        <FaPen className="text-black ml-2" />
                    </div>
                    <div className="flex items-center w-[300px] h-[40px] bg-[#89f587] rounded-lg px-4">
                        <input
                            className="w-full bg-transparent outline-none text-black"
                            type="text"
                            value="0XXXXXXXXX" /* Bind this to a state variable if needed */
                            readOnly
                        />
                        <FaPen className="text-black ml-2" />
                    </div>
                </div>
                {/* Update Button */}
                <button
                    type="button"
                    className="mt-4 focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={handleUpdate}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
