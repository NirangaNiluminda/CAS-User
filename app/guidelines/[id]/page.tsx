'use client';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { toast } from "sonner";

interface QuizData {
    id: string;
    assignment: {
        title: string;
        guidelines: string[];
        timeLimit?: number;
        questions: {
        };
    };
}

interface EssayData {
    id: string;
    essayAssignment: {
        title: string;
        guidelines: string[];
        timeLimit?: number;
        questions: {
        };
    };
}

const Guidelines: React.FC = () => {

    let isQuiz = false;
    let isEssay = false;

    const router = useRouter();
    const { id } = useParams();
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const { setQuiz } = useQuiz();
    const { setEssay } = useEssay();

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
            // Fetch the data based on the ID for Quiz
            fetch(`${apiUrl}/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched Quiz Data:', data); // Log the full response
                    if (data.assignment) {
                        setQuizData(data);
                        setQuiz(data);
                        isQuiz = true;
                    }
                })
                .catch((error) => console.error('Error fetching quiz data:', error));

            // Fetch the data based on the ID for Essay
            fetch(`${apiUrl}/api/v1/essay/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched Essay Data:', data); // Log the full response
                    if (data.essayAssignment) {
                        setEssayData(data);
                        setEssay(data);
                        isEssay = true;
                    }
                })
                .catch((error) => console.error('Error fetching essay data:', error));
        }
    }, [id]);

    const handleAccept = () => {
        if(guidelines.length > 0) {
            toast.success("Loading the Assignment.... Get Ready!");
            router.push(`/assignment/${id}`); // Redirect to the assignment page
        }
        else {
            toast.error("No guidelines available");
        }
    }

    const guidelines =
        quizData?.assignment.guidelines || essayData?.essayAssignment.guidelines || []; // Fallback to empty array if undefined

    const timeLimit = quizData?.assignment.timeLimit || essayData?.essayAssignment.timeLimit || 0; // Fallback to 0 if undefined
    localStorage.setItem('timeLimit', timeLimit.toString()); // Store the time limit in the local storage

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
                    onClick={handleAccept}
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default Guidelines;
