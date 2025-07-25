'use client';
import { useState, useEffect } from 'react';
import api from '../lib/axios';

export default function MemoryEditor({ sessionId }) {
  const [memory, setMemory] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/memory`);
        setMemory(data.memory || '');
      } catch (err) {
        console.error('Failed to load memory:', err);
      }
    };
    fetchMemory();
  }, [sessionId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/sessions/${sessionId}/memory`, {
        memory,
      });
      console.log('Memory saved:', res.data);
    } catch (err) {
      setStatus('Error saving memory');
    }
    setLoading(false);
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="my-4 p-4 border rounded-lg shadow-sm">
      <h2 className="font-bold mb-2">🧠 Memory (Persistent Notes)</h2>
      <textarea
        className="w-full border p-2 rounded text-sm"
        rows={5}
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Memory'}
      </button>
      {status && <p className="text-sm text-gray-500 mt-1">{status}</p>}
    </div>
  );
}
