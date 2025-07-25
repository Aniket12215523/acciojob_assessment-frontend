'use client';
import React, { useRef, useEffect } from 'react';

export default function ChatMessages({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 bg-white rounded-lg shadow h-[85vh]">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-lg px-4 py-2 max-w-xs whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            {msg.message}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}
