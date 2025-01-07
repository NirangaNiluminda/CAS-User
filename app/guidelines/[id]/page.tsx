'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';

interface QuizData {
    id: string;
    assignment: {
        title: string;
        guidelines: string[];
        questions: {
        };
    };
}

const Guidelines: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const [quizData, setQuizData] = useState<QuizData | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched Data:', data); // Debug fetched data
                    setQuizData(data);
                })
                .catch((error) => console.error('Error fetching quiz data:', error));
        }
    }, [id]);

    const guidelines =
        quizData?.assignment.guidelines || []; // Fallback to empty array if undefined

    return (
        <div className="w-full max-w-screen-lg h-[768px] pt-[104px] pb-[181px] bg-white flex justify-center items-center mx-auto">
            <div className="flex flex-col justify-center items-center gap-12 w-full px-4">
                <div className="text-black text-[32px] font-extrabold font-['Inter'] text-center">
                    Guidelines
                </div>
                <div className="flex flex-col justify-center items-center gap-6 w-full">
                    {guidelines.length > 0 ? (
                        guidelines.map((line, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 w-full px-4 justify-center"
                            >
                                <div className="w-[15px] h-[15px] bg-[#09a307] rounded-full" />
                                <div className="text-black text-base font-normal font-['Inter'] text-center">
                                    {line}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-base">No guidelines available</div>
                    )}
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
