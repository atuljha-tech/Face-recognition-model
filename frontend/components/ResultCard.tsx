'use client';

interface ResultCardProps {
  name: string;
  confidence: number;
  processingTime: number;
  success: boolean;
  message: string;
}

export default function ResultCard({
  name,
  confidence,
  processingTime,
  success,
  message,
}: ResultCardProps) {
  const isRecognized = name !== 'Unknown';
  const confidencePercentage = (confidence * 100).toFixed(1);
  const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.5 ? 'medium' : 'low';
  
  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'from-green-500 to-emerald-500';
    if (confidence >= 0.5) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      {/* Header Section */}
      <div className={`relative p-5 border-b transition-all duration-300 ${
        isRecognized 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50/50' 
          : 'bg-gradient-to-r from-red-50 to-rose-50/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
              isRecognized 
                ? 'bg-green-500/10 text-green-600 group-hover:scale-110' 
                : 'bg-red-500/10 text-red-600 group-hover:scale-110'
            }`}>
              {isRecognized ? '✓' : '?'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recognition Result</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isRecognized ? 'Identity confirmed' : 'Identity not found'}
              </p>
            </div>
          </div>
          <div className={`relative px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
            isRecognized 
              ? 'bg-green-500 text-white hover:shadow-green-500/30' 
              : 'bg-red-500 text-white hover:shadow-red-500/30'
          }`}>
            <div className="flex items-center space-x-1">
              <span className="text-sm">{isRecognized ? '✓' : '✗'}</span>
              <span>{isRecognized ? 'Recognized' : 'Unknown'}</span>
            </div>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 space-y-5">
        {/* Name Field */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100 group/item">
          <span className="text-gray-500 text-sm font-medium flex items-center space-x-2">
            <span className="text-base">👤</span>
            <span>Name</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className={`text-xl font-bold transition-all duration-300 ${
              isRecognized ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {name}
            </span>
            {isRecognized && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        {/* Confidence Field */}
        {isRecognized && (
          <div className="space-y-3 py-2 border-b border-gray-100 group/item">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium flex items-center space-x-2">
                <span className="text-base">🎯</span>
                <span>Confidence</span>
              </span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
                confidence >= 0.8 ? 'text-green-600 bg-green-50' :
                confidence >= 0.5 ? 'text-yellow-600 bg-yellow-50' :
                'text-red-600 bg-red-50'
              }`}>
                {confidencePercentage}%
              </span>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className={`bg-gradient-to-r ${getConfidenceColor()} rounded-full h-3 transition-all duration-1000 ease-out relative`}
                  style={{ width: `${confidencePercentage}%` }}
                >
                  {/* Progress shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              {/* Confidence level indicator */}
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-400">Low</span>
                <span className="text-xs text-gray-400">Medium</span>
                <span className="text-xs text-gray-400">High</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Processing Time Field */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100 group/item">
          <span className="text-gray-500 text-sm font-medium flex items-center space-x-2">
            <span className="text-base">⚡</span>
            <span>Processing Time</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-mono font-semibold text-gray-700">{processingTime}</span>
            <span className="text-xs text-gray-400">ms</span>
            {processingTime < 100 && (
              <span className="text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Fast</span>
            )}
          </div>
        </div>
        
        {/* Message Field */}
        <div className="pt-3">
          <div className={`p-3 rounded-xl ${
            success 
              ? 'bg-green-50 border border-green-100' 
              : 'bg-red-50 border border-red-100'
          }`}>
            <div className="flex items-start space-x-2">
              <span className="text-base mt-0.5">
                {success ? '💡' : '⚠️'}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        {/* Additional Metrics for Recognized Faces */}
        {isRecognized && (
          <div className="pt-2 grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Accuracy</div>
              <div className="text-lg font-bold text-blue-600">{confidencePercentage}%</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Match Score</div>
              <div className="text-lg font-bold text-purple-600">
                {(confidence * 100).toFixed(0)}/100
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className={`h-1 bg-gradient-to-r ${
        isRecognized 
          ? 'from-green-500 via-emerald-500 to-teal-500' 
          : 'from-red-500 via-rose-500 to-pink-500'
      }`}></div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}