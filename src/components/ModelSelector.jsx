'use client';

import React from 'react';

// Groq AI model options (enabled)
const modelOptions = [
  { label: 'LLaMA 3 (Groq)', value: 'llama3-8b-8192' },
  { label: 'Mixtral (Groq)', value: 'mixtral-8x7b-32768' },
  { label: 'Gemma 7B (Groq)', value: 'gemma-7b-it' },
  
  { label: 'Gemini 1.5 Flash (Google)', value: 'gemini-1.5-flash' },
  { label: 'Gemini 2.0 Flash (Google)', value: 'gemini-2.0-flash' },

  // OpenRouter models (commented for future use)
  // { label: 'GPT-4o Mini (OpenRouter)', value: 'gpt-4o-mini' },
  // { label: 'Gemini Flash 2.0 (OpenRouter)', value: 'gemini-2.0-flash' },
  // { label: 'Gemma (OpenRouter)', value: 'gemma' },

  // OpenAI models (commented for future use)
  // { label: 'GPT-3.5 Turbo (OpenAI)', value: 'gpt-3.5-turbo' },
  // { label: 'GPT-4 (OpenAI)', value: 'gpt-4' },
];

export default function ModelSelector({ selectedModel, onModelChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
        Choose AI Model (Groq):
      </label>
      <select
        id="model"
        name="model"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {modelOptions.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
}
