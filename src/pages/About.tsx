import React from 'react';
import { HelpCircle, ChevronRight, Sparkles, Code2, Users } from 'lucide-react';

interface AboutProps {
  onNavigate: (tab: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const steps = [
    { title: "1. Raw Input Intake", desc: "User pings custom feedback or text paragraphs via web interfaces or API pipelines." },
    { title: "2. Linguistic Cleansing", desc: "Lowercases text, strips off non-alphanumeric punctuation signs, and separates into individual words." },
    { title: "3. Stopword Filtering", desc: "Removes grammar fillers (e.g. 'the', 'is', 'of) using the built-in STOPWORDS dictionaries." },
    { title: "4. Pipeline Classification", desc: "Routes clean features to Multinomial Naive Bayes, SGD Logistic Regression, or advanced local NLP heuristics." },
    { title: "5. Metric & LIME Compilation", desc: "Calculates emotional intensities, flags suspicious spam feedback, and computes SHAP word weights." }
  ];

  return (
    <div id="about-info" className="space-y-12 py-4 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Intro */}
      <div className="space-y-4">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">Theory & NLP Architectures</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Learn how Sentiment Analysis Studio processes user commentary from raw strings to mathematical distribution vectors.
        </p>
      </div>

      {/* NLP Flow Visual steps */}
      <div className="space-y-6">
        <h3 className="text-lg font-heading font-semibold text-slate-850 dark:text-slate-200">The NLP Preprocessing Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 relative flex flex-col justify-between">
              {idx < 4 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-slate-950 p-1 rounded-full border border-slate-100 dark:border-slate-800">
                  <ChevronRight className="w-4 h-4 text-indigo-500" />
                </div>
              )}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">{st.title.split('.')[0]}</h4>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-205 leading-tight">{st.title.split('. ')[1]}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid comparing Math formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex gap-2.5 items-center">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              ynb
            </div>
            <h3 className="text-base font-heading font-semibold text-slate-800 dark:text-slate-200">Multinomial Naive Bayes Probability</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            Applies Bayes theorem calculating class priors multipled by Laplace-smoothed word probabilities. Extremely fast and highly performant for cataloging microblog counts.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center select-all">
            <code className="font-mono text-xs text-slate-700 dark:text-slate-300">P(Class | Doc) ∝ P(Class) × ∏ P(Word_i | Class)</code>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex gap-2.5 items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              ylr
            </div>
            <h3 className="text-base font-heading font-semibold text-slate-800 dark:text-slate-200">Logistic SGD Parameter equations</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            Optimizes weights using Stochastic Gradient Descent on cross entropy loss functions. Captures true sentence coefficients directly over bag-of-word mappings.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center select-all">
            <code className="font-mono text-xs text-slate-700 dark:text-slate-300">f(z) = 1 / (1 + e^-z) where z = x.w + bias</code>
          </div>
        </div>
      </div>

      {/* Back to trigger CTA box */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-50 via-indigo-100/40 to-sky-50 dark:from-indigo-950/30 dark:via-indigo-950/10 dark:to-sky-950/10 border border-indigo-100/40 dark:border-indigo-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h4 className="text-lg font-heading font-bold text-slate-850 dark:text-white">Ready to test model pipelines?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Launch our interactive live text analyser playground to evaluate single ratings, toxicity filters, block tags, or chat with AI.</p>
        </div>
        <button
          id="about-cta-go-live"
          onClick={() => onNavigate('live')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md inline-flex items-center gap-2 active:scale-97 transition"
        >
          Open Live Playground <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
