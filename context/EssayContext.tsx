'use client'

import { createContext, useContext, useState } from "react";


interface Question {
    questionText: string;
    _id: string;
    answers: string;
}

interface Essay {
    _id: string;
    title: string;
    questions: Question[];
    description: string;
    teacherId: string;
    timeLimit: number;
    createdAt: string;
    updatedAt: string;
}

interface EssayContextType {
    essay: Essay | null;
    setEssay: React.Dispatch<React.SetStateAction<Essay | null>>;
}

const EssayContext = createContext<EssayContextType | undefined>(undefined);

export const useEssay = () => {
    const context = useContext(EssayContext);
    if (!context) {
        throw new Error("useEssay must be used within an EssayContextProvider");
    }
    return context;
}

export const EssayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [essay, setEssay] = useState<Essay | null>(null);

    return (
        <EssayContext.Provider value={{ essay, setEssay }}>
            {children}
        </EssayContext.Provider>
    );
}