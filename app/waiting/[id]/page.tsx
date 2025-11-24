'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from "sonner";
import { Clock, Calendar, AlertCircle, CheckCircle2, XCircle, Loader2, ArrowRight, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AssignmentDetails {
  _id: string;
  title: string;
  description: string;
  timeLimit: number;
  startDate: string;
  endDate: string;
  teacherId: string;
  success?: boolean;
  intendedBatch: number;
  guidelines?: string[];
}

const WaitingPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [apiUrl, setApiUrl] = useState<string>('');
  const [quizStatus, setQuizStatus] = useState<'pending' | 'active' | 'expired'>('pending');
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isAttempted, setIsAttempted] = useState<boolean>(false);
  const [isQuiz, setIsQuiz] = useState<boolean>(false);
  const [isEssay, setIsEssay] = useState<boolean>(false);

  // Set API URL based on environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        setApiUrl('http://localhost:4000');
      } else {
        setApiUrl(process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://52.64.209.177:4000');
      }
    }
  }, []);

  // Get student ID from user context or session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get user info from session/local storage
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (token) {
        // Decode token or fetch user info
        // For now, we'll need to add the studentId to session storage in SignIn
        const storedStudentId = sessionStorage.getItem('studentId');
        if (storedStudentId) {
          setStudentId(storedStudentId);
        }
      }
    }
  }, []);

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!id || !apiUrl) return;

      try {
        setLoading(true);

        // Try fetching as quiz first
        try {
          const quizResponse = await axios.get(`${apiUrl}/api/v1/${id}?forWaiting=true`);
          if (quizResponse.data && (quizResponse.data.success || quizResponse.data._id)) {
            const assignmentData = quizResponse.data.assignment || quizResponse.data;
            setAssignment(assignmentData);
            setIsQuiz(true);
            setIsEssay(false);

            // Check if student already attempted
            if (studentId && assignmentData.attemptedStudents?.includes(studentId)) {
              setIsAttempted(true);
            }

            setLoading(false);
            return;
          }
        } catch (quizError) {
          // Quiz not found, continue to try essay endpoint
        }

        // If quiz not found, try fetching as essay
        try {
          const essayResponse = await axios.get(`${apiUrl}/api/v1/essay/${id}?forWaiting=true`);
          if (essayResponse.data && (essayResponse.data.success || essayResponse.data.essayAssignment?._id)) {
            const essayData = essayResponse.data.essayAssignment || essayResponse.data;
            setAssignment(essayData);
            setIsEssay(true);
            setIsQuiz(false);

            // Check if student already attempted
            if (studentId && essayData.attemptedStudents?.includes(studentId)) {
              setIsAttempted(true);
            }

            setLoading(false);
            return;
          }
        } catch (essayError) {
          throw new Error('Assignment not found in either quiz or essay collections');
        }

        setError('Failed to load assignment information');
        toast.error('Failed to load assignment information');

      } catch (error) {
        console.error('Error fetching assignment details:', error);
        setError('Failed to load assignment information. Please try again later.');
        toast.error('Error fetching assignment details');
      } finally {
        setLoading(false);
      }
    };

    if (apiUrl) {
      fetchAssignmentDetails();
    }
  }, [id, apiUrl, studentId]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate time remaining and check quiz status
  useEffect(() => {
    if (!assignment) return;

    const calculateTimeStatus = (): void => {
      const startDate = new Date(assignment.startDate);
      const endDate = new Date(assignment.endDate);
      const now = new Date();

      if (now > endDate) {
        setQuizStatus('expired');
        return;
      }

      if (now >= startDate) {
        setQuizStatus('active');
        return;
      }

      // If assignment hasn't started yet, calculate time remaining
      setQuizStatus('pending');
      const difference = startDate.getTime() - now.getTime();

      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    const updateTimeStatus = () => {
      calculateTimeStatus();
    };

    updateTimeStatus();
    const timer = setInterval(updateTimeStatus, 1000);

    return () => clearInterval(timer);
  }, [assignment, currentTime]);

  // Handle proceed to assignment
  const handleProceed = async () => {
    if (quizStatus !== 'active') {
      toast.error('Quiz is not active yet');
      return;
    }

    // Check if student already attempted
    if (isAttempted) {
      toast.error('You have already attempted this assignment.');
      return;
    }

    if (!studentId) {
      toast.error('Student information not found. Please sign in again.');
      router.push(`/signin/${id}`);
      return;
    }

    try {
      // Mark student as attempted before proceeding
      if (isQuiz) {
        await axios.put(`${apiUrl}/api/v1/${assignment?._id}/attemptedStudents`, {
          studentId: studentId,
          assignmentId: assignment?._id,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else if (isEssay) {
        await axios.put(`${apiUrl}/api/v1/essay/${assignment?._id}/attemptedStudents`, {
          studentId: studentId,
          assignmentId: assignment?._id,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // Navigate to quiz page after successfully marking as attempted
      router.push(`/modulepage/${id}`);
    } catch (error) {
      console.error('Error updating attempted students:', error);
      toast.error('Failed to start assignment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading assignment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-red-100">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
            <p className="text-gray-500 mb-6">The assignment you are looking for does not exist or has been removed.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
            >
              Return Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Column: Status & Timer */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{assignment.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{assignment.description}</p>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${quizStatus === 'active' ? 'bg-green-500 animate-pulse' :
                quizStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              <span className="text-sm font-medium text-gray-600 capitalize">{quizStatus} Status</span>
            </div>
          </div>

          {quizStatus === 'pending' && timeRemaining && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">Starts In</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Days', value: timeRemaining.days },
                  { label: 'Hours', value: timeRemaining.hours },
                  { label: 'Mins', value: timeRemaining.minutes },
                  { label: 'Secs', value: timeRemaining.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-2 border border-gray-100">
                      <span className="text-2xl md:text-3xl font-bold text-gray-900 tabular-nums">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quizStatus === 'active' && (
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Session is Live</h3>
                  <p className="text-green-700">You can now access the assignment.</p>
                </div>
              </div>
              <button
                onClick={handleProceed}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 group"
              >
                Start Assignment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {quizStatus === 'expired' && (
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Session Expired</h3>
                  <p className="text-red-700">The submission window has closed.</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Details Card */}
        <div className="order-1 lg:order-2">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="border-b border-gray-100 pb-6">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.timeLimit} Minutes</p>
                    <p className="text-xs text-gray-400 mt-1">Once started, the timer cannot be paused.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Window</p>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700">
                          Starts: {new Date(assignment.startDate).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-sm text-gray-700">
                          Ends: {new Date(assignment.endDate).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                {assignment.guidelines && assignment.guidelines.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-blue-600" />
                      Guidelines
                    </h3>
                    <ul className="space-y-2">
                      {assignment.guidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="bg-yellow-50 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    <strong>Important:</strong> Ensure you have a stable internet connection. Do not refresh the page once the exam starts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2 mt-0.5">⚠️</span>
              <p className="text-sm text-gray-700">
                {quizStatus === 'pending' ?
                  "Please make sure you're ready before the assignment starts. Once you begin, the timer will start counting down and you'll need to complete all questions within the time limit." :
                  quizStatus === 'active' ?
                    "The assignment is currently active. Make sure to complete it before the end time." :
                    "This assignment can no longer be attempted as the time window has passed."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;