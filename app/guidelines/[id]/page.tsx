'use client';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { toast } from "sonner";
import { CheckCircle2, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

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
    const router = useRouter();
    const { id } = useParams();
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const { setQuiz } = useQuiz();
    const { setEssay } = useEssay();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let apiUrl = '';
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                apiUrl = 'http://localhost:4000';
            } else {
                apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '';
            }
        }

        if (id && apiUrl) {
            setIsLoading(true);
            // Fetch Quiz Data
            fetch(`${apiUrl}/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.assignment) {
                        setQuizData(data);
                        setQuiz(data);
                    }
                })
                .catch((error) => console.error('Error fetching quiz data:', error));

            // Fetch Essay Data
            fetch(`${apiUrl}/api/v1/essay/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.essayAssignment) {
                        setEssayData(data);
                        setEssay(data);
                    }
                })
                .catch((error) => console.error('Error fetching essay data:', error))
                .finally(() => setIsLoading(false));
        }
    }, [id, setQuiz, setEssay]);

    const guidelines = quizData?.assignment.guidelines || essayData?.essayAssignment.guidelines || [];
    const title = quizData?.assignment.title || essayData?.essayAssignment.title || 'Assignment Guidelines';
    const timeLimit = quizData?.assignment.timeLimit || essayData?.essayAssignment.timeLimit || 0;

    // Safely store timeLimit
    useEffect(() => {
        if (timeLimit > 0 && typeof window !== 'undefined') {
            localStorage.setItem('timeLimit', timeLimit.toString());
        }
    }, [timeLimit]);

    const handleAccept = () => {
        if (guidelines.length > 0) {
            toast.success("Starting Assignment...", {
                description: "Good luck!",
                duration: 2000,
            });
            router.push(`/assignment/${id}`);
        } else {
            toast.error("No guidelines available", {
                description: "Please contact your instructor if this persists."
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
                <CardHeader className="border-b border-gray-100 pb-8">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center rotate-3 transition-transform hover:rotate-0 duration-300">
                            <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold text-gray-900 font-['Inter']">
                                {title}
                            </CardTitle>
                            <p className="text-gray-500 max-w-lg mx-auto">
                                Please read the following instructions carefully before starting the assignment.
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 pb-8 px-6 sm:px-10">
                    <div className="space-y-6">
                        {guidelines.length > 0 ? (
                            <div className="grid gap-4">
                                {guidelines.map((line, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all duration-200 group"
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <p className="text-gray-700 font-medium leading-relaxed">
                                            {line}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <AlertCircle className="w-10 h-10 text-gray-400 mb-3" />
                                <p className="text-gray-500 font-medium">No specific guidelines provided.</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-500">
                                By clicking accept, you agree to follow these rules.
                            </div>
                            <button
                                type="button"
                                onClick={handleAccept}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold font-['Inter'] tracking-wide shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                I Understand & Accept
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Guidelines;
