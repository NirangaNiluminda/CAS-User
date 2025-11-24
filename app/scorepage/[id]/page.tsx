'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { Trophy, ArrowRight, Star, Award, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { toast } from "sonner";

const ScorePage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const [score, setScore] = useState<string | null>(null);
    const [storedId, setStoredId] = useState<string | null>(null);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { setEssay } = useEssay();
    const { setQuiz } = useQuiz();

    // Fix SSR issue by accessing localStorage in useEffect
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sId = localStorage.getItem('id');
            const sScore = sessionStorage.getItem('score');
            setStoredId(sId);
            setScore(sScore);
        }
    }, []);

    useEffect(() => {
        let apiUrl = '';
        if (typeof window !== 'undefined') {
            apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '';
        }

        if (id && apiUrl) {
            setIsLoading(true);
            // Fetch quiz data
            fetch(`${apiUrl}/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.assignment) {
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
                    if (data.essayAssignment) {
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
    }, [id, setQuiz, setEssay]);

    const handleConfirm = () => {
        if (!storedId) {
            toast.error("Session ID not found");
            return;
        }

        if (isQuiz) {
            router.push(`/correct_answers/${storedId}`);
        } else {
            router.push(`/feedback/${storedId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex justify-center items-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden relative">
                {/* Confetti/Decoration Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-50px] left-[20%] w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <CardContent className="p-8 flex flex-col items-center gap-8 relative z-10">

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <div className="relative bg-white p-4 rounded-full shadow-xl">
                            <Trophy className="w-16 h-16 text-yellow-500" />
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 font-['Inter']">Assignment Completed!</h2>
                        <p className="text-gray-500">Great job on finishing the assignment.</p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 px-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-inner w-full">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Your Score</span>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-['Inter']">
                            {score || '0'}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
                            <Award className="w-4 h-4" />
                            <span>Points Earned</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold font-['Inter'] tracking-wide shadow-lg shadow-green-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isQuiz ? 'View Correct Answers' : 'Provide Feedback'}
                        <ArrowRight className="w-5 h-5" />
                    </button>

                </CardContent>
            </Card>
        </div>
    );
};

export default ScorePage;
