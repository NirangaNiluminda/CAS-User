'use client'

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation'; // Use next/navigation in the App Router
import { useEffect, useState } from 'react';
import React from 'react';
import { useQuiz } from '@/context/QuizContext';

interface QuizData {
    // Define the structure of QuizData here
    id: string;
    assignment: {
        password:string;
        title: string;
    };
    // Add other fields as necessary
}


const ModulePage: React.FC = () => {


    const router = useRouter();
    const { id } = useParams(); // The 'id' corresponds to the dynamic [id] part of the URL
    if (typeof id === 'string') {
        localStorage.setItem('id', id);
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [password, setPassword] = useState('');
    const {setQuiz} = useQuiz();

    useEffect(() => {
        let apiUrl;
        // Determine the correct API URL based on the hostname
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                apiUrl = 'http://localhost:4000';
            } else {
                apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
                console.log('Deployment URL:', apiUrl);
            }
        }
        if (id) {
            // Fetch the quiz data based on the ID
            fetch(`${apiUrl}/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched Data:', data); // Log the full response
                    setQuizData(data);
                    setQuiz(data);
                })
                .catch((error) => console.error('Error fetching quiz data:', error));
        }
    }, [id]);
    

    const handleEnter = () => {
        console.log(quizData);
        const correctPassword = quizData?.assignment.password; // Adjust for arrays or nesting
        console.log('Correct Password:', correctPassword);
        if (password === correctPassword) {
            router.push(`/guidelines/${id}`);
        } else {
            alert('Incorrect Password');
        }
    };
    

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
                    {quizData?.assignment.title}
                </div>
                <div className="relative">
                    <div className="h-[68px] relative">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="text"
                            id="index"
                            className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black"
                            placeholder="XXXX"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                </div>
                <button
                    type="button"
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={handleEnter}
                >
                    Enter
                </button>
            </div>
        </div>
    );
};

export default ModulePage;



