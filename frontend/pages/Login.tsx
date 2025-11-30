import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

type AuthMode = 'LOGIN' | 'REGISTER';

export const Login: React.FC = () => {
  const { login, register } = useStore();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        if (mode === 'LOGIN') {
            await login(email, password);
        } else {
            if (!name) throw new Error("Name is required");
            await register(name, email, password, role);
        }
        navigate('/dashboard');
    } catch (err: any) {
        setError(err.message || "An error occurred");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
      setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
      setError(null);
      // Reset sensitive fields
      setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-fade-in-up">
        
        {/* Left Side - Visuals */}
        <div className="md:w-5/12 bg-gray-50 p-8 flex flex-col justify-between relative overflow-hidden border-r border-gray-100">
             <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl mb-2">
                    <GraduationCap className="h-8 w-8" />
                    <span>DynamixLMS</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mt-8">
                    {mode === 'LOGIN' ? 'Welcome Back!' : 'Start Learning'}
                </h2>
                <p className="text-gray-500 mt-4 leading-relaxed">
                    {mode === 'LOGIN' 
                        ? 'Log in to continue your courses and track your progress.' 
                        : 'Join our community of learners and teachers to unlock your potential.'}
                </p>
             </div>

             <div className="relative z-10 mt-8">
                 <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm text-sm text-gray-600">
                    <p className="font-semibold text-gray-800 mb-2">Demo Credentials:</p>
                    <div className="flex justify-between items-center mb-1">
                        <span>Teacher:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">teacher@demo.com</code>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Student:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">student@demo.com</code>
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-400">Password: 'password'</div>
                 </div>
             </div>
             
             {/* Decorative circles */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
             <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-8 flex space-x-4 border-b">
                    <button 
                        onClick={() => mode !== 'LOGIN' && toggleMode()}
                        className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${mode === 'LOGIN' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => mode !== 'REGISTER' && toggleMode()}
                        className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${mode === 'REGISTER' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <span className="block w-1.5 h-1.5 bg-red-600 rounded-full" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'REGISTER' && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900"
                                    placeholder="Jane Doe"
                                    required={mode === 'REGISTER'}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {mode === 'REGISTER' && (
                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium text-gray-700">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole(UserRole.STUDENT)}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === UserRole.STUDENT ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                    <span className="font-semibold">Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole(UserRole.TEACHER)}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === UserRole.TEACHER ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                    <span className="font-semibold">Teacher</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-200"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
                
                <p className="mt-8 text-xs text-center text-gray-400">
                    By continuing, you agree to the Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};