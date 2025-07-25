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
      <h1 className="text-xl font-bold">Welcome to AI Dashboard</h1>

      <div className="mt-4 flex gap-2">
        <input
          placeholder="Session Name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
          value={name}
        />
        <select
          onChange={(e) => setModel(e.target.value)}
          value={model}
          className="border p-2"
        >
          <option value="groq/gemma-7b-it">Gemma-7B-IT</option>
          <option value="groq/llama3-8b-8192">LLaMA3-8B</option>
          <option value="groq/llama3-70b-8192">LLaMA3-70B</option>
          <option value="groq/mixtral-8x7b-32768">Mixtral-8x7B</option>
        </select>
        <button
          onClick={createSession}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Session
        </button>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Your Sessions</h2>
      <ul className="mt-2 space-y-2">
        {sessions.map((s) => (
          <li
            key={s._id}
            className="flex justify-between items-center border p-2 rounded-md hover:bg-gray-100 transition-all"
          >
            <span
              className="cursor-pointer flex-1"
              onClick={() => router.push(`/chat/${s._id}`)}
            >
              {s.name || 'Untitled'} <span className="text-sm text-gray-500">({s.model})</span>
            </span>
            <button
              onClick={() => deleteSession(s._id)}
              className="text-red-500 hover:text-red-700 px-2"
              title="Delete"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </ChatLayout>
  );
}
