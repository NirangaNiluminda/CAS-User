'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
const SubmissionPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useUser();

    const studentId = user?._id;

    interface Submission {
        assignmentId: string;
        studentId: string;
        score: number;
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

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => setQuizData(data))
                .catch((error) => console.error('Error fetching quiz data:', error));
        }
        // console.log(studentId); // checking whether the user is logged in or not
    }, [id]);

    if (!quizData) {
        return <p>Loading...</p>;
    }
    const handleGoBack = () => {
        router.push('/question10');
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit?")) return;
    
        const answers = JSON.parse(sessionStorage.getItem('selectedAnswerId') || '[]'); // Parse answers array if stored as JSON
    
        const submittingData = {
            userId: studentId,
            answers: answers,
            startTime: new Date().toISOString(), // Set current time dynamically
        };
    
        // console.log(submittingData);
        // console.log(submittingData);
        // console.log(studentId);
    
        try {
            console.log(submittingData);
            const response = await axios.post(`http://localhost:4000/api/v1/${id}/submit`, submittingData, {
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
