'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';

export default function ChatPage() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3-70b-8192');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load history
  useEffect(() => {
    if (!sessionId) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/history/${sessionId}`);
        setMessages(res.data.messages);
        setSelectedModel(res.data.selectedModel || 'llama3-70b-8192');
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', message: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/send', {
        sessionId,
        message: input.trim(),
        selectedModel,
         userId: user._id,
      });
      setMessages(res.data.history);
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <div className="flex flex-col flex-1 p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} />
        </div>
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
}
