'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { recognizeFace } from '@/utils/api';
import type { RecognizeResponse } from '@/types';
import ResultCard from '@/components/ResultCard';
import Link from 'next/link';

export default function Home() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [result, setResult] = useState<RecognizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(0.5);
  const webcamRef = useRef<Webcam>(null);

  const captureAndRecognize = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setIsCapturing(true);
    setError(null);
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');
      
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      
      const response = await recognizeFace(file, threshold);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to recognize face');
    } finally {
      setIsCapturing(false);
    }
  }, [threshold]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Start Banner */}
        <div className="mb-8 group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <div className="absolute top-0 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          
          <div className="relative p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-pulse-slow">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">New to Face Recognition?</h2>
                    <p className="text-blue-100 text-sm">Get started in 30 seconds!</p>
                  </div>
                </div>
                <p className="text-blue-100 mb-4 max-w-md">
                  Capture 2-3 selfies and test live recognition with our AI-powered system.
                </p>
                <Link
                  href="/quick-start"
                  className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                >
                  <span className="text-xl">⚡</span>
                  <span>Quick Start</span>
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <div className="text-7xl hidden sm:block animate-bounce-slow">🚀</div>
            </div>
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-float">
                <span className="text-4xl">🎥</span>
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Live Face Recognition
          </h1>
          <p className="text-gray-600 text-lg">
            Point your camera at a face and click capture to identify
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="relative bg-gradient-to-r from-gray-900 to-gray-800">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto rounded-t-2xl"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user"
                  }}
                />
                {/* Camera overlay */}
                <div className="absolute inset-0 border-2 border-blue-500/20 rounded-t-2xl pointer-events-none"></div>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs font-mono">
                  📸 Ready
                </div>
                
                {isCapturing && (
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <div className="text-white text-lg font-medium">Processing...</div>
                      <div className="text-white/70 text-sm mt-1">Analyzing facial features</div>
                    </div>
                  </div>
                )}
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500/50 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-500/50 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500/50 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500/50 rounded-br-2xl"></div>
              </div>
            </div>
            
            {/* Capture Button */}
            <button
              onClick={captureAndRecognize}
              disabled={isCapturing}
              className="relative w-full group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-xl">{isCapturing ? '⏳' : '🎯'}</span>
                <span className="text-lg">{isCapturing ? 'Recognizing...' : 'Capture & Recognize'}</span>
                {!isCapturing && <span className="transform transition-transform group-hover:translate-x-1">→</span>}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            {/* Threshold Control */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <span className="text-base">🎚️</span>
                  <span>Recognition Threshold</span>
                </label>
                <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {threshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.7"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((threshold - 0.3) / 0.4) * 100}%, #e5e7eb ${((threshold - 0.3) / 0.4) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Strict (0.3)</span>
                <span className="text-xs text-gray-500">Balanced (0.5)</span>
                <span className="text-xs text-gray-500">Flexible (0.7)</span>
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center space-x-1">
                <span>💡</span>
                <span>Lower = stricter matching, Higher = more flexible recognition</span>
              </p>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-5">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-5 animate-shake">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 mb-1">Recognition Failed</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Dismiss →
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {result && (
              <div className="animate-slideUp">
                <ResultCard
                  name={result.name}
                  confidence={result.confidence}
                  processingTime={result.processing_time_ms}
                  success={result.success}
                  message={result.message}
                />
              </div>
            )}
            
            {!result && !error && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/20 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                <div className="relative inline-block mb-4">
                  <div className="text-7xl animate-float">🎭</div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Recognize</h3>
                <p className="text-gray-500 mb-3">Click capture to start face recognition</p>
                <div className="bg-blue-50 inline-block px-4 py-2 rounded-lg">
                  <p className="text-sm text-blue-600 flex items-center space-x-1">
                    <span>💡</span>
                    <span>Tip: Use "Quick Start" to register yourself first!</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .bg-grid-white\/10 {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}