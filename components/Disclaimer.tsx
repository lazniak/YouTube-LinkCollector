import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="mt-12 text-center">
        <p className="text-xs text-slate-600 max-w-lg mx-auto bg-slate-900/30 border border-slate-800/50 rounded-full py-2 px-6">
            <span className="font-semibold text-slate-500">Nota o prywatności:</span> Twój klucz API jest przetwarzany lokalnie i nigdy nie jest przechowywany na serwerze.
        </p>
    </div>
  );
};