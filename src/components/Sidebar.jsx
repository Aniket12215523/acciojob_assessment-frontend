'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import ModelSelector from './ModelSelector';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiHome } from 'react-icons/fi';

const Sidebar = ({ selectedModel, setSelectedModel }) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef([]);

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
        { name: 'New Chat', userId: user._id, model: selectedModel || 'groq' },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black rounded px-1">{part}</mark>
      ) : (
        part
      )
    );
  };

  const filteredSessions = sessions.filter((session) => {
    const title = getSessionTitle(session);
    const content = session.messages?.map((msg) => msg.message).join(' ') || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleKeyDown = (e) => {
    if (!filteredSessions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredSessions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredSessions.length) % filteredSessions.length);
    } else if (e.key === 'Enter') {
      const selected = filteredSessions[activeIndex];
      if (selected) {
        router.push(`/chat/${selected.sessionId}`);
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white shadow rounded-full"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r p-4 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block md:min-h-screen overflow-y-auto`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-end md:justify-start mb-4 h-8">
              <button
                className="text-gray-600 hover:text-black"
                onClick={async () => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
                title="Go to Dashboard"
              >
                <FiHome size={20} />
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full bg-black text-white rounded-md py-2 mb-4 hover:bg-gray-800 transition"
            >
              + New Chat
            </button>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-1.5 rounded-md bg-white border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />

            <div className="mb-4 mt-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Library</h2>
              <div className="text-gray-600 text-sm italic">Coming soon</div>
            </div>

            <div className="mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Model</h2>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Chats</h2>
              <ul className="space-y-2">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session, idx) => (
                    <li
                      key={session._id}
                      ref={(el) => (listRef.current[idx] = el)}
                      className={`group bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between transition duration-200 shadow-sm ${
                        idx === activeIndex ? 'ring-2 ring-indigo-400' : ''
                      }`}
                    >
                      <Link
                        href={`/chat/${session.sessionId}`}
                        className="text-sm text-gray-800 font-medium truncate max-w-[85%] group-hover:text-indigo-600"
                        onClick={() => setIsOpen(false)}
                      >
                        {highlightMatch(getSessionTitle(session))}
                      </Link>
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="text-gray-400 hover:text-red-500 text-xs transition-opacity duration-150 opacity-0 group-hover:opacity-100"
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