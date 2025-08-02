'use client';
import React, { useRef, useEffect, useState } from 'react';

const CopyIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 17h8M8 13h8M8 9h8M5 19h14v-14H5v14z" />
  </svg>
);

const TickIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ChatMessages({ messages }) {
  const chatEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    // MODIFIED: Removed flex-1, overflow-y-auto, and h-[85vh] to let the parent page control layout.
    <div className="px-2 sm:px-4 py-4 bg-white rounded-lg shadow">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-6 flex flex-col ${
            msg.sender === 'user' ? 'items-end' : 'items-start'
          }`}
        >
          {/* Message bubble */}
          <div
            className={`rounded-xl px-4 py-3 max-w-[90%] md:max-w-[75%] w-fit whitespace-pre-wrap break-words ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.message && <div className="text-sm sm:text-base">{msg.message}</div>}

            {/* File messages and previews */}
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

                {msg.file.mimetype?.startsWith('image/') && (
                  <div
                    className="mt-2 rounded border mt-1 p-1"
                    style={{ backgroundColor: '#6b7280' }}
                  >
                    <img
                      src={msg.file.url}
                      alt="Uploaded preview"
                      className="w-40 sm:w-52 h-auto rounded"
                    />
                  </div>
                )}

                {msg.file.mimetype?.startsWith('video/') && (
                  <>
                    <div
                      className="mt-2 rounded overflow-hidden"
                      style={{ backgroundColor: '#6b7280' }}
                    >
                      <video controls className="w-full rounded">
                        <source src={msg.file.url} type={msg.file.mimetype} />
                        Your browser does not support the video tag.
                      </video>
                    </div>

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
                              onClick={() => handleCopy(frameText, `frame-${index}-${i}`)}
                              className="text-[11px] bg-gray-300 hover:bg-gray-400 text-black px-2 py-0.5 rounded shrink-0 flex items-center justify-center"
                              aria-label="Copy frame analysis"
                              type="button"
                            >
                              {copiedIndex === `frame-${index}-${i}` ? (
                                <TickIcon className="w-4 h-4" />
                              ) : (
                                <CopyIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {msg.file.content && !msg.file.mimetype?.startsWith('video/') && (
                  <div className="mt-3 text-xs bg-white border p-2 rounded relative">
                    <pre className="whitespace-pre-wrap">{msg.file.content.slice(0, 500)}</pre>
                    <button
                      onClick={() => handleCopy(msg.file.content, `content-${index}`)}
                      className="absolute top-1 right-1 text-[11px] bg-gray-300 hover:bg-gray-400 text-black px-2 py-0.5 rounded flex items-center justify-center"
                      aria-label="Copy transcription"
                      type="button"
                    >
                      {copiedIndex === `content-${index}` ? (
                        <TickIcon className="w-4 h-4" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Copy button below message box */}
          {msg.message && (
            <button
              onClick={() => handleCopy(msg.message, `msg-${index}`)}
              className={`mt-1 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs sm:text-sm ${
                msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
              type="button"
              aria-label="Copy message"
            >
              {copiedIndex === `msg-${index}` ? (
                <>
                  <TickIcon className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}