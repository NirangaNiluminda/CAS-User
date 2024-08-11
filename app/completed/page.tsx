'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';

const Completed: React.FC = () => {
    const router = useRouter();
    const [completedModules, setCompletedModules] = useState<string[]>([]); // Track completed modules

    const modules = [
        { name: "Module A B C", teacher: "A B C Perera", img: "./module.jpg" },
        { name: "Module D E F", teacher: "D E F Perera", img: "./module1.jpg" },
        { name: "Module G H I", teacher: "G H I Perera", img: "./module2.jpg" },
    ];

    const handleModuleSubmit = (moduleName: string) => {
        if (!completedModules.includes(moduleName)) {
            setCompletedModules([...completedModules, moduleName]);
        }
    };

    return (
        <div className="w-full h-full bg-white flex flex-col items-center">
            <div className="w-full h-[100px] bg-gray-300 flex justify-between items-center px-4">
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
                        <div 
                            className="ml-auto w-8 h-8 bg-green-500 rounded-full flex justify-center items-center"
                            onClick={() => router.push('/modulepage')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black">
    <circle cx="12" cy="12" r="10" fill="#22c55e"/>  {/* Green circle background */}
    <path d="M9 12L11 14L15 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />  {/* White checkmark */}
</svg>

                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Completed;







