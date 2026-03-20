'use client';

import { useState } from 'react';
import { registerPerson } from '@/utils/api';
import type { RegisterResponse } from '@/types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegisterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    
    // Create previews
    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setImages(files);
      const newPreviews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || images.length === 0) {
      setError('Please provide name and at least one image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerPerson(name, images);
      setResult(response);
      setName('');
      setImages([]);
      setPreviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-float">
                <span className="text-4xl">📝</span>
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Register New Person
          </h1>
          <p className="text-gray-600 text-lg">
            Upload 3-5 clear photos of the person's face for best results
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-base">👤</span>
                <span>Person's Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-400 mt-2 flex items-center space-x-1">
                <span>💡</span>
                <span>This name will be used to identify the person in recognition results</span>
              </p>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-base">🖼️</span>
                <span>Photos</span>
                <span className="text-xs font-normal text-gray-500">(3-10 recommended)</span>
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50/50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                  <div className="text-5xl mb-3 animate-bounce-slow">📸</div>
                  <p className="text-gray-600 font-medium mb-1">
                    Drag & drop photos here or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Upload clear face photos from different angles
                  </p>
                  <div className="mt-3 flex justify-center space-x-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">JPG</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">PNG</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">WebP</span>
                  </div>
                </div>
              </div>

              {/* Image Preview Grid */}
              {previews.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <span className="text-base">✨</span>
                      <span>Preview ({previews.length} photo{previews.length !== 1 ? 's' : ''})</span>
                    </label>
                    {previews.length >= 3 && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ✓ Good to go!
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previews.map((preview, idx) => (
                      <div key={idx} className="relative group/preview">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-xl shadow-md transform transition-all duration-300 group-hover/preview:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all hover:scale-110 opacity-0 group-hover/preview:opacity-100 shadow-lg"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Upload recommendations */}
                  {previews.length < 3 && previews.length > 0 && (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <p className="text-xs text-yellow-700 flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>For best results, upload at least 3 photos from different angles</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Registering Person...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">📝</span>
                    <span className="text-lg">Register Person</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-4 animate-shake">
              <div className="flex items-start space-x-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-700 font-medium">{error}</p>
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

          {/* Success Message */}
          {result && (
            <div className="mx-8 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-slideUp">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-semibold">{result.message}</p>
                  <div className="mt-2 flex items-center space-x-3">
                    <div className="bg-green-100 rounded-lg px-3 py-1">
                      <p className="text-green-700 text-sm font-medium">
                        Stored {result.encodings_stored} face encoding{result.encodings_stored !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setResult(null)}
                    className="mt-3 text-xs text-green-600 hover:text-green-800 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Information Card */}
          <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6 rounded-b-2xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Tips for best results:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use clear, well-lit photos showing the face clearly</li>
                  <li>• Include photos from different angles (front, side, slightly tilted)</li>
                  <li>• Avoid photos with sunglasses, hats, or heavy shadows</li>
                  <li>• Minimum 3 photos recommended for better accuracy</li>
                  <li>• Use photos with neutral expression for consistent results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
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
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}