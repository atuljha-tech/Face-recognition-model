'use client';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function StatusCard({ title, value, icon, color }: StatusCardProps) {
  // Map color strings to gradient and style configurations
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      medium: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      shadow: 'shadow-blue-500/20',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    },
    green: {
      gradient: 'from-green-500 to-emerald-600',
      light: 'bg-green-50',
      medium: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      shadow: 'shadow-green-500/20',
      iconBg: 'bg-gradient-to-br from-green-100 to-emerald-200',
    },
    red: {
      gradient: 'from-red-500 to-rose-600',
      light: 'bg-red-50',
      medium: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-200',
      shadow: 'shadow-red-500/20',
      iconBg: 'bg-gradient-to-br from-red-100 to-rose-200',
    },
    yellow: {
      gradient: 'from-yellow-500 to-amber-600',
      light: 'bg-yellow-50',
      medium: 'bg-yellow-100',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      shadow: 'shadow-yellow-500/20',
      iconBg: 'bg-gradient-to-br from-yellow-100 to-amber-200',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      medium: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200',
      shadow: 'shadow-purple-500/20',
      iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200',
    },
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50',
      medium: 'bg-indigo-100',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      shadow: 'shadow-indigo-500/20',
      iconBg: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      light: 'bg-pink-50',
      medium: 'bg-pink-100',
      text: 'text-pink-600',
      border: 'border-pink-200',
      shadow: 'shadow-pink-500/20',
      iconBg: 'bg-gradient-to-br from-pink-100 to-pink-200',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      light: 'bg-orange-50',
      medium: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200',
      shadow: 'shadow-orange-500/20',
      iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200',
    },
  };

  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.blue;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Animated gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Card content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Text content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
              {/* Animated indicator */}
              <div className="w-1 h-1 rounded-full bg-gray-300 group-hover:animate-pulse"></div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-105 group-hover:text-gray-800">
                {value}
              </p>
              {/* Optional unit indicator - can be customized */}
              {typeof value === 'number' && (
                <span className="text-xs text-gray-400 font-medium">units</span>
              )}
            </div>
            
            {/* Trend indicator - decorative */}
            <div className="mt-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs text-gray-500">Updated in real-time</span>
            </div>
          </div>
          
          {/* Right side - Icon with animations */}
          <div className="relative">
            {/* Outer ring animation */}
            <div className={`absolute inset-0 rounded-full ${config.medium} opacity-0 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500`}></div>
            
            {/* Icon container with gradient background */}
            <div className={`relative w-14 h-14 rounded-2xl ${config.iconBg} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
              <span className={`text-3xl transition-all duration-300 group-hover:scale-110 ${config.text}`}>
                {icon}
              </span>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
            </div>
            
            {/* Decorative pulse ring */}
            <div className={`absolute -inset-1 rounded-full ${config.medium} opacity-0 group-hover:opacity-30 group-hover:animate-ping duration-1000`}></div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient border */}
      <div className={`h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br ${config.gradient} transform rotate-45 translate-x-4 -translate-y-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      </div>
    </div>
  );
}