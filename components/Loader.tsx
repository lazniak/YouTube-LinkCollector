import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-12 py-8 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-slate-800 rounded-full"></div>
        <div className="w-12 h-12 border-t-2 border-red-500 rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-slate-300">Pobieranie danych...</p>
      <p className="text-sm text-slate-500 mt-1">To może chwilę potrwać w przypadku dużej liczby zapytań</p>
    </div>
  );
};