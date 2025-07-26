'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import ModelSelector from './ModelSelector';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gemma-7b-it');
  const [isOpen, setIsOpen] = useState(false);

  const fetchSessions = async () => {
    if (!user?._id || !token) return;
    try {
      const res = await api.get(`/chat/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data.sessions.reverse());
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user, token]);

  const handleNewChat = async () => {
    if (!user?._id || !token) return alert('User not authenticated');
    try {
      const res = await api.post(
        '/sessions/new',
        {
          name: 'New Chat',
          userId: user._id,
          model: selectedModel || 'groq',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sessionId = res.data.sessionId;
      await fetchSessions();
      router.push(`/chat/${sessionId}`);
      setIsOpen(false); 
    } catch (err) {
      console.error('Failed to create new chat:', err);
      alert('Failed to create new chat');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await api.delete(`/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      console.error('Error deleting session:', err.message);
    }
  };

  const getSessionTitle = (session) => {
    if (session.name && session.name !== 'New Chat') return session.name;
    if (session.messages?.length > 0)
      return session.messages[0].message.slice(0, 30) + '...';
    return session.model || `Session ${session._id.slice(-4)}`;
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white shadow rounded-full"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-4 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-1/5 md:min-w-[250px] md:block overflow-y-auto`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <button
              onClick={handleNewChat}
              className="w-full bg-black text-white rounded-md py-2 mb-4 hover:bg-gray-800 transition"
            >
              + New Chat
            </button>

            <input
              type="text"
              placeholder="Search Chats..."
              className="w-full px-3 py-1 mb-4 border rounded-md text-sm"
              disabled
            />

            <div className="mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Library
              </h2>
              <div className="text-gray-600 text-sm italic">Coming soon</div>
            </div>

            <div className="mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Model
              </h2>
              <ModelSelector
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Recent Chats
              </h2>
              <ul className="space-y-2">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <li
                      key={session._id}
                      className="flex items-center justify-between group"
                    >
                      <Link
                        href={`/chat/${session.sessionId}`}
                        className="text-sm text-gray-800 hover:underline truncate max-w-[80%]"
                        onClick={() => setIsOpen(false)} // close sidebar on mobile click
                      >
                        {getSessionTitle(session)}
                      </Link>
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="text-red-500 hover:text-red-700 text-xs hidden group-hover:block"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 italic">No sessions</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} My GPT Assessment App
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
