'use client'

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useEssay } from '@/context/EssayContext';
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { Lock, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface QuizData {
    id: string;
    assignment: {
        password: string;
        title: string;
    };
}

interface EssayData {
    id: string;
    essayAssignment: {
        password: string;
        title: string;
    };
}

const ModulePage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const { id } = useParams();

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [password, setPassword] = useState('');
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const { setEssay } = useEssay();
    const { setQuiz } = useQuiz();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined' && id) {
            localStorage.setItem('id', id as string);
        }

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

    const handleEnter = () => {
        const correctPassword = quizData?.assignment.password || essayData?.essayAssignment.password;

        if (password === correctPassword) {
            toast.success('Access Granted', {
                description: 'Redirecting to guidelines...',
                duration: 2000,
            });
            router.push(`/guidelines/${id}`);
        } else {
            toast.error('Incorrect Password', {
                description: 'Please check the password and try again.',
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEnter();
        }
    };

    const title = quizData?.assignment.title || essayData?.essayAssignment.title || 'Loading...';

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 w-full" />
                <CardContent className="p-8 flex flex-col items-center gap-6">

                    {/* Header Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
                            <BookOpen className="w-10 h-10 text-green-600" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 font-['Inter'] tracking-tight">
                            {isLoading ? (
                                <span className="animate-pulse bg-gray-200 rounded h-8 w-48 inline-block"></span>
                            ) : (
                                title
                            )}
                        </h1>
                        <p className="text-sm text-gray-500">Enter the access code to proceed</p>
                    </div>

                    {/* Input Section */}
                    <div className="w-full space-y-4 mt-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                placeholder="Enter Access Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleEnter}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : 'Access Module'}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-xs text-gray-400">
                            Protected Content • Secure Access
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModulePage;
