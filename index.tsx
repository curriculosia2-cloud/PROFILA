
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { isConfigured, checkSupabaseConnectivity } from './services/supabase';
import { AlertCircle, Terminal, RefreshCw } from 'lucide-react';

/**
 * Production Diagnostics Screen
 * Shown only when critical boot conditions are not met.
 */
const FailSafeUI = ({ type, message }: { type: 'env' | 'network', message: string }) => (
  <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 text-center">
    <div className="max-w-xl w-full bg-slate-900 rounded-[2.5rem] p-12 shadow-2xl border border-white/5">
      <div className="w-20 h-20 bg-amber-900/20 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">
        {type === 'env' ? 'Configuração Pendente' : 'Erro de Conexão'}
      </h1>
      <p className="text-slate-400 font-medium mb-10 leading-relaxed">
        {message}
      </p>
      
      {type === 'env' && (
        <div className="bg-black/40 p-6 rounded-2xl mb-10 text-left border border-white/5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center">
            <Terminal size={12} className="mr-2" /> Variaveis Necessárias
          </p>
          <ul className="text-[10px] font-mono text-amber-400/80 space-y-2">
            <li>• SUPABASE_URL</li>
            <li>• SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      )}

      <button 
        onClick={() => window.location.reload()}
        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center transition-all hover:bg-slate-700"
      >
        <RefreshCw size={18} className="mr-3" /> Tentar Novamente
      </button>
    </div>
  </div>
);

const BootLoader = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'env_error' | 'network_error'>('loading');

  useEffect(() => {
    // 1. Boot Logger
    console.log("BOOT", { 
      origin: window.location.origin, 
      path: window.location.pathname, 
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // 2. Environment Guard
    if (!isConfigured) {
      console.error("BOOT_HALTED: Missing environment variables");
      setStatus('env_error');
      return;
    }

    // 3. Network Self-test
    const runDiagnostics = async () => {
      const isOnline = await checkSupabaseConnectivity();
      if (!isOnline) {
        setStatus('network_error');
      } else {
        setStatus('ok');
      }
    };

    runDiagnostics();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
          <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Diagnosticando Sistema...</span>
        </div>
      </div>
    );
  }

  if (status === 'env_error') {
    return <FailSafeUI type="env" message="As variáveis de ambiente do Supabase não foram detectadas ou contêm valores padrão de exemplo." />;
  }

  if (status === 'network_error') {
    return <FailSafeUI type="network" message="Não foi possível estabelecer conexão com os servidores do Supabase. Verifique sua rede." />;
  }

  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("DOM_ERROR: Could not find root element to mount to");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BootLoader />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
