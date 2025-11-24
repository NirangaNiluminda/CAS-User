'use client'
import { useQuiz } from '@/context/QuizContext'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

const Page = () => {

  const { quiz, setQuiz } = useQuiz();
  const { id } = useParams();
  const router = useRouter();

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('id');
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
      fetch(`${apiUrl}/api/v1/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setQuizData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching quiz data:', error);
          setIsLoading(false);
        });
    }
  }, [id]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 w-full" />
          <CardHeader className="pb-8 pt-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900 font-['Inter']">
                  {quizData?.assignment.title}
                </CardTitle>
                <p className="text-gray-500">Review the correct answers below</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Questions List */}
        <div className="space-y-6">
          {quizData?.assignment.questions.map((question, index) => (
            <Card key={question?._id} className="shadow-md border-0 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 sm:p-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {index + 1}
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {question?.questionText}
                    </h3>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Correct Answer</span>
                          <ul className="space-y-1">
                            {question?.options
                              .filter((option) => option.isCorrect)
                              .map((correctOption) => (
                                <li key={correctOption._id} className="text-gray-900 font-medium">
                                  {correctOption.text}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Action */}
        <div className="flex justify-center pt-8 pb-12">
          <button
            type="button"
            onClick={() => router.push(`/feedback/${id}`)}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold font-['Inter'] tracking-wide shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Continue to Feedback
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Page;