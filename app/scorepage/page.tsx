'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ScorePage: React.FC = () => {
    const router = useRouter();
    
    interface QuizData {
        assignment: {
            title: string;
            questions: [
                {
                    questionText: string;
                    _id: string;
                    options: [
                        {
                            text: string;
                            isCorrect: boolean;
                            _id: string;
                        }
                    ]
                }
            ]
        };
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        // Access sessionStorage only after the component mounts on the client side
        const storedScore = sessionStorage.getItem('score');
        if (storedScore) {
            setScore(parseInt(storedScore, 10));
        }
    }, []); // Empty dependency array to run only once after mounting

    const handleConfirm = () => {
        router.push('/completed');
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-white">
            <div className="text-center text-black text-2xl font-bold mb-4">You have got</div>
            <div className="text-center text-black text-6xl font-bold mb-4">{score !== null ? score : 'Loading...'}/10</div>
            <Image className="w-[293px] h-100 mb-6" src="/score.jpg" alt="score image" width={380} height={380} />
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
