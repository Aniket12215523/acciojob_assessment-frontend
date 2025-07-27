'use client';
import React from 'react';
import Sidebar from './Sidebar';

export default function ChatLayout({ children, sessions, onSessionClick, onNewChat, selectedModel, setSelectedModel }) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <Sidebar
        sessions={sessions}
        onSessionClick={onSessionClick}
        onNewChat={onNewChat}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <div className="flex-1 bg-white overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
