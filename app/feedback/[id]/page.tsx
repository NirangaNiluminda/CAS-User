'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner";
import { MessageSquare, Send, SkipForward, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    feedback: '',
    assignmentId: id,
  });

  // Initialize API URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '';
      setApiUrl(url);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.feedback.trim()) {
      setError('Please provide some feedback before submitting.');
      toast.error('Feedback cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/feedback/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ feedback: form.feedback, assignmentId: form.assignmentId }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast.success('Thank you for your feedback!', {
        description: 'Your input helps us improve.',
        duration: 2000,
      });
      router.push('/completed');
    } catch (error) {
      toast.error('Failed to submit feedback');
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
        <CardHeader className="border-b border-gray-100 pb-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center rotate-3 transition-transform hover:rotate-0 duration-300">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900 font-['Inter']">
                We Value Your Feedback
              </CardTitle>
              <p className="text-gray-500 max-w-md mx-auto">
                How was your experience with this assignment? Your thoughts help us create better learning materials.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-8 px-6 sm:px-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Your Comments
              </label>
              <textarea
                className="w-full min-h-[200px] p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 resize-none font-['Inter']"
                placeholder="Share your thoughts about the questions, difficulty, or any issues you faced..."
                value={form.feedback}
                onChange={(e) => {
                  setForm({ ...form, feedback: e.target.value });
                  setError('');
                }}
              />
              {error && (
                <p className="text-sm text-red-500 font-medium animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold font-['Inter'] tracking-wide shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>

              <button
                onClick={() => router.push('/completed')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-bold font-['Inter'] tracking-wide transition-all"
              >
                Skip for Now
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page