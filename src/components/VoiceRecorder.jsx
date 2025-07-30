'use client';
import { useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import api from '../lib/axios';
import { FiMic, FiSquare, FiLoader } from 'react-icons/fi';

// Helper function for MM:SS timer
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function VoiceRecorder({ sessionId, onTranscribed }) {
  const [uploading, setUploading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleUpload = async (blob) => {
    setUploading(true);
    console.log('SessionId in handleUpload:', sessionId);

    if (!sessionId) {
      alert('Session ID is missing. Please refresh the page.');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('audio', blob, `voice-recording-${sessionId}.wav`);

    try {
      // POST audio to backend that runs Whisper and AI models
      const res = await api.post(`/voice/sessions/${sessionId}/voice-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200 && res.data.transcription) {
        // Pass transcription to parent component
        onTranscribed(res.data.transcription);
      } else {
        alert(res.data.error || 'Transcription failed.');
      }
    } catch (err) {
      console.error('Upload error details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'An error occurred during upload. Please try again.';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Status text display
  const StatusDisplay = ({ status }) => {
    let text = "Tap the microphone to start recording";
    if (status === 'acquiring_media') text = "Preparing microphone...";
    if (status === 'recording') text = "Recording in progress...";
    if (status === 'stopping') text = "Finishing up...";
    if (uploading) text = "Processing audio...";

    return <p className="text-sm font-medium text-gray-500">{text}</p>;
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (document.querySelector("[data-status='recording']")) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (!document.querySelector("[data-status='recording']") && timer !== 0) {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [document.querySelector("[data-status='recording']"), timer]);

  return (
    <ReactMediaRecorder
      audio
      blobPropertyBag={{ type: 'audio/wav' }}
      onStop={(blobUrl, blob) => handleUpload(blob)}
      render={({ status, startRecording, stopRecording }) => {
        const isRecording = status === 'recording';
        const isDisabled = status === 'acquiring_media' || uploading;

        return (
          <div
            data-status={status}
            className="bg-white border border-gray-200 rounded-xl p-4 my-4 w-full max-w-lg mx-auto flex flex-col items-center gap-4 transition-all duration-300"
          >
            <div className="text-center w-full">
              <StatusDisplay status={status} />
              <p className="text-4xl font-mono text-gray-900 tracking-tight my-2">
                {formatTime(timer)}
              </p>
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isDisabled}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isRecording ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-800'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <FiSquare size={24} className="text-white" /> : <FiMic size={24} className="text-white" />}
            </button>

            {uploading && (
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <FiLoader size={18} className="animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
