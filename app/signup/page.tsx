'use client'

import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const SignUp: React.FC = () => {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    batch: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This will run only on the client side
      if (window.location.hostname === 'localhost') {
        setApiUrl('http://localhost:4000');
      } else {
        //setApiUrl(`${process.env.AWS_URL}`);
        setApiUrl(process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://52.64.209.177:4000');
      }
    }
  }, []);
  const handleSignUp = async () => {
    // console.log({
    //   name: formData.name,
    //   email: formData.email,
    //   password: formData.password,
    //   registrationNumber: formData.registrationNumber,
    // });
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 2000,
      });
      return
    }
    if (!formData.batch) {
      toast.error('PPlease select your batch', {
        duration: 2000,
      });
      return
    }
    try {
      const response = await axios.post(`${apiUrl}/api/v1/registration`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        registrationNumber: formData.registrationNumber,
        batch: parseInt(formData.batch),
      });

      if (response.status === 201 || response.data.success) {
        if (response.data.activationToken) {
          const token = response.data.activationToken;
          toast.success('Registration successful! Please check your email to activate your account.', {
            duration: 2000,
          });
          router.push(`/activate?token=${token}`);
        } else {
          // Registration successful, and no activation needed
          router.push('/dashboard');
        }
      } else {
        // Handle error response
        toast.error('Registration failed. Please try again.', {
          duration: 2000,
        });

      }
    } catch (error) {
      // Handle error
      console.error('Error during registration:', error);
      toast.error('An error occurred. Please try again.', {
        duration: 2000,
      });
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center py-6 px-4 overflow-hidden'>
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-green-100 text-foreground hover:bg-green-50 hover:border-green-200 transition-all duration-300 shadow-lg hover:shadow-xl z-50 group"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:-translate-x-1 transition-transform duration-300">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="w-full max-w-lg p-5 glass-card rounded-[2rem] flex flex-col justify-start items-center gap-3 animate-in fade-in zoom-in duration-700 premium-shadow">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Create Account</h1>
          <p className="text-muted-foreground text-xs font-medium">Join us to get started</p>
        </div>

        <div className="w-full space-y-2">
          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground">Index</label>
            <input type="text" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full px-4 py-2 input-premium text-foreground placeholder:text-muted-foreground font-medium" placeholder="EG/XXXX/XXXX" />
          </div>

          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground">Name</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 input-premium text-foreground placeholder:text-muted-foreground font-medium" placeholder="Perera A.B.C." />
          </div>

          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 input-premium text-foreground placeholder:text-muted-foreground font-medium" placeholder="name@example.com" />
          </div>

          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground">Batch</label>
            <select
              id="batch"
              value={formData.batch}
              onChange={handleChange}
              className="w-full px-4 py-2 input-premium text-foreground font-medium"
            >
              <option value="" className="bg-white text-muted-foreground">Select your batch</option>
              <option value="22" className="bg-white">Batch 22</option>
              <option value="23" className="bg-white">Batch 23</option>
              <option value="24" className="bg-white">Batch 24</option>
              <option value="25" className="bg-white">Batch 25</option>
              <option value="26" className="bg-white">Batch 26</option>
              <option value="27" className="bg-white">Batch 27</option>
              <option value="28" className="bg-white">Batch 28</option>
            </select>
          </div>

          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} id="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 pr-10 input-premium text-foreground placeholder:text-muted-foreground font-medium" placeholder="••••••••" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 pr-10 input-premium text-foreground placeholder:text-muted-foreground font-medium" placeholder="••••••••" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignUp}
          className="w-full py-2.5 px-8 gradient-green text-white font-bold text-base rounded-2xl shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10">Sign up</span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>

        <div className="flex flex-row items-center gap-2 text-base">
          <div className="text-muted-foreground font-medium">Already have an account?</div>
          <button
            onClick={() => router.push('/signin')}
            className="text-primary font-bold hover:underline hover:text-emerald-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
