'use client';
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/axios';
import { FiMic, FiSend, FiPlus } from 'react-icons/fi';

const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), { ssr: false });

const ChatInput = ({ input, setInput, onSend, loading }) => {
  const [showRecorder, setShowRecorder] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend({ message: input, sender: 'user' });
      setInput('');
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload success:', res.data);

      for (const uploaded of res.data.files) {
        onSend({
          message: `📄 ${uploaded.originalname}`,
          sender: 'user',
          file: {
            name: uploaded.originalname,
            url: uploaded.url,
            content: uploaded.content || null,
          },
        });
      }
    } catch (error) {
      console.error('Upload error:', error.message);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full border-t border-gray-200 bg-white px-4 py-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Upload Button */}
        <button type="button" className="text-gray-500 hover:text-gray-800" onClick={triggerFileUpload}>
          <FiPlus size={20} />
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx,.mp3,.mp4,.zip,.rar"
        />

        {/* Text Input */}
        <input
          type="text"
          value={input ?? ''}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Voice Recorder Toggle */}
        <button
          type="button"
          className="text-gray-500 hover:text-gray-800"
          onClick={() => setShowRecorder(!showRecorder)}
        >
          <FiMic size={20} />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading}
          className={`text-blue-600 hover:text-blue-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FiSend size={20} />
        </button>
      </form>

      {/* Recorder Component */}
      {showRecorder && (
        <div className="mt-2">
          <VoiceRecorder onText={setInput} />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
