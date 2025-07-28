'use client';
import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/axios';
import { FiMic, FiSend, FiPlus } from 'react-icons/fi';

const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), { ssr: false });

const ChatInput = ({ input, setInput, onSend, loading }) => {
  const [showRecorder, setShowRecorder] = useState(false);
  const fileInputRef = useRef(null);
  const inputFieldRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend({ message: input.trim(), sender: 'user' });
      setInput('');
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    Array.from(files).forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      const filePreview = {
        name: file.name,
        url: previewUrl,
        mimetype: file.type,
      };

      onSend({
        message: `📄 ${file.name}`,
        sender: 'user',
        file: filePreview,
      });
    });

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      for (const uploaded of res.data.files) {
        const isVideo = uploaded.mimetype?.startsWith('video/');
        const frames = isVideo && uploaded.content
          ? uploaded.content.split('\n').filter((line) => line.trim().length > 0)
          : null;

        onSend({
          message: `📄 ${uploaded.originalname}`,
          sender: 'user',
          file: {
            name: uploaded.originalname,
            url: uploaded.url,
            mimetype: uploaded.mimetype,
            content: uploaded.content,
            frames,
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

useEffect(() => {
  const el = inputFieldRef.current;
  if (!el) return;

  const handleFocus = () => {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  el.addEventListener('focus', handleFocus);
  return () => el.removeEventListener('focus', handleFocus);
}, []);
  
  return (
    <div className="w-full border-t border-gray-300 bg-white px-4 py-3 md:px-6 fixed bottom-0 z-50 md:relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 flex-wrap sm:flex-nowrap"
      >
        {/* Upload Button */}
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-200 transition"
          onClick={triggerFileUpload}
          title="Upload"
        >
          <FiPlus size={20} className="text-gray-600" />
        </button>
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
          ref={inputFieldRef}
          value={input ?? ''}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow min-w-[50%] rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Mic Button */}
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-200 transition"
          onClick={() => setShowRecorder(!showRecorder)}
          title="Record voice"
        >
          <FiMic size={20} className="text-gray-600" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded-full hover:bg-blue-100 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Send"
        >
          <FiSend size={20} className="text-blue-600" />
        </button>
      </form>

      {/* Voice Recorder */}
      {showRecorder && (
        <div className="mt-2 bg-gray-100 p-3 rounded-md">
          <VoiceRecorder onText={setInput} />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
