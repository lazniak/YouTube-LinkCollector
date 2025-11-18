import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { VideoList } from './components/VideoList';
import { Loader } from './components/Loader';
import { Disclaimer } from './components/Disclaimer';
import { fetchYouTubeVideos, searchYouTubeVideos } from './services/geminiService';
import type { Video, SearchOptions } from './types';
import { ApiKeyInput } from './components/ApiKeyInput';
import { Tabs } from './components/Tabs';
import { TopicSearcherForm } from './components/TopicSearcherForm';
import { NotebookLmTip } from './components/NotebookLmTip';

const App: React.FC = () => {
  // Initialize API key from localStorage if available
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  
  const [apiKey, setApiKey] = useState<string>(() => {
    const savedKey = localStorage.getItem('yt_extractor_api_key');
    return savedKey || '';
  });

  const [activeTab, setActiveTab] = useState<'channel' | 'search'>('channel');

  const TABS = [
    { id: 'channel', label: 'Pobierz z kanału' },
    { id: 'search', label: 'Szukaj tematu' },
  ];

  // Effect to save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('yt_extractor_api_key', apiKey);
    } else {
      localStorage.removeItem('yt_extractor_api_key');
    }
  }, [apiKey]);

  const handleChannelFetch = useCallback(async (channel: string, count: number, options: SearchOptions) => {
    if (!apiKey.trim()) {
      setError('Najpierw wprowadź klucz API YouTube Data.');
      return;
    }
    if (!channel.trim()) {
      setError('Wprowadź nazwę kanału YouTube, ID lub adres URL.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setVideos([]);
    setQuery(channel);

    try {
      const fetchedVideos = await fetchYouTubeVideos(channel, apiKey, count, options);
      if (fetchedVideos.length === 0) {
        setError('Nie znaleziono publicznych filmów dla tego kanału spełniających kryteria lub kanał jest nieprawidłowy.');
      } else {
        setVideos(fetchedVideos);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Wystąpił nieznany błąd.';
      setError(`Nie udało się pobrać filmów. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleSearchFetch = useCallback(async (searchQuery: string, count: number, options: SearchOptions) => {
    if (!apiKey.trim()) {
      setError('Najpierw wprowadź klucz API YouTube Data.');
      return;
    }
    if (!searchQuery.trim()) {
      setError('Wprowadź temat do wyszukania.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setVideos([]);
    setQuery(searchQuery);

    try {
      const fetchedVideos = await searchYouTubeVideos(searchQuery, apiKey, count, options);
      if (fetchedVideos.length === 0) {
        setError('Nie znaleziono filmów dla tego tematu z wybranymi filtrami.');
      } else {
        setVideos(fetchedVideos);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Wystąpił nieznany błąd.';
      setError(`Nie udało się wyszukać filmów. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleClear = useCallback(() => {
    setVideos([]);
    setError(null);
    setQuery('');
  }, []);

  const handleTabChange = (tabId: 'channel' | 'search') => {
    setActiveTab(tabId);
    handleClear();
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24 selection:bg-red-500/30 selection:text-red-200">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-red-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[30rem] h-[30rem] bg-slate-800/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-16 pb-8 max-w-3xl">
        <Header />
        
        <main className="space-y-10">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/40 ring-1 ring-white/5">
            <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} isLoading={isLoading} />
            
            <div className="my-8">
               <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>

            <div className="animate-fade-in">
              {activeTab === 'channel' && <InputForm onFetch={handleChannelFetch} isLoading={isLoading} />}
              {activeTab === 'search' && <TopicSearcherForm onSearch={handleSearchFetch} isLoading={isLoading} />}
            </div>
          </div>
          
          {error && !isLoading && (
            <div className="animate-fade-in bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-start gap-4 shadow-lg backdrop-blur-sm" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <div className="space-y-1">
                  <h3 className="font-semibold text-red-100">Błąd</h3>
                  <p className="text-sm text-red-200/80">{error}</p>
              </div>
            </div>
          )}
          
          {isLoading && <Loader />}
          
          {videos.length > 0 && !isLoading && (
            <VideoList videos={videos} onClear={handleClear} query={query} queryType={activeTab} />
          )}

          <NotebookLmTip />

          <Disclaimer />
        </main>
      </div>
    </div>
  );
};

export default App;