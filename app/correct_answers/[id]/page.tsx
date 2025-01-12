'use client'
import { useQuiz } from '@/context/QuizContext'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

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



  useEffect(() => {
    const id = localStorage.getItem('id');
    console.log(id);
    let apiUrl;
    // Determine the correct API URL based on the hostname
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        apiUrl = 'http://localhost:4000';
      } else {
        apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
        console.log('Deployment URL:', apiUrl);
      }
    }
    if (id) {
      fetch(`${apiUrl}/api/v1/${id}`)
        .then((response) => response.json())
        .then((data) => setQuizData(data))
        .catch((error) => console.error('Error fetching quiz data:', error));

    }
    // console.log(studentId); // checking whether the user is logged in or not
    // setLength(quizData?.assignment.questions.length ?? null); // Update the length state
  }, [id]);

  return (
    <div className="container mx-auto p-4 flex justify-center">
      {quizData ? (
        <div className="mb-4">
          <div className='flex w-full h-[113px] justify-center items-center'>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Correct Answers for: {quizData?.assignment.title}</h2>
          </div>
          <div className='space-y-4 mt-5'>
            {quizData?.assignment.questions.map((question) => (
              <div key={question?._id}>
                <h3>Question: {question?.questionText}</h3>
                <ul>
                  {question?.options
                    .filter((option) => option.isCorrect)
                    .map((correctOption) => (
                      <li key={correctOption._id}>Correct Answer: {correctOption.text}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-5'>
            <button
              type="button"
              className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110"
              onClick={() => router.push('/completed')}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <p>Loading quiz data...</p>
      )}
    </div>
  );
}

export default page