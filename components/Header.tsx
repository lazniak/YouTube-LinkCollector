import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-12 flex flex-col items-center justify-center">
      <div className="mb-6 p-4 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-800/80 shadow-xl shadow-black/20 backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <path d="M10 10l5 2-5 2V10z" fill="currentColor" className="text-red-500" />
        </svg>
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-sm">
        Video<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Collector</span>
      </h1>
      <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed font-light">
        Bez wysiłku pobieraj pełne listy wideo lub odkrywaj popularne treści według tematu.
      </p>
    </header>
  );
};