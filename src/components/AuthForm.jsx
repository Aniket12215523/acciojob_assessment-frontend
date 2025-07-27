'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export default function AuthForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    try {
      const payload = isRegister ? { name, email, password } : { email, password };
      const route = isRegister ? 'register' : 'login';
      const res = await api.post(`/auth/${route}`, payload);
      const { user, token } = res.data;
      login(user, token);
      router.push('/dashboard');
    } catch (err) {
      alert('Authentication failed');
      console.error('Auth Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        {isRegister && (
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
          onClick={handleAuth}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition-all duration-200"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="ml-1 text-indigo-500 hover:underline font-medium transition"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
