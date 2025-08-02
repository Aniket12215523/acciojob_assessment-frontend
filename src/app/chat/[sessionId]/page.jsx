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
const handleSend = async (messageObj) => {
  const { message, file } = messageObj;

  const userMessage = {
    sender: 'user',
    message: message, // e.g. "📄 filename.pdf"
    ...(file ? { file } : {}),
  };

  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput('');
  setLoading(true);

  try {
    // If the file has content, send it instead of the label (e.g. "📄 filename")
    const payload = {
      sessionId,
      message: file?.content || message, 
      selectedModel,
      userId: user._id,
    };

    const res = await api.post('/chat/send', payload);
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
        <div className="flex-1 overflow-y-auto pb-28 md:pb-4">
  <ChatMessages messages={messages} />
</div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          loading={loading}
          sessionId={sessionId} 
        />
      </div>
    </div>
  );
}
