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
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 bg-white rounded-lg shadow h-[85vh]">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`relative rounded-xl px-4 py-3 max-w-[90%] md:max-w-[75%] w-fit whitespace-pre-wrap break-words 
              ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            {/* Text Message */}
            {msg.message && (
              <div className="relative">
                <div className="text-sm sm:text-base">{msg.message}</div>
                <button
                  onClick={() => handleCopy(msg.message)}
                  className="absolute bottom-1 right-1 text-xs bg-gray-300 hover:bg-gray-400 text-black px-2 py-0.5 rounded shadow"
                >
                  Copy
                </button>
              </div>
            )}

            {/* File Message */}
            {msg.file?.url && (
              <div className="mt-3 text-sm">
                <a
                  href={msg.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500 break-words"
                >
                  {msg.file.name}
                </a>

                {/* Image Preview */}
                {msg.file.mimetype?.startsWith('image/') && (
                  <div className="mt-2">
                    <img
                      src={msg.file.url}
                      alt="Uploaded preview"
                      className="w-40 sm:w-52 h-auto rounded border mt-1"
                    />
                  </div>
                )}

                {/* Video Preview */}
                {msg.file.mimetype?.startsWith('video/') && (
                  <>
                    <video controls className="mt-2 w-full rounded">
                      <source src={msg.file.url} type={msg.file.mimetype} />
                      Your browser does not support the video tag.
                    </video>

                    {/* AI Frame Output */}
                    {Array.isArray(msg.file.frames) && msg.file.frames.length > 0 && (
                      <div className="mt-3 max-h-[300px] overflow-y-auto pr-1 space-y-2">
                        <h4 className="text-sm font-semibold mb-1">🧠 AI Frame Analysis:</h4>
                        {msg.file.frames.map((frameText, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between gap-2 bg-white p-2 rounded shadow-sm"
                          >
                            <div className="text-gray-800 text-sm flex-1">{frameText}</div>
                            <button
                              onClick={() => handleCopy(frameText)}
                              className="text-[11px] bg-gray-300 hover:bg-gray-400 text-black px-2 py-0.5 rounded shrink-0"
                            >
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Transcription Preview */}
                {msg.file.content && !msg.file.mimetype?.startsWith('video/') && (
                  <div className="mt-3 text-xs bg-white border p-2 rounded relative">
                    <pre className="whitespace-pre-wrap">{msg.file.content.slice(0, 500)}</pre>
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
