'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';

const Completed: React.FC = () => {
    const router = useRouter();
    const [completedModules, setCompletedModules] = useState<string[]>([]); // Track completed modules

    const modules = [
        { name: "Module A B C", teacher: "A B C Perera", img: "/module.jpg" },
        { name: "Module D E F", teacher: "D E F Perera", img: "/module1.jpg" },
        { name: "Module G H I", teacher: "G H I Perera", img: "/module2.jpg" },
    ];

    const handleModuleSubmit = (moduleName: string) => {
        if (!completedModules.includes(moduleName)) {
            setCompletedModules([...completedModules, moduleName]);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-32 pb-10 px-4">
            <Navbar />
            <div className="w-full max-w-7xl mt-8">
                <div className="mb-10">
                    <h2 className="text-5xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">Completed Modules</h2>
                    <p className="text-muted-foreground text-lg font-medium">Your successfully completed assignments</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module, index) => (
                        <div key={index} className="p-8 glass-card rounded-3xl flex items-center gap-5 group hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 premium-shadow relative overflow-hidden">
                            {/* Completed Badge */}
                            <div className="absolute top-4 right-4 w-12 h-12 rounded-full gradient-green flex justify-center items-center shadow-lg shadow-green-300/50 z-10">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-[3px] border-green-100 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <Image className="object-cover" src={module.img} alt={`${module.name} logo`} fill />
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20" />
                            </div>
                            <div className="flex-1 min-w-0 pr-12">
                                <div className="text-xl font-bold text-foreground truncate mb-1 group-hover:text-primary transition-colors">{module.name}</div>
                                <div className="text-sm text-muted-foreground truncate font-medium mb-2">{module.teacher}</div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-xs font-bold text-primary">Completed</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Completed;







