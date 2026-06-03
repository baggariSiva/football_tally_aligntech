'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export default function FileUpload({ onUpload, loading }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    onUpload(file);
    setFile(null);
    setFileName('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="file-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Upload Input File (.txt)
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex-1 flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-400 font-medium text-sm transition-all duration-150 cursor-pointer shadow-sm select-none"
          onClick={() => inputRef.current?.click()}
          id="btn-file-select-trigger"
        >
          <span>📁</span>
          <span className="truncate max-w-[280px]">
            {fileName || 'Choose a .txt file'}
          </span>
        </div>
        <input
          id="file-input"
          ref={inputRef}
          type="file"
          accept=".txt"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          id="btn-upload-file"
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        File should contain semicolon-separated match results, one per line.
      </p>
    </div>
  );
}
