import React, { useState, useEffect } from 'react';
import type { Video } from '../types';

interface VideoListProps {
  videos: Video[];
  query: string;
  queryType: 'channel' | 'search';
  onClear: () => void;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, query, queryType, onClear }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    const allLinks = videos.map(video => video.url).join('\n');
    navigator.clipboard.writeText(allLinks);
    setIsCopied(true);
  };

  const resultTypeText = queryType === 'channel' ? 'z kanału' : 'dla tematu';

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl font-semibold text-slate-200">
              Znalezione wyniki
            </h2>
            <p className="text-slate-400 text-sm mt-1">
               <span className="text-red-400 font-mono font-medium">{videos.length}</span> filmów {resultTypeText} <span className="text-slate-300 font-medium italic">"{query}"</span>
            </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/20 hover:-translate-y-0.5 active:translate-y-0 border border-indigo-500/50"
          >
            {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
            {isCopied ? 'Skopiowano!' : 'Kopiuj listę'}
          </button>
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-200 border border-slate-700 hover:border-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>

      <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2 pb-2 custom-scrollbar">
        {videos.map((video, index) => (
          <div key={index} className="group bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/60 hover:border-slate-700/80 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4 min-w-0">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-xs text-slate-500 font-mono border border-slate-700 group-hover:border-slate-600 group-hover:text-slate-400 transition-colors">
                    {index + 1}
                </span>
                <span className="text-slate-300 font-medium truncate pr-4 group-hover:text-slate-100 transition-colors">{video.title}</span>
            </div>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 text-red-500/80 hover:text-red-400 font-semibold text-sm py-1.5 px-3 rounded-lg hover:bg-red-500/10 transition-all duration-200"
            >
              <span>Oglądaj</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};