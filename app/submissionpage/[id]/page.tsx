'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SubmissionPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();

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

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => setQuizData(data))
                .catch((error) => console.error('Error fetching quiz data:', error));
        }
    }, [id]);

    if (!quizData) {
        return <p>Loading...</p>;
    }

    const handleGoBack = () => {
        router.push('/question10');
    };

    const handleSubmit = () => {
        alert("Are you sure you want to submit?");
        router.push('/scorepage');
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-white">
            <div className="w-full h-[113px] bg-[#d9d9d9] flex items-center justify-center">
                <div className="text-black text-[40px] font-bold">Submission</div>
            </div>
            <div className="w-[90%] h-auto mt-5 bg-[#d9d9d9]/40 rounded-[11px] grid grid-cols-10 gap-2 justify-items-center items-start">
                {Array.from({ length: quizData.assignment?.questions?.length || 0 }, (_, i) => (
                    <div
                        key={i}
                        className="px-5 py-2.5 m-2 rounded-md border-2 border-[#0cdc09] flex flex-col items-center"
                        style={{
                            width: '84px', // fixed width
                            height: '84px', // fixed height
                        }}
                    >
                        <div className="text-center text-black text-[32px] font-bold">{i + 1}</div>
                        <div className="w-full h-20 bg-[#0cdc09] rounded-md mt-2" />
                    </div>
                ))}
            </div>
            <div className="w-[90%] mt-auto mb-10 flex justify-between">
                <button
                    type="button"
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={handleGoBack}
                >
                    Go Back
                </button>
                <button
                    type="button"
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                    onClick={handleSubmit}
                >
                    Submit All
                </button>
            </div>
        </div>
    );
};

export default SubmissionPage;
