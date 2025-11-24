'use client'
import { useRouter } from 'next/navigation'
import React from 'react';

const Guidelines: React.FC = () => {

    const router = useRouter();

    return (
        <div className="w-full min-h-screen flex justify-center items-center py-10 px-4">
            <div className="w-full max-w-3xl p-10 glass-card rounded-[2rem] flex flex-col justify-center items-center gap-12 animate-in fade-in zoom-in duration-700 premium-shadow">
                <div className="text-center space-y-3">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Guidelines</h1>
                    <p className="text-muted-foreground text-base font-medium">Please read the following instructions carefully</p>
                </div>
                
                <div className="w-full space-y-4">
                    {[
                        'Complete all questions within the allocated time',
                        'Ensure stable internet connection throughout the assignment',
                        'Do not refresh or close the browser during the assignment',
                        'Click submit only after reviewing all your answers'
                    ].map((item, index) => (
                        <div key={index} className="flex items-start gap-5 p-6 bg-gradient-to-br from-white to-green-50/50 rounded-2xl border-2 border-green-100 hover:shadow-lg hover:shadow-green-100/50 hover:border-green-200 transition-all duration-300 group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-300/40 group-hover:scale-110 transition-transform duration-300">
                                {index + 1}
                            </div>
                            <div className="flex-1 text-foreground text-base font-medium leading-relaxed pt-1.5">{item}</div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="w-full max-w-md py-4 px-8 gradient-green text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                    onClick={() => router.push('/assignment')}
                >
                    <span className="relative z-10">Accept & Continue</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
            </div>
        </div>
    );
};

export default Guidelines;





