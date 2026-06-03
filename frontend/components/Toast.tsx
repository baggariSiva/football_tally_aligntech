'use client';

interface ToastProps {
  msg: string;
  type: 'success' | 'error';
}

export default function Toast({ msg, type }: ToastProps) {
  const isSuccess = type === 'success';

  return (
    <div
      id="toast-notification"
      className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold shadow-xl border animate-slide-in
        ${isSuccess
          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          : 'bg-red-50 dark:bg-red-950/80 text-red-850 dark:text-red-200 border-red-200 dark:border-red-800'
        }`}
    >
      {msg}
    </div>
  );
}
