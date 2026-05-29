import React from 'react';
import { ArrowRight, Sparkles, Activity, ShieldAlert, Cpu, BarChart3, Database } from 'lucide-react';

interface LandingProps {
  onNavigate: (tab: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div id="landing-page" className="space-y-16 py-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-16 border border-slate-250 dark:border-white/5 shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide bg-indigo-50 text-indigo-700 dark:bg-indigo-950/45 dark:text-indigo-300 border border-indigo-200/50 dark:border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Empowered by Native ML Classifiers & Core NLP
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400">Sentiment & NLP Intelligence</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl">
            Analyze complex customer feedback, reviews, and micro-posts in real-time. Uncover rich emotional states, toxicity triggers, fake spam risk calculations, and clean keyword-weight explainability maps.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              id="hero-go-analyzer"
              onClick={() => onNavigate('live')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-lg shadow-indigo-600/20 active:shadow-none transition-all duration-150 cursor-pointer"
            >
              Start Live Analyzer
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-go-train"
              onClick={() => onNavigate('train')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.05] active:bg-slate-100 rounded-xl transition duration-150 cursor-pointer"
            >
              Train Core ML Models
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-slate-100">Live AI explainability</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Isolate positive or negative word impacts. Generates true SHAP-like lexical highlight weights directly on the text for absolute transparency.
            </p>
          </div>
          <button 
            id="feat-go-explain"
            onClick={() => onNavigate('live')} 
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-6 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            Try explainability <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-slate-100">Abuse & Toxicity Radar</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Scan toxic markers, hate-speech indicators, and insulting words using the toxicity block. Safeguard user communities automatically.
            </p>
          </div>
          <button 
            id="feat-go-toxicity"
            onClick={() => onNavigate('live')} 
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-6 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            Test toxicity detector <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-slate-100">Live Model Training</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Upload custom datasets, configure Naive Bayes / SGD Logistic Regression hyper-parameters, and run optimization curves live on-screen.
            </p>
          </div>
          <button 
            id="feat-go-train-card"
            onClick={() => onNavigate('train')} 
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-6 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            Launch ML trainer <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tech Breakdown Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">The NLP Technology Pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
            <Sparkles className="w-5 h-5 text-indigo-500 snap-center mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Deep Neural NLP</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-class local heuristics, emotion mapping, and insights integration.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
            <Cpu className="w-5 h-5 text-purple-500 snap-center mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Native ML Algorithms</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real Logistic Regression, SGD weights, Naive Bayes built-in from scratch.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
            <BarChart3 className="w-5 h-5 text-emerald-500 snap-center mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Visual Analytics</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fluid Recharts curves, heatmaps, and downloadable precision reports.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
            <Database className="w-5 h-5 text-cyan-500 snap-center mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Batch Processing</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accepts multiple rows of reviews or standard CSV file datasets instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
