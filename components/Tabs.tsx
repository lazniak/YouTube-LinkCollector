import React from 'react';

interface TabsProps<T extends string> {
  tabs: readonly { id: T; label: string }[];
  activeTab: T;
  setActiveTab: (id: T) => void;
}

export const Tabs = <T extends string>({ tabs, activeTab, setActiveTab }: TabsProps<T>) => {
  return (
    <div className="flex justify-center w-full">
      <div className="bg-slate-950/80 p-1.5 rounded-2xl inline-flex border border-slate-800/80 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/5' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};