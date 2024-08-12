'use client'
 
import { useRouter } from 'next/navigation'
import React from 'react';
import Navbar from '../components/Navbar/Navbar';


const Dashboard: React.FC = () => {

    const router = useRouter();

    const modules = [
        { name: "Module A B C", teacher: "A B C Perera", img: "./module.jpg" },
        { name: "Module D E F", teacher: "D E F Perera", img: "./module1.jpg" },
        { name: "Module G H I", teacher: "G H I Perera", img: "./module2.jpg" },
        { name: "Module J K L", teacher: "J K L Perera", img: "./module3.jpg" },
        { name: "Module M N O", teacher: "M N O Perera", img: "./module4.jpg" },
        { name: "Module P Q R", teacher: "P Q R Perera", img: "./module5.jpg" },
    ];


    return (
        <div className="w-full h-full bg-white flex flex-col items-center">
            <div className="w-full h-[100px] flex justify-between items-center px-4">
                <Navbar />
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
                {modules.map((module, index) => (
                    <div key={index} className="p-4 border-2 border-green-500 rounded-lg flex items-center">
                        <div className="relative">
                            <img className="w-20 h-20 rounded-full" src={module.img} alt={`${module.name} logo`} />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-semibold">{module.name}</div>
                            <div className="text-sm font-light">{module.teacher}</div>
                        </div>
                        <button 
                            className="ml-auto w-8 h-8 bg-green-500 rounded-full flex justify-center items-center"
                            onClick={() => router.push('/modulepage')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black">
                                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;



