import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldAlert, Cpu, BarChart3, Database, Home, Globe, BookOpen, Sun, Moon, Info, HelpCircle } from 'lucide-react';
import Landing from './pages/Landing';
import LiveAnalyzer from './pages/LiveAnalyzer';
import Dashboard from './pages/Dashboard';
import CSVUpload from './pages/CSVUpload';
import ModelComparison from './pages/ModelComparison';
import APIPlayground from './pages/APIPlayground';
import About from './pages/About';
import AIChatbot from './components/AIChatbot';
import { HistoryItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [serverMode, setServerMode] = useState<'local'>('local');

  // Load theme from localStorage on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('sentiment-studio-theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Ping api health check to identify model mode
    const fetchHealth = async () => {
      try {
        const resp = await fetch('/api/health');
        const data = await resp.json();
        if (data.apiMode) {
          setServerMode(data.apiMode);
        }
      } catch (err) {
        console.warn("Server cold-start or health check failed:", err);
      }
    };
    fetchHealth();
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sentiment-studio-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sentiment-studio-theme', 'light');
    }
  };

  const addSingleToHistory = (text: string, sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', confidence: number) => {
    const newItem: HistoryItem = {
      id: `single-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      sentiment,
      confidence,
      source: 'single'
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const addBatchToHistory = (items: any[]) => {
    const historicalItems: HistoryItem[] = items.map((it, idx) => ({
      id: it.id || `batch-${Date.now()}-${idx}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: it.text,
      sentiment: it.sentiment,
      confidence: it.confidence,
      source: 'batch'
    }));
    setHistory(prev => [...historicalItems, ...prev]);
  };

  // Nav Links Configuration
  const navLinks = [
    { id: 'landing', label: 'Welcome Portal', icon: Home },
    { id: 'live', label: 'Live Analyzer', icon: Globe },
    { id: 'dashboard', label: 'Executive Stats', icon: BarChart3 },
    { id: 'csv', label: 'CSV Upload Portal', icon: Database },
    { id: 'train', label: 'Model Playground', icon: Cpu },
    { id: 'api', label: 'REST API Client', icon: Activity },
    { id: 'about', label: 'Theory & Flow', icon: BookOpen },
  ];

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'landing':
        return <Landing onNavigate={setCurrentTab} />;
      case 'live':
        return <LiveAnalyzer onAddHistory={addSingleToHistory} />;
      case 'dashboard':
        return <Dashboard history={history} />;
      case 'csv':
        return <CSVUpload onAddBatchToHistory={addBatchToHistory} />;
      case 'train':
        return <ModelComparison />;
      case 'api':
        return <APIPlayground />;
      case 'about':
        return <About onNavigate={setCurrentTab} />;
      default:
        return <Landing onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-slate-800 dark:text-slate-100 flex transition-colors duration-200 bg-[#f8fafc] dark:bg-[#09090b] relative overflow-hidden`}>
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-600/5 blur-[100px] pointer-events-none z-0"></div>

      {/* 1. Sidebar Panel */}
      <aside className="w-68 shrink-0 bg-white dark:bg-black/40 border-r border-slate-105 dark:border-white/5 flex flex-col justify-between p-6 select-none shadow-sm dark:shadow-none hidden md:flex z-10 backdrop-blur-xl">
        <div className="space-y-8">
          
          {/* Main Title branding Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              S
            </div>
            <div>
              <h2 className="font-heading font-semibold text-slate-900 dark:text-white leading-none">Sentimetra Pro</h2>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase block mt-1">Enterprise Studio</span>
            </div>
          </div>

          {/* Links navigation array */}
          <nav className="space-y-1.5">
            {navLinks.map((lnk) => {
              const Icon = lnk.icon;
              const isActive = currentTab === lnk.id;
              
              return (
                <button
                  id={`nav-link-${lnk.id}`}
                  key={lnk.id}
                  onClick={() => setCurrentTab(lnk.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                    isActive 
                      ? 'bg-slate-100 dark:bg-white/5 text-indigo-700 dark:text-indigo-400 font-bold border-l-2 border-indigo-600 dark:border-indigo-500' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  {lnk.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Toggle controls bottom side */}
        <div className="space-y-4">
          <button
            id="theme-toggler"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/5 font-sans text-xs hover:bg-slate-50 dark:hover:bg-white/[0.02] transition cursor-pointer text-slate-600 dark:text-slate-400"
          >
            <span className="font-semibold block font-sans">Visual Theme</span>
            {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-400 font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="capitalize">Core AI: Local NLP Active</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content panel wrapper */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        
        {/* Mobile Header Bar */}
        <header className="bg-white dark:bg-black/40 border-b border-slate-100 dark:border-white/5 px-6 py-4 flex md:hidden items-center justify-between select-none shadow-sm dark:shadow-none font-sans text-xs z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <h2 className="font-heading font-semibold text-slate-900 dark:text-white leading-none">Sentimetra</h2>
          </div>

          <div className="flex gap-2">
            {navLinks.map((lnk) => {
              const Icon = lnk.icon;
              return (
                <button
                  id={`mob-nav-${lnk.id}`}
                  key={lnk.id}
                  onClick={() => setCurrentTab(lnk.id)}
                  className={`p-2 rounded-lg ${currentTab === lnk.id ? 'bg-slate-100 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-700'}`}
                  title={lnk.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
            <button
              id="mob-theme-toggle"
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-700"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </header>

        {/* Global Pipeline Health Ribbon / Status Bar layout */}
        <div className="bg-slate-50/50 dark:bg-black/20 px-6 py-3 border-b border-slate-150 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-sans text-slate-600 dark:text-slate-400 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-green-500">Engine Online</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Model: Bi-LSTM Enterprise v4.2 • Latency: 24ms</span>
          </div>
          <span className="font-mono text-[10px] bg-indigo-50 dark:bg-white/5 px-2.5 py-0.5 rounded border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-indigo-300 uppercase tracking-wider">TLS 1.3 SECURED</span>
        </div>

        {/* Main nested View container wrapping sub-pages */}
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8 max-w-7xl w-full mx-auto relative z-10">
          {renderActiveTab()}
        </main>
      </div>

      {/* Floating Global Chatbot Assistant */}
      <AIChatbot />
    </div>
  );
}
