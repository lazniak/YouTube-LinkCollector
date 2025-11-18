import React from 'react';

export const NotebookLmTip: React.FC = () => {
  const steps = [
    { 
      text: "Kliknij", 
      highlight: "Nowy notebook", 
      url: "https://notebooklm.google.com/" 
    },
    { 
      text: "Wybierz opcję", 
      highlight: "Link / Website" 
    },
    { 
      text: "Wprowadź do", 
      highlight: "300 linków wideo" 
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        
        <div className="space-y-3 flex-grow">
          <h3 className="text-lg font-semibold text-indigo-100">
            Idealne dla NotebookLM
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            To narzędzie jest świetne i bardzo przydatne do wprowadzania treści do aplikacji.
          </p>
          
          <ul className="space-y-2 mt-2">
            {steps.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300 flex-shrink-0">
                  {i + 1}
                </span>
                <span>
                  {item.text}{' '}
                  {item.url ? (
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-200 font-medium hover:text-indigo-100 hover:underline decoration-indigo-500/50 underline-offset-2 inline-flex items-center gap-1 transition-all"
                    >
                      {item.highlight}
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  ) : (
                    <span className="text-indigo-200 font-medium">{item.highlight}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          
          <p className="text-xs text-indigo-400/80 italic pt-1">
            Filmy zostaną automatycznie stranskrybowane i dodane do Twojej bazy wiedzy.
          </p>
        </div>
      </div>
    </div>
  );
};