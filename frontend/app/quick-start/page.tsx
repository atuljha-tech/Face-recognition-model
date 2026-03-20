'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { registerPerson, recognizeFace } from '@/utils/api';
import type { RegisterResponse, RecognizeResponse } from '@/types';
import ResultCard from '@/components/ResultCard';

export default function QuickStartPage() {
  const [step, setStep] = useState<'capture' | 'register' | 'test'>('capture');
  const [name, setName] = useState('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [registerResult, setRegisterResult] = useState<RegisterResponse | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);

  // Capture current webcam frame
  const captureImage = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    
    // Convert base64 to file
    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], `selfie_${capturedImages.length + 1}.jpg`, { type: 'image/jpeg' });
    
    setCapturedImages([...capturedImages, imageSrc]);
    setCapturedFiles([...capturedFiles, file]);
  }, [capturedImages, capturedFiles]);

  // Handle registration
  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (capturedFiles.length < 2) {
      setError('Please capture at least 2 images');
      return;
    }
    
    setIsCapturing(true);
    setError(null);
    
    try {
      const response = await registerPerson(name, capturedFiles);
      setRegisterResult(response);
      setStep('test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsCapturing(false);
    }
  };

  // Test recognition
  const testRecognition = async () => {
    if (!webcamRef.current) return;
    
    setIsTesting(true);
    setError(null);
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');
      
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
      
      const response = await recognizeFace(file, 0.5);
      setRecognitionResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recognition failed');
    } finally {
      setIsTesting(false);
    }
  };

  // Reset everything
  const reset = () => {
    setStep('capture');
    setName('');
    setCapturedImages([]);
    setCapturedFiles([]);
    setRegisterResult(null);
    setRecognitionResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-float">
                <span className="text-4xl">⚡</span>
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Quick Start Guide
          </h1>
          <p className="text-gray-600 text-lg">
            Get set up in 30 seconds with just 2-3 selfies
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {['capture', 'register', 'test'].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    step === s 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                      : (step === 'register' && s === 'capture') || 
                        (step === 'test' && (s === 'capture' || s === 'register')) 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {idx === 0 && '📸'}
                    {idx === 1 && '📝'}
                    {idx === 2 && '🎯'}
                  </div>
                  {(step === 'register' && s === 'capture') || 
                   (step === 'test' && (s === 'capture' || s === 'register')) ? (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  ) : null}
                </div>
                <div className={`ml-3 ${step === s ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  <div className="text-sm font-medium">{s === 'capture' ? 'Capture' : s === 'register' ? 'Register' : 'Test'}</div>
                  <div className="text-xs">{s === 'capture' ? 'Selfies' : s === 'register' ? 'Your Face' : 'Recognition'}</div>
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-0.5 mx-4 rounded-full transition-all duration-500 ${
                    (step === 'register' && idx === 0) || (step === 'test' && idx <= 1) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Capture Selfies */}
        {step === 'capture' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <div className="space-y-4">
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
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs font-mono">
                    📸 Ready to capture
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs">
                    Look at the camera
                  </div>
                </div>
              </div>
              
              <button
                onClick={captureImage}
                disabled={capturedImages.length >= 3}
                className="relative w-full group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="text-xl">📸</span>
                  <span className="text-lg">Capture Selfie ({capturedImages.length}/3)</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span className="text-base">✍️</span>
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Atul Kumar"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-2 flex items-center space-x-1">
                  <span>💡</span>
                  <span>This will be used to identify you in the system</span>
                </p>
              </div>
            </div>
            
            {/* Captured Images Preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <span className="text-2xl">📷</span>
                    <span>Captured Selfies</span>
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    capturedImages.length >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {capturedImages.length}/3 captured
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {capturedImages.map((img, idx) => (
                    <div key={idx} className="relative group/capture">
                      <img
                        src={img}
                        alt={`Selfie ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      <button
                        onClick={() => {
                          setCapturedImages(capturedImages.filter((_, i) => i !== idx));
                          setCapturedFiles(capturedFiles.filter((_, i) => i !== idx));
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all hover:scale-110 opacity-0 group-hover/capture:opacity-100"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                  {Array(3 - capturedImages.length).fill(0).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-3xl text-gray-300 border-2 border-dashed border-gray-200">
                      📷
                    </div>
                  ))}
                </div>
                
                {capturedImages.length >= 2 && (
                  <button
                    onClick={handleRegister}
                    disabled={!name.trim() || isCapturing}
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    {isCapturing ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Registering...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>✓</span>
                        <span>Register Me</span>
                        <span>→</span>
                      </span>
                    )}
                  </button>
                )}
                
                {error && (
                  <div className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-4 animate-shake">
                    <div className="flex items-start space-x-2">
                      <span>⚠️</span>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Tips for best results:</p>
                    <ul className="text-xs text-blue-800 mt-1 space-y-1">
                      <li>• Ensure good lighting on your face</li>
                      <li>• Capture from different angles</li>
                      <li>• Make sure your face is clearly visible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Registration Success */}
        {step === 'register' && registerResult && (
          <div className="max-w-md mx-auto animate-slideUp">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
              <div className="relative inline-block mb-4">
                <div className="text-7xl animate-float">🎉</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-4">{registerResult.message}</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🔢</span>
                  <p className="text-green-800 font-semibold">
                    Stored {registerResult.encodings_stored} face encoding{registerResult.encodings_stored !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep('test')}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Start Live Testing →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Live Testing */}
        {step === 'test' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
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
                  {isTesting && (
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <div className="text-white text-lg font-medium">Recognizing...</div>
                        <div className="text-white/70 text-sm mt-1">Analyzing your face</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs font-mono">
                    🎯 Live Test Mode
                  </div>
                </div>
              </div>
              
              <button
                onClick={testRecognition}
                disabled={isTesting}
                className="relative w-full group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-lg">{isTesting ? 'Recognizing...' : 'Test Recognition'}</span>
                  {!isTesting && <span className="transform transition-transform group-hover:translate-x-1">→</span>}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              <button
                onClick={reset}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>Start Over (Register New Person)</span>
              </button>
            </div>
            
            {/* Results Section */}
            <div className="space-y-4">
              {recognitionResult && (
                <div className="animate-slideUp">
                  <ResultCard
                    name={recognitionResult.name}
                    confidence={recognitionResult.confidence}
                    processingTime={recognitionResult.processing_time_ms}
                    success={recognitionResult.success}
                    message={recognitionResult.message}
                  />
                </div>
              )}
              
              {!recognitionResult && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/20 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                  <div className="relative inline-block mb-4">
                    <div className="text-7xl animate-float">🎯</div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Test</h3>
                  <p className="text-gray-500 mb-3">Click "Test Recognition" to see if the system recognizes you!</p>
                  <div className="bg-blue-50 inline-block px-4 py-2 rounded-lg">
                    <p className="text-sm text-blue-600 flex items-center space-x-1">
                      <span>💡</span>
                      <span>Make sure you're looking at the camera</span>
                    </p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-4 animate-shake">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">⚠️</span>
                    <div className="flex-1">
                      <p className="text-red-700">{error}</p>
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
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}