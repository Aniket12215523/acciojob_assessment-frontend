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
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiPlus,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = ({ selectedModel, setSelectedModel }) => {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef([]);

  // For closing sidebar when clicking outside
  const sidebarRef = useRef();

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

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
        <mark key={i} className="bg-yellow-200 text-black rounded px-1">
          {part}
        </mark>
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

  // Main scrollable content: new chat, search, model, recent chats
  const SidebarScrollArea = () => (
    <div className="flex flex-col flex-grow space-y-4">
      <button
        onClick={handleNewChat}
        className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition"
      >
        + New Chat
      </button>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-9 py-1.5 rounded-md bg-white border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Model
        </h2>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Recent Chats
        </h2>
        <div className="overflow-y-auto max-h-[400px] md:max-h-80 pr-1">
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
  );

  // Collapsed sidebar content
  const CollapsedSidebar = () => (
    <div className="hidden md:flex flex-col items-center space-y-4 mt-8">
      <button
        onClick={handleNewChat}
        className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        title="New Chat"
      >
        <FiPlus size={18} />
      </button>
      <button
        onClick={() => setIsDesktopCollapsed(false)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
        title="Search Chats"
      >
        {/* search icon button for collapsed state */}
        <FiSearch size={18} />
      </button>
      <button
        className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"
        title="Logout"
        onClick={() => {
          logout && logout();
          router.push('/');
        }}
      >
        <FiLogOut size={18} />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Header with Toggle and Home Button */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white shadow rounded-full"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <button
          className="p-2 bg-white shadow rounded-full text-gray-600 hover:text-black transition-colors duration-200"
          onClick={() => router.push('/dashboard')}
          title="Go to Dashboard"
        >
          <FiHome size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white border-r shadow-lg z-40 transform transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block md:min-h-screen
        ${isDesktopCollapsed ? 'md:w-16' : 'md:w-64'} w-64 p-4 flex flex-col`}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex flex-col h-full">
          {/* Desktop header (expand/collapse toggle) */}
          <div className="hidden md:flex items-center justify-between mb-4 h-8">
            <button
              className="text-gray-600 hover:text-black transition-colors duration-200"
              onClick={() => router.push('/dashboard')}
              title="Go to Dashboard"
            >
              <FiHome size={20} />
            </button>
            <button
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              aria-label="Toggle Desktop Sidebar"
              title={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isDesktopCollapsed ? (
                <FiChevronRight size={16} />
              ) : (
                <FiChevronLeft size={16} />
              )}
            </button>
          </div>
          {/* Mobile top spacer, prevents overlap with header/close */}
          <div className={`md:hidden ${isOpen ? 'mt-12' : ''}`}></div>
          {/* Main Sidebar Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {!isDesktopCollapsed ? <SidebarScrollArea /> : <CollapsedSidebar />}
          </div>
          {/* Bottom: logout and footer (when not collapsed) */}
          {!isDesktopCollapsed && (
            <div className="pt-4">
              <div className="flex justify-center mb-2">
                <button
                  className="flex items-center px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 text-sm font-semibold transition"
                  title="Logout"
                  onClick={() => {
                    logout && logout();
                    router.push('/');
                  }}
                >
                  <FiLogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
              <div className="text-center text-xs text-gray-400">
                © {new Date().getFullYear()} My GPT Assessment App
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
