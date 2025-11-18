import React, { useState } from 'react';
import type { SearchOptions } from '../types';

interface InputFormProps {
  onFetch: (channel: string, count: number, options: SearchOptions) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onFetch, isLoading }) => {
  const [channel, setChannel] = useState('');
  const [count, setCount] = useState(300); // Default limit set to 300 as requested
  const [order, setOrder] = useState<SearchOptions['order']>('date');
  const [duration, setDuration] = useState<SearchOptions['videoDuration']>('any');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFetch(channel, count, { order, videoDuration: duration });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setCount(1);
      return;
    }
    setCount(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Channel Input Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-focus-within:text-red-500 transition-colors duration-300">
               <path d="M2 12h20M2 12l4 4m-4-4 4-4M22 12l-4 4m4-4-4-4"/>
            </svg>
          </div>
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Wpisz URL kanału, ID lub nazwę użytkownika"
            className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block pl-12 p-4 transition-all duration-300 shadow-inner placeholder-slate-600"
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-w-[140px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Pobierz'
          )}
        </button>
      </div>

      {/* Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Max Count */}
        <div>
            <label htmlFor="channel-count" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Maks. wideo</label>
            <input
                id="channel-count"
                type="number"
                value={count}
                onChange={handleCountChange}
                min="1"
                placeholder="np. 5000"
                className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 shadow-inner"
                disabled={isLoading}
            />
        </div>

        {/* Sort By */}
        <div>
            <label htmlFor="channel-order" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Sortuj według</label>
            <div className="relative">
                <select
                    id="channel-order"
                    value={order}
                    onChange={(e) => setOrder(e.target.value as SearchOptions['order'])}
                    className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 shadow-inner appearance-none pr-10 cursor-pointer"
                    disabled={isLoading}
                >
                    <option value="date">Najnowsze (Data)</option>
                    <option value="viewCount">Najczęściej oglądane</option>
                    <option value="rating">Najwyżej oceniane</option>
                    <option value="title">Tytuł (A-Z)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        </div>

        {/* Duration */}
        <div>
            <label htmlFor="channel-duration" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Długość</label>
            <div className="relative">
                <select
                    id="channel-duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as SearchOptions['videoDuration'])}
                    className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 shadow-inner appearance-none pr-10 cursor-pointer"
                    disabled={isLoading}
                >
                    <option value="any">Dowolna</option>
                    <option value="short">Krótkie (&lt;4m)</option>
                    <option value="medium">Średnie (4-20m)</option>
                    <option value="long">Długie (&gt;20m)</option>
                </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        </div>
      </div>
    </form>
  );
};