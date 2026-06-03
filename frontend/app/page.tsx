'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import Toast from '../components/Toast';
import StandingsTable from '../components/StandingsTable';
import StringInput from '../components/StringInput';
import FileUpload from '../components/FileUpload';
import { getStandings, submitString, submitFile, resetStandings } from '../lib/api';
import { Team } from '../lib/types';

interface ToastState {
  msg: string;
  type: 'success' | 'error';
}

export default function Home() {
  const [standings, setStandings] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<'string' | 'file'>('string');
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ msg, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStandings();
      if (res.success) {
        setStandings(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch standings', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  const handleStringSubmit = async (input: string) => {
    setLoading(true);
    try {
      const res = await submitString(input);
      if (res.success) {
        setStandings(res.data);
        showToast('Results updated!');
      } else {
        showToast(res.message || 'Failed to update results', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const res = await submitFile(file);
      if (res.success) {
        setStandings(res.data);
        showToast(`${file.name} processed!`);
      } else {
        showToast(res.message || 'Failed to process file', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all standings?')) return;
    setLoading(true);
    try {
      const res = await resetStandings();
      if (res.success) {
        setStandings([]);
        showToast('Standings reset');
      }
    } catch (err: any) {
      showToast(err.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <Header onReset={handleReset} loading={loading} />

      <main className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Submit Match Results</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add matches by typing them or uploading a text file.
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start">
            <button
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 cursor-pointer
                ${tab === 'string'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              onClick={() => setTab('string')}
              id="tab-select-string"
            >
              Type Input
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 cursor-pointer
                ${tab === 'file'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              onClick={() => setTab('file')}
              id="tab-select-file"
            >
              Upload File
            </button>
          </div>

          <div className="pt-2">
            {tab === 'string' ? (
              <StringInput onSubmit={handleStringSubmit} loading={loading} />
            ) : (
              <FileUpload onUpload={handleFileUpload} loading={loading} />
            )}
          </div>
        </section>

        {/* Standings Panel */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>🏆</span> Leaderboard
            </h2>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-full font-semibold border border-blue-100 dark:border-blue-900">
              {standings.length} team{standings.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Updating leaderboard...</p>
            </div>
          ) : (
            <StandingsTable standings={standings} />
          )}
        </section>
      </main>
    </div>
  );
}
