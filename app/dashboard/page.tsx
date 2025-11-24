'use client'
 
import { useRouter } from 'next/navigation'
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';


const Dashboard: React.FC = () => {

    const router = useRouter();

    const modules = [
        { name: "Module A B C", teacher: "A B C Perera", img: "/module.jpg" },
        { name: "Module D E F", teacher: "D E F Perera", img: "/module1.jpg" },
        { name: "Module G H I", teacher: "G H I Perera", img: "/module2.jpg" },
        { name: "Module J K L", teacher: "J K L Perera", img: "/module3.jpg" },
        { name: "Module M N O", teacher: "M N O Perera", img: "/module4.jpg" },
        { name: "Module P Q R", teacher: "P Q R Perera", img: "/module5.jpg" },
    ];


    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-32 pb-10 px-4">
            <Navbar />
            <div className="w-full max-w-7xl mt-8">
                <div className="mb-10">
                    <h2 className="text-5xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">Your Modules</h2>
                    <p className="text-muted-foreground text-lg font-medium">Select a module to continue</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module, index) => (
                        <div key={index} className="p-8 glass-card rounded-3xl flex items-center gap-5 group hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 cursor-pointer premium-shadow" onClick={() => router.push(`/modulepage`)}>
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-[3px] border-green-100 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <Image className="object-cover" src={module.img} alt={`${module.name} logo`} fill />
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xl font-bold text-foreground truncate mb-1 group-hover:text-primary transition-colors">{module.name}</div>
                                <div className="text-sm text-muted-foreground truncate font-medium">{module.teacher}</div>
                            </div>
                            <button className="w-14 h-14 rounded-2xl gradient-green flex justify-center items-center text-white shadow-lg shadow-green-300/40 group-hover:shadow-xl group-hover:shadow-green-400/50 group-hover:scale-110 transition-all duration-500">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;



