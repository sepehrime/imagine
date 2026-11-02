import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    data: null,
  });

  useEffect(() => {
    // Test frontend-to-backend communication via Vite proxy or direct CORS
    axios
      .get("/health")
      .then((res) => {
        setBackendStatus({
          loading: false,
          connected: true,
          data: res.data,
        });
      })
      .catch((err) => {
        setBackendStatus({
          loading: false,
          connected: false,
          error: err.message,
        });
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
          🤖
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          How AI Works
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Phase 1 Environment Setup is complete. Frontend and backend are connected.
        </p>

        {/* Backend Connectivity Status Pill */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Backend Status
            </span>
            {backendStatus.loading ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Checking...
              </span>
            ) : backendStatus.connected ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                ● Connected (200 OK)
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                ● Offline
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            Endpoint: <code className="text-blue-600 dark:text-blue-400">GET /health</code>
          </p>
          {backendStatus.connected && (
            <pre className="mt-2 text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded text-slate-700 dark:text-slate-300 overflow-x-auto">
              {JSON.stringify(backendStatus.data, null, 2)}
            </pre>
          )}
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          🚀 Ready for Phase 2: Core Layout & Navigation
        </div>
      </div>
    </div>
  );
}
