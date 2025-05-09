'use client'
require("dotenv").config();
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
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
    intendedBatch: number;
    attemptedStudents: string[];
}

const SignIn = () => {
    const router = useRouter();
    const { id } = useParams();
    const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [batch, setBatch] = useState<number | null>(null);
    const [isEssay, setIsEssay] = useState<boolean>(false);
    const [isQuiz, setIsQuiz] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        registrationNumber: '',
        password: '',
    })

    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    }

    const { user, setUser } = useUser();
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // This will run only on the client side
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl(process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://52.64.209.177:4000');
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
                    const quizResponse = await axios.get(`${apiUrl}/api/v1/${id}`);
                    if (quizResponse.data && (quizResponse.data.success || quizResponse.data._id)) {
                        setAssignment(quizResponse.data.assignment || quizResponse.data);
                        setLoading(false);
                        setIsQuiz(true);
                        setIsEssay(false);
                        return; // Successfully found quiz, exit function
                    }
                } catch (quizError) {
                    // Quiz not found, continue to try essay endpoint
                }

                // If quiz not found, try fetching as essay
                try {
                    const essayResponse = await axios.get(`${apiUrl}/api/v1/essay/${id}`);
                    if (essayResponse.data && (essayResponse.data.success || essayResponse.data.essayAssignment?._id)) {
                        // Format essay assignment to match expected AssignmentDetails structure
                        const essayData = essayResponse.data.essayAssignment || essayResponse.data;
                        setAssignment(essayData);
                        setLoading(false);
                        setIsEssay(true);
                        setIsQuiz(false);
                        return; // Successfully found essay, exit function
                    }
                } catch (essayError) {
                    // Essay not found either
                    throw new Error('Assignment not found in either quiz or essay collections');
                }

                // If we get here, neither endpoint returned valid data
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

    const handleSignIn = async () => {
        // console.log(user, assignment, formData, rememberMe);
        // console.log(user?.batch, assignment?.intendedBatch, user?.repeatingBatch);
        try {
            const response = await axios.post(`${apiUrl}/api/v1/login-user`, {
                registrationNumber: formData.registrationNumber,
                password: formData.password,
            })

            if ((response.status === 200 || response.data.success)) {
                // Check if the user is already logged in
                const token = response.data.accessToken; // accesstoken
                sessionStorage.setItem('name', response.data.user.name);
                setBatch(response.data.user.batch);
                setUser(response.data.user);

                console.log(user, assignment, formData, response.data.user, rememberMe);
                console.log(user?.batch, assignment?.intendedBatch, user?.repeatingBatch, batch);

                if (assignment?.intendedBatch === user?.batch || assignment?.intendedBatch === user?.repeatingBatch) {
                    if (assignment?.intendedBatch === user?.batch || assignment?.intendedBatch === user?.repeatingBatch) {
                        if (assignment?.attemptedStudents && user?._id && assignment.attemptedStudents.includes(user._id)) {
                            // alert('You have already attempted this assignment.');
                            toast.error('You have already attempted this assignment.');
                        }
                        else {
                            // update the attemptedStudents array in the assignment



                            if (rememberMe) {
                                localStorage.setItem('token', token);
                            } else {
                                sessionStorage.setItem('token', token);
                            }
                            setUser(response.data.user)
                            toast.success('Sign in successful!');

                            //try for mcq
                            if (isQuiz) {
                                try {
                                    await axios.put(`${apiUrl}/api/v1/${assignment?._id}/attemptedStudents`, {
                                        studentId: user?._id,
                                        assignmentId: assignment?._id,
                                    }, {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    router.push(`/waiting/${id}`);

                                } catch (error) {
                                    console.error('Error updating attempted students for quiz:', error);
                                }
                            }
                            else if (isEssay) {
                                //try for essay
                                try {
                                    await axios.put(`${apiUrl}/api/v1/essay/${assignment?._id}/attemptedStudents`, {
                                        studentId: user?._id,
                                        assignmentId: assignment?._id,
                                    }, {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    router.push(`/waiting/${id}`);

                                } catch (error) {
                                    throw new Error('Failed to update attempted students for either essay or mcq');
                                }
                            }
                        }
                    }
                    else {
                        // alert('You are not eligible for this assignment.');
                        toast.error('You are not eligible for this assignment.');
                    }
                }
            }
            else {
                // alert('Invalid credentials or you are not eligible for this assignment.');
                toast.error('Invalid credentials');
            }
        }
        catch (error) {
            // console.error('Error during sign in:', error);
            alert(`An error occurred. Please try again. ${error}`);
            toast.error('Error during sign in');
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className="w-[830px] h-[640px] flex flex-col justify-center items-center gap-[42px]">
                <div className="self-stretch h-[25px] text-center text-black text-[32px] font-bold font-['Inter']">Sign in</div>
                <Image className="w-[273px] h-60" src="/SignIn.png" alt='sign in image' width={380} height={380} />
                <div className="self-stretch flex flex-col justify-center items-center gap-[20px]">
                    <div className="flex gap-[86px]">
                        <div className="h-[68px] relative">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Index</label>
                            <input type="text" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="EG/XXXX/XXXX" />
                        </div>
                        <div className="h-[68px] relative">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Password" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full mt-4">
                        <div className="flex items-center">
                            <input id="rememberMe" type="radio" checked={rememberMe} onChange={handleRememberMeChange} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember Me</label>
                        </div>
                        <div className="flex items-center">
                            <div className="w-[169px] h-4 text-black text-xl font-medium font-['Inter'] cursor-pointer">Forgot Password ?</div>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSignIn}
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"

                >
                    Sign in
                </button>
                <div className="flex flex-row items-center gap-2">
                    <div className="text-black text-xl font-light font-['Inter']">Don&apos;t have an account?</div>
                    <button
                        onClick={() => router.push(`/signup/${id}`)}
                        className="text-blue-500 hover:underline text-xl font-bold font-['Inter']"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
