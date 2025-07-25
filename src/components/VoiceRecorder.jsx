'use client';
import { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import api from '../lib/axios'; 

export default function VoiceRecorder({ sessionId, onTranscribed }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (blob) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('audio', blob, 'voice.wav');

    try {
      const res = await api.post(`/sessions/${sessionId}/voice-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        onTranscribed(res.data.transcription);
      } else {
        alert(res.data.error || 'Transcription failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ReactMediaRecorder
      audio
      blobPropertyBag={{ type: 'audio/wav' }}
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div className="mt-4">
          <p>Status: {status}</p>
          <button
            onClick={startRecording}
            className="px-3 py-1 bg-green-600 text-white rounded mr-2"
          >
            Start
          </button>
          <button
            onClick={() => stopRecording()}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Stop & Upload
          </button>
          {mediaBlobUrl && (
            <audio
              src={mediaBlobUrl}
              controls
              onEnded={async () => {
                const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
                handleUpload(blob);
              }}
              className="mt-2"
            />
          )}
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
      )}
    />
  );
}
