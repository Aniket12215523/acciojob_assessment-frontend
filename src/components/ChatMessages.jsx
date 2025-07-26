'use client';
import React, { useRef, useEffect } from 'react';

export default function ChatMessages({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 bg-white rounded-lg shadow h-[85vh]">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-lg px-4 py-2 max-w-md whitespace-pre-wrap relative ${
              msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {/* Main message */}
            {msg.message && <div>{msg.message}</div>}

            {/* File Preview */}
            {msg.file?.url && (
              <div className="mt-2 text-sm">
                <a
                  href={msg.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-200"
                >
                  {msg.file.name}
                </a>

                {/* Image preview */}
                {msg.file.mimetype?.startsWith('image/') && (
                  <div className="mt-2">
                    <img
                      src={msg.file.url}
                      alt="Uploaded preview"
                      className="w-32 h-auto rounded border mt-1"
                    />
                  </div>
                )}

                {/* Video preview */}
                 {msg.file.mimetype?.startsWith('video/') && (
                  <video controls className="mt-2 w-full rounded">
                  <source src={msg.file.url} type={msg.file.mimetype} />
                  Your browser does not support the video tag.
                 </video>
                )}


                {/* Transcribed content */}
                {msg.file.content && (
                  <div className="mt-2 text-xs bg-white/10 p-2 rounded relative">
                    <pre className="whitespace-pre-wrap break-words">{msg.file.content.slice(0, 500)}</pre>
                    <button
                      onClick={() => handleCopy(msg.file.content)}
                      className="absolute top-1 right-1 text-[11px] bg-gray-300 hover:bg-gray-400 text-black px-2 py-0.5 rounded"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}
