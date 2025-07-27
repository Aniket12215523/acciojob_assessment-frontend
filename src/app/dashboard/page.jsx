'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import ChatLayout from '@/components/ChatLayout';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [model, setModel] = useState('gemma-7b-it');
  const [name, setName] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || !user._id) {
      router.push('/');
      return;
    }
    fetchSessions();
  }, [user, loading]);

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/sessions/user/${user._id}`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const createSession = async () => {
    if (!user?._id) return alert("User not found");
    const payload = { name, userId: user._id, model, memory: '' };

    try {
      const res = await api.post('/sessions/new', payload);
      await fetchSessions();
      router.push(`/chat/${res.data.sessionId}`);
    } catch (err) {
      console.error("Session creation failed:", err);
    }
  };

  const deleteSession = async (id) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <ChatLayout
      sessions={sessions}
      onSessionClick={(id) => router.push(`/chat/${id}`)}
      onNewChat={createSession}
      selectedModel={model}
      setSelectedModel={setModel}
      setSessions={setSessions}
    >
      <div className="w-full min-h-screen px-4 sm:px-6 py-8 bg-gradient-to-br from-slate-50 to-slate-200 animate-fade-in duration-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center animate-slide-in-down mt-16 sm:mt-0">
        Welcome to your AI Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-md animate-slide-in-up">
          <input
            placeholder="Session Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full sm:flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            <option value="gemma-7b-it">Gemma-7B-IT</option>
            <option value="groq/llama3-8b-8192">LLaMA3-8B</option>
            <option value="groq/llama3-70b-8192">LLaMA3-70B</option>
            <option value="groq/mixtral-8x7b-32768">Mixtral-8x7B</option>
          </select>
          <button
            onClick={createSession}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200"
          >
            + Create Session
          </button>
        </div>
      </div>
    </ChatLayout>
  );
}
