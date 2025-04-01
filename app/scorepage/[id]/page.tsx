'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useParams } from 'react-router-dom';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';

const ScorePage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const id_temp = localStorage.getItem('id');

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

    interface EssayData {
        essayAssignment: {
            title: string;
            _id: string;
            questions: [
                {
                    questionText: string;
                    _id: string;
                    answer: string;
                }
            ]
        }
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [length, setLength] = useState<number | null>(null); // State to store the length of the questions array
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const { setEssay } = useEssay();
    const { setQuiz } = useQuiz();
    const [isLoading, setIsLoading] = useState(true);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);

useEffect(() => {
        let apiUrl;
        if (typeof window !== 'undefined') {
            apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
            console.log('Deployment URL:', apiUrl);
        }

        if (id) {
            setIsLoading(true);
            // Fetch quiz data
            fetch(`${apiUrl}/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched Quiz Data:', data);
                    if (data.assignment) {
                        setQuizData(data);
                        setQuiz(data);
                        setIsQuiz(true);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching quiz data:', error);
                    setIsLoading(false);
                });

            // Fetch essay data
            fetch(`${apiUrl}/api/v1/essay/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched Essay Data:', data);
                    if (data.essayAssignment) {
                        setEssayData(data);
                        setEssay(data);
                        setIsEssay(true);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching essay data:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleConfirm = () => {
        // console.log(id);
        console.log(id_temp);
        if(isQuiz){
            router.push(`/correct_answers/${id_temp}`);
        }
        else{
            router.push(`/feedback/${id_temp}`);
        }
    };
    // console.log(quizData);

    // const length = quizData?.assignment.questions.length;

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-white">
            <div className="text-center text-black text-2xl font-bold mb-4">You have got</div>
            <div className="text-center text-black text-6xl font-bold mb-4">
                {sessionStorage.getItem('score')}
            </div>
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

