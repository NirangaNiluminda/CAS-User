'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define an interface for the question structure
interface Question {
  question: string;
  answers: string[];
}

// Define an interface for storing user answers
interface UserAnswers {
  [index: number]: number | string; // index is question index, value is either selected answer index or short answer
}


const questions: Question[] = [
  // Your questions array here
  // Omitted for brevity
  {
    question: 'What does CPU stand for?',
    answers: ['Central Processing Unit', 'Central Programming Unit', 'Computer Programming Unit', 'Centralized Processing Unit'],
  },
  {
    question: 'What is the primary function of RAM in a computer?',
    answers: ['Temporary data storage for quick access', 'Storage of permanent data', 'Processing graphics', 'Power supply'],
  },
  {
    question: 'Which of the following is an example of a non-volatile memory?',
    answers: ['Hard Disk Drive (HDD)', 'RAM', 'Cache', 'CPU Registers'],
  },
  {
    question: 'Please provide a short answer to the following question:',
    answers: [], // Empty array to indicate it's a short answer question
  },
  {
    question: 'What is the purpose of an operating system?',
    answers: ['Manage hardware resources and provide services for computer programs', 'Design computer hardware', 'Perform mathematical calculations', 'Connect to the internet'],
  },
  {
    question: 'Which of the following programming languages is known for its use in web development?',
    answers: ['JavaScript', 'C++', 'Python', 'Assembly'],
  },
  {
    question: 'What does the acronym HTTP stand for?',
    answers: ['Hypertext Transfer Protocol', 'High Transfer Text Protocol', 'Hyperlink Transfer Protocol', 'High Text Transfer Protocol'],
  },
  {
    question: 'In computing, what is an algorithm?',
    answers: ['A set of rules or steps for solving a problem', 'A type of hardware', 'A software application', 'A data storage method'],
  },
  {
    question: 'What is the function of a GPU in a computer system?',
    answers: ['Perform calculations for graphics and video rendering', 'Manage memory allocation', 'Control input and output devices', 'Execute general-purpose computations'],
  },
  {
    question: 'Which of the following is a primary component of a computer’s motherboard?',
    answers: ['All of the above', 'Graphics Processing Unit (GPU)', 'Central Processing Unit (CPU)', 'Random Access Memory (RAM)'],
  },
];

const Assignment: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(120); // Countdown time in seconds (2 minutes)

  const router = useRouter();

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Time's up, navigate to submission page
      router.push('/submissionpage');
    }
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleShortAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setShortAnswer(event.target.value);
  };

  const handleNext = () => {
    if (selectedAnswer !== null || questions[currentQuestionIndex].answers.length === 0) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : shortAnswer,
      }));

      if (currentQuestionIndex === questions.length - 1) {
        router.push('/submissionpage');
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShortAnswer('');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : shortAnswer,
      }));

      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = userAnswers[currentQuestionIndex - 1];
      setSelectedAnswer(typeof prevAnswer === 'number' ? prevAnswer : null);
      setShortAnswer(typeof prevAnswer === 'string' ? prevAnswer : '');
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[120px] glass-panel border-b border-green-100" />
      <div className="absolute top-[45px] left-[50%] translate-x-[-50%] text-center">
        <div className="text-4xl font-black mb-2 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
          Question {currentQuestionIndex + 1}
        </div>
        <div className="text-muted-foreground text-sm font-medium">of {questions.length}</div>
      </div>
      <div className="flex flex-row px-4">
        {/* Main Quiz Content */}
        <div className="flex flex-col items-center absolute top-[150px] left-[50%] translate-x-[-50%] w-full max-w-5xl">
          <div className="w-full p-8 glass-card rounded-3xl mb-6 premium-shadow">
            <div className="text-foreground text-2xl font-bold mb-8 leading-relaxed">
              {questions[currentQuestionIndex].question}
            </div>
            {questions[currentQuestionIndex].answers.length > 0 ? (
              <div className="flex flex-col gap-4">
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedAnswer === index 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-primary shadow-lg shadow-green-200/50' 
                        : 'bg-white border-green-100 hover:border-green-200 hover:shadow-md hover:shadow-green-100/30'
                    }`}
                    onClick={() => handleAnswerClick(index)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedAnswer === index 
                        ? 'border-primary bg-primary shadow-md shadow-green-200' 
                        : 'border-green-300 bg-white'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="text-foreground text-base font-medium flex-1">{answer}</div>
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full h-40 p-5 rounded-2xl input-premium text-foreground placeholder:text-muted-foreground font-medium resize-none"
                placeholder="Write your answer here..."
                value={shortAnswer}
                onChange={handleShortAnswerChange}
              />
            )}
          </div>
          <div className="flex justify-between w-full gap-4">
            <button
              type="button"
              className="py-4 px-8 bg-white text-foreground border-2 border-green-200 font-bold text-lg rounded-2xl hover:bg-green-50 hover:border-green-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-green-100/30"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="py-4 px-8 gradient-green text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
              onClick={handleNext}
            >
              <span className="relative z-10">{currentQuestionIndex === questions.length - 1 ? 'Submit ✓' : 'Next →'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* Timer Section */}
        <div className="absolute top-[150px] right-[5%] glass-card p-6 rounded-3xl min-w-[200px] premium-shadow">
          <div className="text-foreground text-lg font-semibold mb-3 text-center">Time Remaining</div>
          <div className={`text-4xl font-black text-center transition-colors duration-300 ${
            timeLeft <= 60 ? 'text-destructive animate-pulse' : 'text-primary'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <div className="mt-4 w-full bg-green-100 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-emerald-600 transition-all duration-1000"
              style={{ width: `${(timeLeft / 120) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completed Questions Bar */}
      <div className="fixed bottom-0 left-0 w-full glass-panel border-t border-green-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-all duration-300 cursor-pointer ${
                userAnswers[index] !== undefined 
                  ? 'gradient-green text-white shadow-lg shadow-green-300/50 scale-110' 
                  : 'bg-white border-2 border-green-200 text-muted-foreground hover:border-green-300 hover:scale-105'
              } ${currentQuestionIndex === index ? 'ring-4 ring-primary ring-offset-2' : ''}`}
              onClick={() => {
                setUserAnswers((prev) => ({
                  ...prev,
                  [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : shortAnswer,
                }));
                setCurrentQuestionIndex(index);
                const answer = userAnswers[index];
                setSelectedAnswer(typeof answer === 'number' ? answer : null);
                setShortAnswer(typeof answer === 'string' ? answer : '');
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignment;


