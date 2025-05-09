'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from "sonner";

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

  // Set API URL based on environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        setApiUrl('http://localhost:4000');
      } else {
        setApiUrl( process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://52.64.209.177:4000');
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
            setAssignment(quizResponse.data.assignment || quizResponse.data);
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
  }, [id, apiUrl]);

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
  const handleProceed = () => {
    if (quizStatus === 'active') {
      router.push(`/modulepage/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
          <div className="mt-4 text-xl font-medium">Loading assignment information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-center mb-4">Error</h1>
          <p className="text-center mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-yellow-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-center mb-4">Assignment Not Found</h1>
          <p className="text-center mb-6">We couldn&apos;t find the assignment you&apos;re looking for.</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-500 p-6 text-white">
          <h1 className="text-2xl font-bold font-['Inter']">{assignment.title}</h1>
          <p className="mt-1 text-green-50">
            {quizStatus === 'pending' ? 'Waiting for assignment to start' : 
             quizStatus === 'active' ? 'Assignment is active' : 'Assignment has expired'}
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-8 flex justify-center">
            <div className="w-48 h-48 bg-green-200 rounded-full flex items-center justify-center">
              <div className="text-6xl">
                {quizStatus === 'pending' ? '⏱️' : 
                 quizStatus === 'active' ? '🚀' : '❌'}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Assignment Details</h2>
            <p className="text-gray-600">{assignment.description}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Time Limit</p>
                <p className="font-medium">{assignment.timeLimit} minutes</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium">{new Date(assignment.startDate).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">End Time</p>
                <p className="font-medium">{new Date(assignment.endDate).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Current Status</p>
                <p className="font-medium capitalize">{quizStatus}</p>
              </div>
            </div>
          </div>
          
          {quizStatus === 'pending' && timeRemaining ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Time Until Assignment Starts</h2>
              
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{timeRemaining.days}</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{timeRemaining.hours}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{timeRemaining.minutes}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{timeRemaining.seconds}</div>
                  <div className="text-xs text-gray-500">Seconds</div>
                </div>
              </div>
              
              <p className="text-center mt-4 text-sm text-gray-600">
                This page will automatically redirect you when the assignment starts
              </p>
            </div>
          ) : quizStatus === 'active' ? (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">Assignment has started!</h2>
              <p className="text-center text-gray-600 mb-4">
                You can now proceed to enter the assignment.
              </p>
              <button
                onClick={handleProceed}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors focus:outline-none font-bold font-['Inter'] tracking-wider"
              >
                Proceed to Assignment
              </button>
            </div>
          ) : (
            <div className="bg-red-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">Assignment has expired</h2>
              <p className="text-center text-gray-600 mb-4">
                The time window for this assignment has passed. You can no longer attempt it.
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors focus:outline-none font-bold font-['Inter'] tracking-wider"
              >
                Return to Home
              </button>
            </div>
          )}
          
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