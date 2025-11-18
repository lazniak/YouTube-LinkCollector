import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isLoading: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, isLoading }) => {
  return (
    <div className="mb-2">
      <label htmlFor="apiKey" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
        Konfiguracja API
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-focus-within:text-red-500 transition-colors duration-300">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Wklej tutaj swój klucz YouTube Data API"
          className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block pl-12 p-4 transition-all duration-300 shadow-inner placeholder-slate-600"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end mt-2">
        <a 
            href="https://console.cloud.google.com/apis/credentials?" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
            <span>Pobierz dane uwierzytelniające tutaj</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    </div>
  );
};