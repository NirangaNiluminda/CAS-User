'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
const SubmissionPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useUser();
    const { essay } = useEssay();
    const { quiz } = useQuiz();

    interface QuizData {
        assignment?: {
            _id?: string;
            questions?: { _id: string }[];
        };
    }

    interface EssayData {
        essayAssignment?: {
            _id?: string;
            questions?: { _id: string; answer?: string }[];
        };
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const [savedAnswers, setSavedAnswers] = useState([]);
    const [submissionInProgress, setSubmissionInProgress] = useState(false);

    useEffect(() => {
        const savedProgress = sessionStorage.getItem('quizProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setSavedAnswers(progress.userAnswers || {});
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:4000'
                : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;

            setIsLoading(true);
            try {
                // Fetch quiz data
                const quizResponse = await fetch(`${apiUrl}/api/v1/${id}`);
                const quizData = await quizResponse.json();
                if (quizData.assignment) {
                    setQuizData(quizData);
                    setIsQuiz(true);
                }

                // Fetch essay data
                const essayResponse = await fetch(`${apiUrl}/api/v1/essay/${id}`);
                const essayData = await essayResponse.json();
                if (essayData.essayAssignment) {
                    setEssayData(essayData);
                    setIsEssay(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleGoBack = () => {
        // Save current progress before going back
        const currentProgress = {
            userAnswers: savedAnswers,
            currentQuestionIndex: (quizData?.assignment?.questions?.length || essayData?.essayAssignment?.questions?.length || 0) - 1
        };
        sessionStorage.setItem('quizProgress', JSON.stringify(currentProgress));
        router.push(`/assignment/${id}`);
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit? This action cannot be undone.")) {
            return;
        }
    
        setSubmissionInProgress(true);
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:4000'
            : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
    
        try {
            // Try to complete the session - use a more generic assignment ID
            const assignmentId = isQuiz 
                ? quizData?.assignment?._id || id 
                : essayData?.essayAssignment?._id || id;
            
            if (user?._id && assignmentId) {
                try {
                    const sessionResponse = await fetch(`${apiUrl}/api/v1/quiz-session/complete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            quizId: assignmentId,
                            studentId: user._id,
                            timestamp: new Date().toISOString()
                        })
                    });
                    
                    if (sessionResponse.ok) {
                        console.log('Session completed successfully');
                    } else {
                        console.warn('Session completion returned non-OK status');
                    }
                } catch (sessionError) {
                    console.error('Error completing session:', sessionError);
                    // Continue with submission
                }
            }
    
            // Handle submission based on type
            if (isQuiz) {
                const answers = JSON.parse(sessionStorage.getItem('selectedAnswerId') || '[]');
                const submissionData = {
                    userId: user?._id,
                    answers: answers,
                    startTime: new Date().toISOString()
                };
    
                console.log("Quiz submission data:", submissionData);
    
                const response = await axios.post(
                    `${apiUrl}/api/v1/${id}/submit`,
                    submissionData,
                    { 
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 10000 // Add timeout to avoid hanging requests
                    }
                );
    
                if (response.data.success) {
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    router.push(`/scorepage/${id}`);
                }
            } else if (isEssay) {
                const essayAnswer = sessionStorage.getItem('EssayAnswer');
                
                // Make sure we have the essay ID
                if (!essayData?.essayAssignment?._id) {
                    console.error("Missing essay assignment ID", essayData);
                    throw new Error("Essay assignment data is incomplete");
                }
    
                // Create submission data with all required fields
                const submissionData = {
                    assignmentId: essayData.essayAssignment._id,
                    userId: user?._id,
                    registrationNumber: user?.registrationNumber || "",
                    answers: [{
                        questionId: essayData.essayAssignment.questions?.[0]?._id ?? null,
                        modelAnswer: essayData.essayAssignment.questions?.[0]?.answer || "",
                        studentAnswer: essayAnswer || ""
                    }],
                    startTime: new Date().toISOString()
                };
    
                console.log("Essay submission data:", submissionData);
    
                // Try with fetch instead of axios as an alternative
                try {
                    const response = await fetch(`${apiUrl}/api/v1/essay/${id}/submit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(submissionData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        sessionStorage.setItem('score', String(data.submission?.score));
                        router.push(`/scorepage/${id}`);
                    } else {
                        throw new Error(data.message || "Essay submission failed");
                    }
                } catch (fetchError) {
                    console.error("Fetch error:", fetchError);
                    
                    // Fall back to axios as a second attempt with a different URL format
                    console.log("Trying alternative submission method...");
                    const altResponse = await axios.post(
                        `${apiUrl}/api/v1/essay-submission`,
                        {
                            ...submissionData,
                            essayId: id // Add explicit essay ID
                        },
                        { 
                            headers: { 'Content-Type': 'application/json' },
                            timeout: 15000
                        }
                    );
                    
                    if (altResponse.data.success) {
                        sessionStorage.setItem('score', String(altResponse.data.submission?.score));
                        router.push(`/scorepage/${id}`);
                    } else {
                        throw new Error(altResponse.data.message || "Essay submission failed with alternative method");
                    }
                }
            }
        } catch (error) {
            // console.error('Submission error details:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`An error occurred during submission: ${errorMessage}. Please try again.`);
        } finally {
            setSubmissionInProgress(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const totalQuestions = quizData?.assignment?.questions?.length ||
        essayData?.essayAssignment?.questions?.length || 0;
    const answeredQuestions = Object.keys(savedAnswers).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto">
                    <CardContent className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Submission Overview
                        </h1>

                        <Alert className="mb-6">
                            <AlertDescription>
                                You have answered {answeredQuestions} out of {totalQuestions} questions.
                                {answeredQuestions < totalQuestions &&
                                    " Consider reviewing unanswered questions before submitting."}
                            </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-5 gap-4 mb-8">
                            {Array.from({ length: totalQuestions }, (_, i) => (
                                <Card key={i} className={`p-4 text-center ${savedAnswers[i] !== undefined
                                        ? 'bg-green-50 border-green-500'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <div className="text-2xl font-bold mb-2">{i + 1}</div>
                                    {savedAnswers[i] !== undefined && (
                                        <CheckCircle2 className="w-6 h-6 mx-auto text-green-500" />
                                    )}
                                </Card>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handleGoBack}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Go Back
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={submissionInProgress}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                            >
                                <Send className="w-4 h-4" />
                                {submissionInProgress ? 'Submitting...' : 'Submit All'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SubmissionPage;
