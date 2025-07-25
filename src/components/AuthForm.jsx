'use client'
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
    <div className="p-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">{isRegister ? 'Register' : 'Login'}</h2>

      {isRegister && (
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mt-4"
        />
      )}
      
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mt-4"
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mt-2"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAuth}
          className="bg-blue-500 text-white px-4 py-2"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-gray-600 underline"
        >
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
}
