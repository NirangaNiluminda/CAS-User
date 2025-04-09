"use client";

import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { useRouter, useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Clock, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import QuizMonitor from '@/app/components/QuizMonitor/QuizMonitor';
import { useUser } from '@/context/UserContext';

const QuizPage = () => {
    const { user } = useUser();
    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const router = useRouter();
    const { id } = useParams();
    const timeLimit = localStorage.getItem('timeLimit');
    const [isLoading, setIsLoading] = useState(true);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    
    interface QuizData {
        assignment: {
            questions: {
                length: number;
                questionText: string;
                options: { _id: string; text: string }[];
                _id: string;
            }[];
            _id?: string;
        };
    }

    interface EssayData {
        essayAssignment: {
            questions: {
                length: number;
                questionText: string;
                _id: string;
            }[];
            _id?: string;
        };
    }

    interface Violation {
        type: string;
        timestamp: string;
        count?: number;
        key?: string;
    }
    
    interface SelectedAnswer {
        questionId: string;
        selectedOption: string;
    }
    
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | string }>({});
    const [selectedAnswerId, setSelectedAnswerId] = useState<SelectedAnswer[]>([]);
    const [shortAnswer, setShortAnswer] = useState('');
    const [length, setLength] = useState(1);
    const { setQuiz } = useQuiz();
    const { setEssay } = useEssay();
    const [essayAnswer, setEssayAnswer] = useState('');

    // Timer state variables
    const [remainingTime, setRemainingTime] = useState(0);
    const [quizStartTime, setQuizStartTime] = useState<string | null>(null);
    const [quizEndTime, setQuizEndTime] = useState<string | null>(null);
    
    // Monitoring and statistics state
    const [violations, setViolations] = useState<Violation[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [liveStats, setLiveStats] = useState({
        activeStudents: 0,
        completedStudents: 0
    });
    const [isLiveStatsLoading, setIsLiveStatsLoading] = useState(false);
    
    // Initialize API URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.hostname === 'localhost' 
                ? 'http://localhost:4000' 
                : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
            setApiUrl(url);
        }
    }, []);
    
    // Handle violations from QuizMonitor
    const handleViolation = (violation: Violation) => {
        setViolations(prev => [...prev, violation]);
        if (!user?._id) {
            console.error('No user found');
            return;
        }
        
        fetch(`${apiUrl}/api/v1/violations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: user._id,
                quizId: id,
                violation: violation,
                timestamp: new Date().toISOString()
            })
        }).catch(err => console.error('Failed to log violation:', err));
    };
    
    // Start session function
    const startSession = useCallback(async () => {
        if (!apiUrl || !id || !user?._id || sessionStarted) {
            console.log("Cannot start session: ", {
                apiUrl: !!apiUrl,
                id: !!id,
                userId: user?._id,
                sessionStarted
            });
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/v1/quiz-session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: id,
                    studentId: user._id,
                    timestamp: new Date().toISOString()
                })
            });
    
            if (response.ok) {
                setSessionStarted(true);
                console.log('Quiz session started successfully');
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to start quiz session:', response.status, errorData);
            }
        } catch (error) {
            console.error('Detailed error starting quiz session:', {
                message: error.message,
                stack: error.stack,
                api: `${apiUrl}/api/v1/quiz-session/start`
            });
        }
    }, [apiUrl, id, user, sessionStarted]);
    
    // Send heartbeat while quiz is active
    useEffect(() => {
        if (!sessionStarted || !apiUrl || !id || !user?._id) return;
    
        const sendHeartbeat = async () => {
            try {
                await fetch(`${apiUrl}/api/v1/quiz-session/heartbeat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quizId: id,
                        studentId: user._id,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                console.error('Error sending heartbeat:', error);
            }
        };
    
        // Send heartbeat immediately
        sendHeartbeat();
    
        // Then set up interval
        const heartbeatInterval = setInterval(sendHeartbeat, 30000); // every 30 seconds
    
        return () => clearInterval(heartbeatInterval);
    }, [sessionStarted, apiUrl, id, user]);

    // Complete session function
    const completeSession = useCallback(async () => {
        if (!sessionStarted || !apiUrl || !id || !user?._id) {
            console.log("Cannot complete session: ", {
                sessionStarted,
                apiUrl: !!apiUrl,
                id: !!id,
                userId: user?._id
            });
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/v1/quiz-session/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: id,
                    studentId: user._id,
                    timestamp: new Date().toISOString()
                })
            });
    
            if (response.ok) {
                console.log('Quiz session completed successfully');
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to complete quiz session:', response.status, errorData);
            }
        } catch (error) {
            console.error('Error completing quiz session:', error);
        }
    }, [sessionStarted, apiUrl, id, user]);
    
    // Complete session when component unmounts
    useEffect(() => {
        return () => {
            if (sessionStarted) {
                completeSession();
            }
        };
    }, [sessionStarted, completeSession]);

    // Fetch live stats
    const fetchLiveStats = useCallback(async () => {
        const quizId = quizData?.assignment?._id || essayData?.essayAssignment?._id;
        if (!quizId || !apiUrl) return;
    
        try {
            setIsLiveStatsLoading(true);
            const response = await fetch(`${apiUrl}/api/v1/stats/${quizId}`);
    
            if (response.ok) {
                const data = await response.json();
                setLiveStats({
                    activeStudents: data.activeCount || 0,
                    completedStudents: data.completedCount || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch live quiz statistics:", error);
        } finally {
            setIsLiveStatsLoading(false);
        }
    }, [quizData, essayData, apiUrl]);
    
    // Set up periodic stats fetching
    useEffect(() => {
        if (!quizData?.assignment?._id && !essayData?.essayAssignment?._id) return;
        
        // Initial fetch
        fetchLiveStats();

        // Set up interval to fetch every 10 seconds
        const statsInterval = setInterval(fetchLiveStats, 10000);

        return () => {
            clearInterval(statsInterval);
        };
    }, [fetchLiveStats, quizData, essayData]);
    
    // Start monitoring when quiz loads
    useEffect(() => {
        if (!isLoading && (isQuiz || isEssay)) {
            setIsMonitoring(true);
        }
    }, [isLoading, isQuiz, isEssay]);

    // Load saved progress
    useEffect(() => {
        const savedProgress = sessionStorage.getItem('quizProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setCurrentQuestionIndex(progress.currentQuestionIndex);
            setUserAnswers(progress.userAnswers || {});
            setSelectedAnswerId(progress.selectedAnswerId || []);
            setShortAnswer(progress.shortAnswer || '');
            setEssayAnswer(progress.essayAnswer || '');

            // Load quiz timing information
            if (progress.quizStartTime) {
                setQuizStartTime(progress.quizStartTime);
            }
            if (progress.quizEndTime) {
                setQuizEndTime(progress.quizEndTime);
            }
        }
    }, []);
    
    // Initialize timer
    useEffect(() => {
        const initializeTimer = () => {
            const storedStartTime = sessionStorage.getItem('quizStartTime');
            const storedEndTime = sessionStorage.getItem('quizEndTime');

            if (storedStartTime && storedEndTime) {
                // Quiz was already started
                const endDate = new Date(storedEndTime);
                const now = new Date();

                // Check if the stored end time is in the past
                if (endDate <= now) {
                    console.log("Stored end time is in the past, creating a new one");

                    // Create a new end time (or use timeLimit if available)
                    const newStartTime = new Date().toISOString();
                    const newEndTime = new Date(Date.now() + (Number(timeLimit) || 30) * 60 * 1000).toISOString();

                    setQuizStartTime(newStartTime);
                    setQuizEndTime(newEndTime);

                    // Update in session storage
                    sessionStorage.setItem('quizStartTime', newStartTime);
                    sessionStorage.setItem('quizEndTime', newEndTime);
                } else {
                    // Use the stored times since they're still valid
                    setQuizStartTime(storedStartTime);
                    setQuizEndTime(storedEndTime);
                }
            } else if (timeLimit) {
                // First time starting the quiz
                const startTime = new Date().toISOString();
                const endTime = new Date(Date.now() + Number(timeLimit) * 60 * 1000).toISOString();

                setQuizStartTime(startTime);
                setQuizEndTime(endTime);

                // Store in session storage
                sessionStorage.setItem('quizStartTime', startTime);
                sessionStorage.setItem('quizEndTime', endTime);
            } else {
                // No time limit provided, default to 30 minutes
                const startTime = new Date().toISOString();
                const endTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

                setQuizStartTime(startTime);
                setQuizEndTime(endTime);

                // Store in session storage
                sessionStorage.setItem('quizStartTime', startTime);
                sessionStorage.setItem('quizEndTime', endTime);
            }
        };

        initializeTimer();
    }, [timeLimit]);

    // Save progress to session storage
    useEffect(() => {
        const progress = {
            currentQuestionIndex,
            userAnswers,
            selectedAnswerId,
            shortAnswer,
            essayAnswer,
            quizStartTime,
            quizEndTime
        };
        sessionStorage.setItem('quizProgress', JSON.stringify(progress));
    }, [currentQuestionIndex, userAnswers, selectedAnswerId, shortAnswer, essayAnswer, quizStartTime, quizEndTime]);

    // Handle answer selection
    const handleAnswerClick = (index: number, questionId: string, selectedOption: string) => {
        setSelectedAnswer(index);
        const newSelectedAnswerId: SelectedAnswer[] = [...selectedAnswerId];
        
        // Find and update existing answer for this question, or add new one
        const existingIndex = newSelectedAnswerId.findIndex(
            (item) => item.questionId === questionId
        );
        if (existingIndex !== -1) {
            newSelectedAnswerId[existingIndex] = { questionId, selectedOption };
        } else {
            newSelectedAnswerId.push({ questionId, selectedOption });
        }
        setSelectedAnswerId(newSelectedAnswerId);
    };

    // Handle short answer changes
    const handleShortAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setShortAnswer(event.target.value);
    };

    // Handle essay answer changes
    const handleEssayAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEssayAnswer(event.target.value);
    };

    // Format time for display
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle next button click
    const handleNext = () => {
        setLength((quizData?.assignment.questions.length || essayData?.essayAssignment.questions.length) ?? 1);
        sessionStorage.setItem('length', length.toString());

        // Save current answer before moving to next question
        if (selectedAnswer !== null || (quizData?.assignment?.questions[currentQuestionIndex]?.options?.length ?? 0) === 0) {
            const newUserAnswers = {
                ...userAnswers,
                [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : (shortAnswer || essayAnswer),
            };
            setUserAnswers(newUserAnswers);

            if ((quizData || essayData) && (quizData?.assignment?.questions || essayData?.essayAssignment.questions) &&
                (currentQuestionIndex === (quizData?.assignment?.questions?.length ?? 0) - 1 ||
                    currentQuestionIndex === (essayData?.essayAssignment?.questions?.length ?? 0) - 1)) {
                sessionStorage.setItem('selectedAnswerId', JSON.stringify(selectedAnswerId || essayAnswer));
                sessionStorage.setItem('EssayAnswer', essayAnswer);
                completeSession();
                router.push(`/submissionpage/${id}`);
            } else {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);

                // Restore the answer for the next question if it exists
                const nextAnswer = newUserAnswers[nextIndex];
                setSelectedAnswer(typeof nextAnswer === 'number' ? nextAnswer : null);
                setShortAnswer(typeof nextAnswer === 'string' ? nextAnswer : '');
                setEssayAnswer(typeof nextAnswer === 'string' ? nextAnswer : '');
            }
        }
    };

    // Handle previous button click
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

    // Restore saved answers when question changes
    useEffect(() => {
        const savedAnswer = userAnswers[currentQuestionIndex];
        if (savedAnswer !== undefined) {
            if (typeof savedAnswer === 'number') {
                setSelectedAnswer(savedAnswer);
                setShortAnswer('');
                setEssayAnswer('');
            } else if (typeof savedAnswer === 'string') {
                setSelectedAnswer(null);
                if (isQuiz) {
                    setShortAnswer(savedAnswer);
                    setEssayAnswer('');
                } else {
                    setShortAnswer('');
                    setEssayAnswer(savedAnswer);
                }
            }
        } else {
            // Clear selections when moving to an unanswered question
            setSelectedAnswer(null);
            setShortAnswer('');
            setEssayAnswer('');
        }
    }, [currentQuestionIndex, userAnswers, isQuiz]);

    // Fetch quiz and essay data
    useEffect(() => {
        if (!apiUrl || !id) return;

        setIsLoading(true);
        
        // Fetch quiz data
        fetch(`${apiUrl}/api/v1/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.assignment) {
                    setQuizData(data);
                    setQuiz(data);
                    setIsQuiz(true);
                    setIsLoading(false);
                    startSession();
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
                if (data.essayAssignment) {
                    setEssayData(data);
                    setEssay(data);
                    setIsEssay(true);
                    setIsLoading(false);
                    startSession();
                }
            })
            .catch((error) => {
                console.error('Error fetching essay data:', error);
                setIsLoading(false);
            });
    }, [id, apiUrl, startSession]);

    // Calculate progress percentage
    const calculateProgress = () => {
        const totalQuestions = (quizData?.assignment.questions.length || essayData?.essayAssignment.questions.length) ?? 1;
        return ((currentQuestionIndex + 1) / totalQuestions) * 100;
    };

    // Timer countdown and auto-submit
    useEffect(() => {
        if (quizEndTime) {
            const calculateRemainingTime = () => {
                const now = new Date();
                const end = new Date(quizEndTime);
                const timeLeft = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));

                setRemainingTime(timeLeft);
                
                // Auto-submit if time runs out
                if (timeLeft <= 0) {
                    console.log("Time's up!");
                    completeSession();
                    router.push(`/submissionpage/${id}`);
                }
            };

            calculateRemainingTime();

            // Set up interval
            const timer = setInterval(calculateRemainingTime, 1000);

            return () => clearInterval(timer);
        }
    }, [quizEndTime, id, router, completeSession]);

    // Loading indicator
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // No quiz data
    if (!isQuiz && !isEssay) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md p-6">
                    <p className="text-center text-gray-600">No quiz or essay data available</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {isMonitoring && <QuizMonitor onViolation={handleViolation} />}
            
            {/* Top Progress Bar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Timer Card */}
            <div className="fixed top-4 right-4 z-40">
                <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <span className={`text-lg font-semibold ${remainingTime <= 300 ? 'text-red-500' : 'text-gray-700'}`}>
                                {formatTime(remainingTime)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <main className="container mx-auto px-4 pt-16 pb-32">
                {/* Question Section */}
                <Card className="max-w-4xl mx-auto mt-8 bg-white shadow-lg">
                    <CardContent className="p-8">
                        <div className="mb-8">
                            <span className="text-sm font-medium text-gray-500">
                                Question {currentQuestionIndex + 1} of {(quizData?.assignment.questions.length || essayData?.essayAssignment.questions.length)}
                            </span>
                            <h2 className="mt-2 text-xl font-semibold text-gray-900">
                                {quizData ?
                                    quizData.assignment.questions[currentQuestionIndex].questionText :
                                    essayData?.essayAssignment.questions[currentQuestionIndex].questionText
                                }
                            </h2>
                        </div>

                        {quizData ? (
                            quizData.assignment.questions[currentQuestionIndex].options.length > 0 ? (
                                <div className="space-y-4">
                                    {quizData.assignment.questions[currentQuestionIndex].options.map((answer, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAnswerClick(index, quizData.assignment.questions[currentQuestionIndex]._id, answer._id)}
                                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer
                                                ${selectedAnswer === index
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                    ${selectedAnswer === index
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300'}`}
                                                >
                                                    {selectedAnswer === index && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span className="text-gray-700">{answer.text}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    className="w-full h-48 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                    placeholder="Write your answer here..."
                                    value={shortAnswer}
                                    onChange={handleShortAnswerChange}
                                />
                            )
                        ) : (
                            <textarea
                                className="w-full h-48 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                placeholder="Write your essay answer here..."
                                value={essayAnswer}
                                onChange={handleEssayAnswerChange}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="max-w-4xl mx-auto mt-6 flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                            ${currentQuestionIndex === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'}`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 active:bg-green-700 transition-all"
                    >
                        {currentQuestionIndex === ((quizData?.assignment.questions.length || essayData?.essayAssignment.questions.length) ?? 1) - 1 ? (
                            <>
                                Submit
                                <Send className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </main>

            {/* Question Navigation Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg">
                <div className="container mx-auto px-4 py-4 overflow-x-auto">
                    <div className="flex gap-2 justify-center">
                        {(quizData?.assignment.questions ?? essayData?.essayAssignment.questions ?? []).map((_, index) => (
                            <div
                                key={index}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all
                                    ${userAnswers[index] !== undefined
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : index === currentQuestionIndex
                                            ? 'border-green-500 text-green-500'
                                            : 'border-gray-200 text-gray-500'}`}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;