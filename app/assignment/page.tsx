'use client';
import React, { useState, ChangeEvent } from 'react';
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

  const router = useRouter();

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleShortAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setShortAnswer(event.target.value);
  };

  const handleNext = () => {
    if (selectedAnswer !== null || questions[currentQuestionIndex].answers.length === 0) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: selectedAnswer !== null ? selectedAnswer : shortAnswer,
      }));

      if (currentQuestionIndex === questions.length - 1) {
        // Navigate to Submission Page when all questions are completed
        router.push('/submissionpage');
      } else {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null); // Reset selected answer for the next question
        setShortAnswer(''); // Reset short answer for the next question
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setUserAnswers(prev => ({
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
    <div className="relative min-h-screen bg-white">
      <div className="absolute top-0 left-0 w-full h-[113px] bg-gray-300" />
      <div className="absolute top-[39px] left-[50%] translate-x-[-50%] text-black text-4xl font-bold font-['Inter']">
        Question {currentQuestionIndex + 1}
      </div>
      <div className="flex flex-col items-center absolute top-[130px] left-[50%] translate-x-[-50%] w-full">
        <div className="w-full max-w-5xl text-left text-black text-xl mb-4">
          {questions[currentQuestionIndex].question}
        </div>
        <div className="w-full max-w-5xl">
          {questions[currentQuestionIndex].answers.length > 0 ? (
            <div className="flex flex-col items-start mt-10 pb-20">
              {questions[currentQuestionIndex].answers.map((answer, index) => (
                <div key={index} className="flex items-center mt-2">
                  <div
                    className={`w-4 h-4 rounded-full border border-[#0cdc09] ${
                      selectedAnswer === index ? 'bg-[#0cdc09]' : ''
                    }`}
                    onClick={() => handleAnswerClick(index)}
                  />
                  <div className="text-black text-base font-normal font-['Inter'] ml-2">{answer}</div>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              className="w-full h-32 p-4 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Write your answer here..."
              value={shortAnswer}
              onChange={handleShortAnswerChange}
            />
          )}
        </div>
        <div className="flex justify-between w-full max-w-5xl mt-4">
          <button
            type="button"
            className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
            onClick={handleNext}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
      
      {/* Completed Questions Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[154px] bg-gray-300 flex items-center justify-center space-x-4">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`px-5 py-2.3 rounded-md border-2 border-[#0cdc09] justify-center items-center gap-2.5 inline-flex ${userAnswers[index] !== undefined ? 'bg-[#0cdc09]' : 'bg-transparent'}`}
            style={{ width: '84px' }}
          >
            <div className="w-full flex-col justify-start items-center inline-flex">
              <div className="self-stretch text-center text-black text-[32px] font-bold font-['Inter']">{index + 1}</div>
              <div className="self-stretch h-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignment;
