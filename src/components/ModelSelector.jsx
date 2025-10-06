'use client';

import React from 'react';

// Updated Groq AI model options (October 2025)
const modelOptions = [
  // Primary Production Models (Free Tier)
  { label: 'Llama 3.1 8B Instant (Fast)', value: 'llama-3.1-8b-instant' },
  { label: 'Llama 3.3 70B Versatile (Best)', value: 'llama-3.3-70b-versatile' },
  { label: 'GPT OSS 120B (OpenAI)', value: 'openai/gpt-oss-120b' },
  { label: 'GPT OSS 20B (OpenAI)', value: 'openai/gpt-oss-20b' },
  
  // Preview Models (Experimental)
  { label: 'Llama 4 Maverick 17B (Preview)', value: 'meta-llama/llama-4-maverick-17b-128e-instruct' },
  { label: 'Qwen 3 32B (Preview)', value: 'qwen/qwen3-32b' },
  
  // Legacy Models (Deprecated - for backward compatibility)
  { label: 'LLaMA 3 8B (Legacy)', value: 'llama3-8b-8192' },
  { label: 'Mixtral 8x7B (Legacy)', value: 'mixtral-8x7b-32768' },
];

export default function ModelSelector({ selectedModel, onModelChange }) {
  // Map legacy models to new ones
  const getRecommendedModel = (model) => {
    const legacyMapping = {
      'llama3-8b-8192': 'llama-3.1-8b-instant',
      'mixtral-8x7b-32768': 'llama-3.3-70b-versatile',
      'gemma-7b-it': 'llama-3.1-8b-instant',
      'llama3-70b-8192': 'llama-3.3-70b-versatile'
    };
    return legacyMapping[model] || model;
  };

  const handleModelChange = (value) => {
    const recommendedModel = getRecommendedModel(value);
    onModelChange(recommendedModel);
  };

  return (
    <div className="mb-4">
      <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
        Choose AI Model (Groq):
      </label>
      <select
        id="model"
        name="model"
        value={selectedModel}
        onChange={(e) => handleModelChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {modelOptions.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
      
      {/* Show warning for legacy models */}
      {['llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'].includes(selectedModel) && (
        <p className="text-sm text-orange-600 mt-1">
          ⚠️ This model may be deprecated. Consider upgrading to a newer model.
        </p>
      )}
    </div>
  );
}
