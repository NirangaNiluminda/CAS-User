"use client"; // Mark the component as a Client Component

import { useRouter, useParams } from 'next/navigation'; // Use next/navigation in the App Router
import { useEffect, useState } from 'react';

const QuizPage = () => {
    const router = useRouter();
    const { id } = useParams(); // The 'id' corresponds to the dynamic [id] part of the URL

    interface QuizData {
        assignment: {
            title: string;
        };
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);

    useEffect(() => {
        if (id) {
            // Fetch the quiz data based on the ID
            fetch(`http://localhost:4000/api/v1/${id}`)
                .then((response) => response.json())
                .then((data) => setQuizData(data))
                .catch((error) => console.error('Error fetching quiz data:', error));
        }
    }, [id]);

    if (!quizData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Quiz Title: {quizData.assignment.title}</h1>
            {/* Render additional quiz data here */}
        </div>
    );
};

export default QuizPage;
