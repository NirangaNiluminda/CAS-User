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

    const [quizData, setQuizData] = useState(null);
    const [essayData, setEssayData] = useState(null);
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
            try {
                await fetch(`${apiUrl}/api/v1/quiz-session/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quizId: id,
                        studentId: user?._id,
                        timestamp: new Date().toISOString()
                    })
                });
                console.log('Quiz session completed successfully');
            } catch (error) {
                console.error('Error completing quiz session:', error);
            }
            if (isQuiz) {
                const answers = JSON.parse(sessionStorage.getItem('selectedAnswerId') || '[]');
                const submissionData = {
                    userId: user?._id,
                    answers: answers,
                    startTime: new Date().toISOString()
                };

                const response = await axios.post(
                    `${apiUrl}/api/v1/${id}/submit`,
                    submissionData,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.data.success) {
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    router.push(`/scorepage/${id}`);
                }
            } else if (isEssay) {
                const essayAnswer = sessionStorage.getItem('EssayAnswer');
                const submissionData = {
                    assignmentId: essayData?.essayAssignment._id,
                    userId: user?._id,
                    registrationNumber: user?.registrationNumber,
                    answers: [{
                        questionId: essayData?.essayAssignment?.questions[0]?._id,
                        modelAnswer: essayData?.essayAssignment?.questions[0]?.answer,
                        studentAnswer: essayAnswer
                    }],
                    startTime: new Date().toISOString()
                };

                const response = await axios.post(
                    `${apiUrl}/api/v1/essay/${id}/submit`,
                    submissionData,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.data.success) {
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    router.push(`/scorepage/${id}`);
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred during submission. Please try again.');
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
