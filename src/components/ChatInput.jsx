'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FiMic, FiSend, FiPlus } from 'react-icons/fi';

const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), { ssr: false });

const ChatInput = ({ input, setInput, onSend, loading }) => {
  const [showRecorder, setShowRecorder] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend();
    }
  };

  return (
    <div className="w-full border-t border-gray-200 bg-white px-4 py-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button type="button" className="text-gray-500 hover:text-gray-800">
          <FiPlus size={20} />
        </button>

        <input
          type="text"
          value={input ?? ''}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          className="text-gray-500 hover:text-gray-800"
          onClick={() => setShowRecorder(!showRecorder)}
        >
          <FiMic size={20} />
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`text-blue-600 hover:text-blue-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FiSend size={20} />
        </button>
      </form>

      {showRecorder && (
        <div className="mt-2">
          <VoiceRecorder onText={setInput} />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
