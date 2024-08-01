import React from 'react';

const SignUp: React.FC = () => {

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className="w-[372px] h-[635px] flex flex-col justify-start items-center gap-[27px]">
                <div className="self-stretch h-7 text-center text-black text-[32px] font-bold font-['Inter']">Signing you UP!</div>

                <div className="h-[68px] relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Index</label>
                    <input type="text" id="index" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="EG/XXXX/XXXX" />
                </div>

                <div className="h-[68px] relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="name" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Perera A.B.C." />
                </div>

                <div className="h-[68px] relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" id="email" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="name@flowbite.com" />
                </div>

                <div className="h-[68px] relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Password" />
                </div>

                <div className="h-[68px] relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                    <input type="password" id="confirm-password" className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Confirm Password" />
                </div>

                <button
                    type="button"
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                >
                    Sign up
                </button>

                <div className="flex flex-row items-center gap-2">
                    <div className="text-black text-xl font-light font-['Inter']">Already have an account?</div>
                    <button 
                        className="text-blue-500 hover:underline text-xl font-bold font-['Inter']"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
