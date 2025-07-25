import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import ModelSelector from './ModelSelector';
import Link from 'next/link';

const Sidebar = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gemma-7b-it'); 

  //  Fetch all sessions of the user
  const fetchSessions = async () => {
    if (!user?._id || !token) return;
    try {
     const res = await api.get(`/chat/user/${user._id}`, {
    headers: { Authorization: `Bearer ${token}` },
});

      setSessions(res.data.sessions.reverse());
    } catch (err) {
      console.error(' Failed to fetch sessions:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user, token]);

  // New Chat
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
    } catch (err) {
      console.error(' Failed to create new chat:', err);
      alert('Failed to create new chat');
    }
  };

  //  Delete a session
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

  //  Get a readable session title
 const getSessionTitle = (session) => {
  if (session.name && session.name !== 'New Chat') {
    return session.name;
  }

  if (session.messages && session.messages.length > 0) {
    return session.messages[0].message.slice(0, 30) + '...';
  }

  return session.model || `Session ${session._id.slice(-4)}`;
};


  return (
    <div className="w-1/5 min-w-[250px] bg-white border-r p-4 flex flex-col justify-between h-screen overflow-y-auto">
      <div>
        <button
          onClick={handleNewChat}
          className="w-full bg-black text-white rounded-md py-2 mb-4 hover:bg-gray-800 transition"
        >
          + New Chat
        </button>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Chats..."
            className="w-full px-3 py-1 border rounded-md text-sm"
            disabled
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Library</h2>
          <div className="text-gray-600 text-sm italic">Coming soon</div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Model</h2>
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Chats</h2>
          <ul className="space-y-2">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <li key={session._id} className="flex items-center justify-between group">
                  <Link
                    href={`/chat/${session.sessionId}`}
                    className="text-sm text-gray-800 hover:underline truncate max-w-[80%]"
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

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} My GPT Assessment App
      </div>
    </div>
  );
};

export default Sidebar;
