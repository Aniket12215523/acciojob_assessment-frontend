'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import ModelSelector from './ModelSelector';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiChevronsLeft, 
  FiPlus, 
  FiSearch, 
  FiArchive 
} from 'react-icons/fi';

const Sidebar = ({ selectedModel, setSelectedModel }) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // For mobile overlay toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop collapse toggle
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
      {/* Mobile "Open" Button */}
      <div className={`md:hidden fixed top-4 left-4 z-50 transition-opacity ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-white shadow rounded-full"
          aria-label="Open Sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r shadow-lg z-40 transform transition-all duration-300 ease-in-out
        p-4
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} md:translate-x-0 md:static md:block md:min-h-screen`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Mobile-Only Header */}
            <div className="md:hidden flex items-center justify-between mb-4 h-8">
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => {
                  router.push('/dashboard');
                  setIsOpen(false);
                }}
                title="Go to Dashboard"
              >
                <FiHome size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-black"
                title="Close Sidebar"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Desktop-Only Header */}
            <div className="hidden md:flex items-center justify-between mb-4 h-8">
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => router.push('/dashboard')}
                title="Go to Dashboard"
              >
                <FiHome size={20} />
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`text-gray-500 hover:text-black transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <FiChevronsLeft size={24} />
              </button>
            </div>

            {/* --- Shared Content --- */}

            <button
              onClick={handleNewChat}
              className="w-full bg-black text-white rounded-md py-2 mb-4 hover:bg-gray-800 transition flex items-center justify-center gap-2"
              title="New Chat"
            >
              <FiPlus size={20} />
              <span className={`${isCollapsed ? 'md:hidden' : ''}`}>New Chat</span>
            </button>
            
            <div className={`${isCollapsed ? 'md:hidden' : ''}`}>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="text-gray-400" size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-3 py-1.5 rounded-md bg-white border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              <div className="mb-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                  <FiArchive size={14} />
                  <span>Library</span>
                </h2>
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
          </div>

          <div className={`mt-8 text-center text-xs text-gray-400 ${isCollapsed ? 'md:hidden' : ''}`}>
            © {new Date().getFullYear()} My GPT Assessment App
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;