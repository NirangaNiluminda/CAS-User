'use client'
import { useQuiz } from '@/context/QuizContext'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

  const { quiz, setQuiz } = useQuiz();
  const { id } = useParams();

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
    <div className="container mx-auto p-4">
      {quizData ? (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4">Correct Answers for: {quizData?.assignment.title}</h2>
          <div className='space-y-4'>
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
        </div>
      ) : (
        <p>Loading quiz data...</p>
      )}
    </div>
  );
}

export default page