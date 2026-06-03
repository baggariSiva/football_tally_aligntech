'use client';

import { useState } from 'react';

interface StringInputProps {
  onSubmit: (input: string) => void;
  loading: boolean;
}

export default function StringInput({ onSubmit, loading }: StringInputProps) {
  const [input, setInput] = useState<string>('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="matches-textarea" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Enter Match Results (one per line)
      </label>
      <textarea
        id="matches-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"Germany;Spain;win\nFrance;Poland;loss"}
        rows={5}
        disabled={loading}
        className="w-full resize-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm leading-relaxed shadow-inner"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Format: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-medium text-blue-600 dark:text-blue-400">Team1;Team2;win</code> or <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-medium text-blue-600 dark:text-blue-400">Team1;Team2;loss</code>
      </p>
      <button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        className="w-full sm:w-auto self-start px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        id="btn-submit-matches-string"
      >
        {loading ? 'Processing...' : 'Submit Results'}
      </button>
    </div>
  );
}
