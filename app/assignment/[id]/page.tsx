"use client"; // Mark the component as a Client Component

import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { useRouter, useParams } from 'next/navigation'; // Use next/navigation in the App Router
import { ChangeEvent, useEffect, useState } from 'react';

const QuizPage = () => {

    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const router = useRouter();
    const { id } = useParams(); // The 'id' corresponds to the dynamic [id] part of the URL
    const timeLimit = localStorage.getItem('timeLimit'); // Retrieve the time limit from the local storage
    console.log(timeLimit); // Debug the time limit
    const [isLoading, setIsLoading] = useState(true);

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
            questions: [
                {
                    questionText: string;
                    _id: string;
                    answer: string;
                }
            ]
        }
    }

    // Define an interface for storing user answers
    interface UserAnswers {
        [index: number]: number | string; // index is question index, value is either selected answer index or short answer
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [selectedAnswerId, setSelectedAnswerId] = useState<{ questionId: string; selectedOption: string }[]>([]);
    const [shortAnswer, setShortAnswer] = useState<string>('');
    const [length, setLength] = useState<number>(1);
    const { setQuiz } = useQuiz();
    const { setEssay } = useEssay();
    const [essayAnswer, setEssayAnswer] = useState<string>('');

    const handleAnswerClick = (index: number, questionId: string, selectedOption: string) => {
        // console.log(id); // check whether actual id is passed or not
        setSelectedAnswer(index);
        setSelectedAnswerId(prev => [...prev, { questionId, selectedOption }]); // Store the selected answer's ID in the array
    };

    const handleShortAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setShortAnswer(event.target.value);
    };

    const handleEssayAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEssayAnswer(event.target.value);
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        setLength((quizData?.assignment.questions.length || essayData?.essayAssignment.questions.length) ?? 1);
        sessionStorage.setItem('length', length.toString());
        if (selectedAnswer !== null || (quizData?.assignment?.questions[currentQuestionIndex]?.options?.length ?? 0) === 0) {
            setUserAnswers(prev => ({
                ...prev,
                [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : (shortAnswer || essayAnswer),
            }));

            if ((quizData || essayData) && (quizData?.assignment?.questions || essayData?.essayAssignment.questions) && (currentQuestionIndex === (quizData?.assignment?.questions?.length ?? 0) - 1 || currentQuestionIndex === (essayData?.essayAssignment?.questions?.length ?? 0) - 1)) {
                // Navigate to Submission Page when all questions are completed
                console.log(selectedAnswerId);
                sessionStorage.setItem('selectedAnswerId', JSON.stringify(selectedAnswerId || essayAnswer)); // Store the selected answer IDs in the session storage
                router.push(`/submissionpage/${id}`);
            } else {
                // Move to the next question
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null); // Reset selected answer for the next question
                setShortAnswer(''); // Reset short answer for the next question
                setEssayAnswer(''); // Reset essay answer for the next question
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setUserAnswers(prev => ({
                ...prev,
                [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : (shortAnswer || essayAnswer),
            }));

            setCurrentQuestionIndex(currentQuestionIndex - 1);
            const prevAnswer = userAnswers[currentQuestionIndex - 1];
            setSelectedAnswer(typeof prevAnswer === 'number' ? prevAnswer : null);
            setShortAnswer(typeof prevAnswer === 'string' ? prevAnswer : '');
        }
    };

    const [remainingTime, setRemainingTime] = useState<number>(timeLimit ? Number(timeLimit) * 60 : 0);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);

            // Clear the interval when the component unmounts or time runs out
            return () => clearInterval(timer);
        } else if (remainingTime === 0) {
            // Handle time-out logic here (e.g., auto-submit or navigate)
            console.log("Time's up!");
        }
    }, [remainingTime]);


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

    return (
        <div>
            {/* <h1>Quiz Title: {quizData.assignment.title}</h1> */}
            <div className="relative min-h-screen bg-white">
                <div className="absolute top-0 left-0 w-full h-[113px] bg-gray-300" />
                <div className="absolute top-[39px] left-[50%] translate-x-[-50%] text-black text-4xl font-bold font-['Inter']">
                    Question {currentQuestionIndex + 1}
                </div>
                {quizData ? (
                    <div className="flex flex-col items-center absolute top-[130px] left-[50%] translate-x-[-50%] w-full">
                        <div className="w-full max-w-5xl text-left text-black text-xl mb-4">
                            {quizData.assignment.questions[currentQuestionIndex].questionText}
                        </div>
                        <div className="w-full max-w-5xl">
                            {quizData.assignment.questions[currentQuestionIndex].options.length > 0 ? (
                                <div className="flex flex-col items-start mt-10 pb-20">
                                    {quizData.assignment.questions[currentQuestionIndex].options.map((answer, index) => (
                                        <div key={index} className="flex items-center mt-2">
                                            <div
                                                className={`w-4 h-4 rounded-full border border-[#0cdc09] ${selectedAnswer === index ? 'bg-[#0cdc09]' : ''
                                                    }`}
                                                onClick={() => handleAnswerClick(index, quizData.assignment.questions[currentQuestionIndex]._id, answer._id)}
                                            />
                                            <div className="text-black text-base font-normal font-['Inter'] ml-2">{answer.text}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (

                                <textarea
                                    className="w-full h-32 p-4 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                    placeholder="Write your answer here..."
                                    value={shortAnswer}
                                    onChange={handleShortAnswerChange}
                                />
                            )}
                        </div>
                        <div className="flex justify-between w-full max-w-5xl mt-4">
                            <button
                                type="button"
                                className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                                onClick={handleNext}
                            >
                                {currentQuestionIndex === quizData.assignment.questions.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center absolute top-[130px] left-[50%] translate-x-[-50%] w-full">
                        <div className="w-full max-w-5xl text-left text-black text-xl mb-4">
                            {essayData?.essayAssignment.questions[currentQuestionIndex].questionText}
                        </div>
                        <div className="w-full max-w-5xl">
                            <textarea
                                className="w-full h-32 p-4 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                placeholder="Write your answer here..."
                                value={essayAnswer}
                                onChange={handleEssayAnswerChange}
                            />
                        </div>
                        <div className="flex justify-between w-full max-w-5xl mt-4">
                            <button
                                type="button"
                                className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
                                onClick={handleNext}
                            >
                                {currentQuestionIndex === (essayData?.essayAssignment?.questions?.length ?? 0) - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}
                <div className="absolute top-[130px] right-[5%] border border-black p-4 rounded-lg">
                    <div className="text-black text-xl font-normal font-['Inter'] mb-2">Time Remaining</div>
                    <div
                        className={`text-xl font-['Inter'] ${timeLimit && Number(timeLimit) <= 60 ? 'text-red-500 font-bold' : 'text-black'
                            }`}
                    >
                        {formatTime(remainingTime)}
                    </div>
                </div>

                {/* Completed Questions Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[154px] bg-gray-300 flex items-center justify-center space-x-4">
                    {(quizData?.assignment.questions ?? essayData?.essayAssignment.questions ?? []).map((_, index) => (
                        <div
                            key={index}
                            className={`px-5 py-2.3 rounded-md border-2 border-[#0cdc09] justify-center items-center gap-2.5 inline-flex ${userAnswers[index] !== undefined ? 'bg-[#0cdc09]' : 'bg-transparent'}`}
                            style={{ width: '84px' }}
                        >
                            <div className="w-full flex-col justify-start items-center inline-flex">
                                <div className="self-stretch text-center text-black text-[32px] font-bold font-['Inter']">{index + 1}</div>
                                <div className="self-stretch h-8 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
