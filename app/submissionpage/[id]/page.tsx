'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
const SubmissionPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useUser();
    const { essay } = useEssay();
    const { quiz } = useQuiz();

    const studentId = user?._id;
    const registrationNumber = user?.registrationNumber;
    const assignmentId = essay?._id || quiz?._id;

    interface Submission {
        assignmentId: string;
        studentId: string;
        score: number;
    }

    interface EssaySubmission {
        assignmentId: string;
        userId: string;
        registrationNumber: string;
        answers: [
            {
                questionId: string;
                modelAnswer: string;
                studentAnswer: string;
            }
        ],
        startTime: string;
    }

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
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [essaySubmission, setEssaySubmission] = useState<EssaySubmission | null>(null);
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


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isQuiz && !isEssay) {
        return <p>No data available</p>;
    }
    const handleGoBack = () => {
        router.push('/question10');
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit?")) return;

        const answers = (JSON.parse(sessionStorage.getItem('selectedAnswerId') || '[]') || sessionStorage.getItem('EssayAnswer')); // Parse answers array if stored as JSON

        const submittingData = {
            userId: studentId,
            answers: answers,
            startTime: new Date().toISOString(), // Set current time dynamically
        };

        // console.log(submittingData);
        // console.log(submittingData);
        // console.log(studentId);

        try {
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
            if (isQuiz) {
                console.log(submittingData);
                const response = await axios.post(`${apiUrl}/api/v1/${id}/submit`, submittingData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    alert('Submission successful!');
                    setSubmission(response.data.submission);
                    // console.log(response.data); // submission score checking whether it is working
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    router.push(`/scorepage/${id}`);
                }
            } else {
                
                const essayAnswer = sessionStorage.getItem('EssayAnswer');
                console.log(essayData?.essayAssignment._id, studentId, registrationNumber, essayAnswer);
                setEssaySubmission({
                    assignmentId: essayData?.essayAssignment._id || '',
                    userId: studentId || '',
                    registrationNumber: registrationNumber || '',
                    answers: [{
                        questionId: essayData?.essayAssignment?.questions[0]?._id || '',
                        modelAnswer: essayData?.essayAssignment?.questions[0]?.answer || '',
                        studentAnswer: essayAnswer || ''
                    }],
                    startTime: new Date().toISOString() // Add startTime property
                })

                console.log(essaySubmission);

                const response = await axios.post(`${apiUrl}/api/v1/essay/${id}/submit`, essaySubmission, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    alert('Submission successful!');
                    setEssaySubmission(response.data.submission);
                    // console.log(response.data); // submission score checking whether it is working
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    router.push(`/scorepage/${id}`);
                }
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('There was an error submitting your answers.');
        }
    };


    return (
        <div className="w-screen h-screen flex flex-col items-center bg-white">
            <div className="w-full h-[113px] bg-[#d9d9d9] flex items-center justify-center">
                <div className="text-black text-[40px] font-bold">Submission</div>
            </div>
            <div className="w-[90%] h-auto mt-5 bg-[#d9d9d9]/40 rounded-[11px] grid grid-cols-10 gap-2 justify-items-center items-start">
                {Array.from({ length: quizData?.assignment?.questions?.length || essayData?.essayAssignment?.questions?.length || 0 }, (_, i) => (
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
