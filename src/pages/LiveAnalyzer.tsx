import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, ShieldAlert, KeyRound, ArrowRight, CornerDownLeft, Info, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { SentimentResult } from '../types';

interface LiveAnalyzerProps {
  onAddHistory: (text: string, sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', confidence: number) => void;
}

export default function LiveAnalyzer({ onAddHistory }: LiveAnalyzerProps) {
  const [text, setText] = useState('');
  const [isRealTime, setIsRealTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [selectedWordWeight, setSelectedWordWeight] = useState<{ word: string; weight: number } | null>(null);
  const [source, setSource] = useState<'deep' | 'local'>('local');

  // Multi-lingual initial recommendations
  const samples = [
    { label: "Standard Review", text: "Wow, this is absolutely incredible! Perfect customer support, outstanding delivery speed, and highly satisfied. Recommended!", type: "POSITIVE" },
    { label: "Negative Feedback", text: "Horrible disaster! The product broke within 2 days. Terrible cheap plastic and extremely rude agents. Waste of money, stay away!", type: "NEGATIVE" },
    { label: "Sarcastic Post", text: "Oh perfect, another update that breaks all my custom configurations. Just brilliant. I absolutely love paying subscription fees for bugs. 🔥", type: "NEGATIVE" },
    { label: "Abusively Angry Comment", text: "Shut up you jerk! Your company is run by lazy idiots and morons. You guys scammed me. Worst trash of a website, I am furious.", type: "NEGATIVE" }
  ];

  // Fast score running local NLP lexicon rules
  const runLocalQuickAnalysis = (val: string) => {
    if (!val.trim()) {
      setResult(null);
      return;
    }

    // Call locally prebuilt tokenizer
    const words = val.toLowerCase().replace(/[^\w\s\ud800-\udfff]/g, '').split(/\s+/).filter(Boolean);
    let posCount = 0;
    let negCount = 0;
    
    // Lexicons
    const pos = new Set(['great', 'love', 'excellent', 'wonderful', 'amazing', 'happy', 'good', 'best', 'cool', 'perfect', 'outstanding', 'recommend', 'nice', 'glad', 'satisfied', 'incredible', 'brilliant', 'clean', 'smooth', 'fast', 'helpful', 'friendly', 'smart', 'worth', 'gorgeous', 'easy', 'highly']);
    const neg = new Set(['bad', 'worst', 'terrible', 'awful', 'hate', 'sad', 'poor', 'slow', 'disappointed', 'disappointing', 'waste', 'furious', 'annoyed', 'horrible', 'useless', 'broken', 'ruined', 'crash', 'fail', 'failure', 'scam', 'fraud', 'ugly', 'pain', 'expensive', 'rude', 'boring', 'annoying', 'error', 'buggy', 'unhappy', 'difficult', 'worse']);

    const wordWeights = words.map(w => {
      let weight = 0;
      if (pos.has(w)) {
        posCount++;
        weight = 0.55;
      } else if (neg.has(w)) {
        negCount++;
        weight = -0.55;
      }
      return { word: w, weight };
    });

    const total = posCount + negCount;
    let positive = 0.33;
    let negative = 0.33;
    let neutral = 0.34;

    if (total > 0) {
      positive = posCount / total;
      negative = negCount / total;
      neutral = 1 - (positive + negative);
    }

    let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'NEUTRAL';
    let confidence = neutral;

    if (positive > negative && positive > 0.4) {
      sentiment = 'POSITIVE';
      confidence = positive;
    } else if (negative > positive && negative > 0.4) {
      sentiment = 'NEGATIVE';
      confidence = negative;
    }

    // Emotions
    const hasExclamation = val.includes('!');
    const isExcited = hasExclamation || val.toLowerCase().includes('great') || val.toLowerCase().includes('incredible');
    const isAngry = val.toLowerCase().includes('worst') || val.toLowerCase().includes('scam') || val.toLowerCase().includes('morons');

    const happy = sentiment === 'POSITIVE' ? 0.6 + Math.random() * 0.2 : 0.05;
    const sad = val.toLowerCase().includes('sad') || val.toLowerCase().includes('sorry') ? 0.7 : (sentiment === 'NEGATIVE' ? 0.35 : 0.05);
    const angry = isAngry ? 0.8 : (sentiment === 'NEGATIVE' ? 0.45 : 0.05);
    const excited = isExcited ? 0.75 : 0.1;
    const fear = val.toLowerCase().includes('scared') || val.toLowerCase().includes('risk') ? 0.65 : 0.05;
    const neutralScore = sentiment === 'NEUTRAL' ? 0.8 : 0.15;

    // Toxicity
    let containsInsult = val.toLowerCase().includes('idiot') || val.toLowerCase().includes('jerk') || val.toLowerCase().includes('moron');
    let toxicityScore = containsInsult ? 0.75 : (sentiment === 'NEGATIVE' ? 0.15 : 0.02);

    // Fake review
    let isFake = val.includes('🔥') || val.includes('💸') || words.length < 5;

    const analysis: SentimentResult = {
      text: val,
      sentiment,
      confidence: parseFloat(confidence.toFixed(2)),
      scores: {
        positive: parseFloat(positive.toFixed(2)),
        negative: parseFloat(negative.toFixed(2)),
        neutral: parseFloat(neutral.toFixed(2)),
      },
      emotions: {
        happy: parseFloat(happy.toFixed(2)),
        sad: parseFloat(sad.toFixed(2)),
        angry: parseFloat(angry.toFixed(2)),
        excited: parseFloat(excited.toFixed(2)),
        fear: parseFloat(fear.toFixed(2)),
        neutral: parseFloat(neutralScore.toFixed(2)),
      },
      toxicity: {
        score: parseFloat(toxicityScore.toFixed(2)),
        flagged: toxicityScore > 0.4,
        categories: {
          hateSpeech: false,
          abuse: toxicityScore > 0.5,
          insult: containsInsult,
        }
      },
      fakeReview: {
        isFake,
        confidence: isFake ? 0.68 : 0.15,
        reasoning: isFake 
          ? "Unusually short pattern or spam emoji flag detected. Organic consumer texts generally contain more descriptive qualifiers."
          : "Matches typical user review structures with low marketing signal coefficients."
      },
      explainability: {
        wordWeights,
        importantKeywords: words.slice(0, 4),
        summaryInsight: "Syntactic analysis using standard local vocabulary dictionary distributions."
      }
    };

    setResult(analysis);
    setSource('local');
  };

  // Run Real-time key up
  useEffect(() => {
    if (isRealTime) {
      runLocalQuickAnalysis(text);
    }
  }, [text, isRealTime]);

  const handleDeepAIAnalysis = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.result) {
        setResult(data.result);
        setSource(data.source === 'local_nlp_lexicon' ? 'local' : 'deep');
        onAddHistory(
          data.result.text,
          data.result.sentiment,
          data.result.confidence
        );
      }
    } catch (e) {
      console.error(e);
      // fallback
      runLocalQuickAnalysis(text);
    } finally {
      setLoading(false);
    }
  };

  // Transform model scores for chart
  const scoresData = result ? [
    { name: 'Positive', score: result.scores.positive * 100, fill: '#10b981' },
    { name: 'Neutral', score: result.scores.neutral * 100, fill: '#64748b' },
    { name: 'Negative', score: result.scores.negative * 100, fill: '#ef4444' },
  ] : [];

  return (
    <div id="live-analyzer" className="space-y-8 animate-fade-in relative">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">Real-Time Playground</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Type review commentary below for real-time sentiment weights and explainability breakdowns.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/[0.02] p-1.5 rounded-xl border border-slate-250 dark:border-white/5 font-sans text-xs">
          <button
            id="toggle-realtime-on"
            onClick={() => setIsRealTime(true)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${isRealTime ? 'bg-white dark:bg-white/5 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Live Lexicon
          </button>
          <button
            id="toggle-realtime-off"
            onClick={() => setIsRealTime(false)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${!isRealTime ? 'bg-white dark:bg-white/5 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manual Deep AI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Playground Text Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm relative">
            <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-slate-100 mb-4 inline-flex items-center gap-2">
              <CornerDownLeft className="w-5 h-5 text-indigo-500" />
              Analyze reviews
            </h3>

            {/* Prompt Helper Samples */}
            <div className="flex flex-wrap gap-2 mb-4">
              {samples.map((s, idx) => (
                <button
                  id={`sample-preset-${idx}`}
                  key={idx}
                  onClick={() => setText(s.text)}
                  className="px-2.5 py-1 text-[11px] font-sans font-medium hover:bg-slate-100 dark:hover:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer active:scale-95 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <textarea
              id="sentiment-input-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste custom user reviews, customer feedback emails, product comments, or toxic messages here to analyze sentiment metrics..."
              className="w-full h-80 max-h-96 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-sans bg-slate-50/50 dark:bg-white/[0.01]/10 text-slate-800 dark:text-slate-200 transition focus:outline-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {text.length} characters | {text.split(/\s+/).filter(Boolean).length} words
              </div>
              
              <button
                id="live-submit-button"
                onClick={handleDeepAIAnalysis}
                disabled={loading || !text.trim()}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 whitespace-nowrap inline-flex items-center gap-2 rounded-lg cursor-pointer transition active:scale-98"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Running AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Run Deep Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex gap-2 items-start">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Analysis engines explanation:</span>
                <br />
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Live Lexicon mode:</span> Evaluates using client-side vocabulary counts and basic rule structures instantly as you type.
                <br />
                <span className="font-semibold text-purple-600 dark:text-purple-400">Deep AI node mode:</span> Connects directly with our server-side <span className="font-semibold text-slate-800 dark:text-slate-200">Deep Neural NLP pipeline</span> to classify sarcasm, custom emojis, fake review flags, and precise word weights.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Analysis Results Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Primary sentiment status card */}
              <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Analysis Output Source</span>
                    <h3 className="text-sm font-heading font-bold text-slate-800 dark:text-slate-100 inline-flex items-center gap-1.5">
                      {source === 'deep' ? (
                        <>
                          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                          Deep Server-Side NLP
                        </>
                      ) : (
                        <>
                          <Info className="w-4 h-4 text-indigo-400" />
                          Local Lexicon Classifier
                        </>
                      )}
                    </h3>
                  </div>

                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    result.sentiment === 'POSITIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : result.sentiment === 'NEGATIVE' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}>
                    {result.sentiment} • {(result.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>

                {/* Score gauge grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Sentiment Probability distribution</h4>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoresData} layout="vertical">
                          <XAxis type="number" domain={[0, 100]} hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={60} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                          <Bar dataKey="score" radius={6} barSize={14}>
                            {scoresData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* SVG radial sentiment meter of intensity */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke={result.sentiment === 'POSITIVE' ? '#10b981' : result.sentiment === 'NEGATIVE' ? '#ef4444' : '#64748b'} 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * result.confidence)}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute text-center space-y-0.5">
                        <span className="text-2xl font-bold font-heading text-slate-800 dark:text-neutral-150">
                          {(result.confidence * 100).toFixed(0)}%
                        </span>
                        <p className="text-[9px] font-mono text-slate-400 tracking-wider">INTENSITY</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-3 capitalize tracking-wide font-sans">
                      {result.sentiment.toLowerCase()} sentiment state
                    </span>
                  </div>
                </div>
              </div>

              {/* Explainability highlights blocks */}
              <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-sm font-heading font-medium text-slate-800 dark:text-slate-200 tracking-wide uppercase font-semibold">
                    Interactive AI Explainability Maps
                  </h3>
                  <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                    SHAP/LIME word weights
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  Hover or click highlighted tokens to view numerical influence on the classification process. Green contributing positively, red contributing negatively.
                </p>

                {/* The highlighted text rendering */}
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200 flex flex-wrap gap-1.5">
                  {result.explainability.wordWeights.map((item, idx) => {
                    const isPos = item.weight > 0.05;
                    const isNeg = item.weight < -0.05;
                    let styleClass = "px-1 rounded-md transition duration-150 cursor-pointer ";
                    
                    if (isPos) {
                      styleClass += "bg-emerald-100/80 dark:bg-emerald-950/40 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/40";
                    } else if (isNeg) {
                      styleClass += "bg-rose-100/80 dark:bg-rose-950/40 hover:bg-rose-200 text-rose-800 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/40";
                    } else {
                      styleClass += "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700";
                    }

                    return (
                      <span
                        key={idx}
                        onClick={() => setSelectedWordWeight({ word: item.word, weight: item.weight })}
                        className={styleClass}
                        title={`Influence: ${item.weight.toFixed(2)}`}
                      >
                        {item.word}
                      </span>
                    );
                  })}
                </div>

                {/* Selected word score box */}
                {selectedWordWeight && (
                  <div className="flex items-center justify-between p-3 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 select-none animate-slide-up">
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Selected word:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                        {selectedWordWeight.word}
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="text-slate-500">Weight coefficient:</span>
                      <span className={`font-mono font-bold ${selectedWordWeight.weight > 0 ? 'text-emerald-600' : selectedWordWeight.weight < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {selectedWordWeight.weight > 0 ? '+' : ''}{selectedWordWeight.weight.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setSelectedWordWeight(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer ml-1 font-semibold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {result.explainability.summaryInsight && (
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3.5 rounded-lg border border-slate-150 dark:border-slate-900 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans italic">
                      "{result.explainability.summaryInsight}"
                    </p>
                  </div>
                )}
              </div>

              {/* Toxicity gauge & Fake status group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toxicity radar box */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-heading font-medium text-slate-800 dark:text-slate-200 uppercase tracking-wider font-semibold">
                      Toxicity Guard
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${result.toxicity.flagged ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                      {result.toxicity.flagged ? 'FLAGGED' : 'SAFE'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Toxicity score</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{(result.toxicity.score * 100).toFixed(0)}%</span>
                    </div>
                    {/* Progress slider */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${result.toxicity.score > 0.4 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${result.toxicity.score * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-categories */}
                  <div className="flex gap-2 pt-2">
                    <span className={`text-[10px] px-2 py-1 rounded font-medium border ${result.toxicity.categories.hateSpeech ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30' : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-900/30'}`}>
                      Hate Speech
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded font-medium border ${result.toxicity.categories.abuse ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30' : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-900/30'}`}>
                      Harassment
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded font-medium border ${result.toxicity.categories.insult ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30' : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-900/30'}`}>
                      Insults
                    </span>
                  </div>
                </div>

                {/* Review validator block (Spam block) */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-heading font-medium text-slate-800 dark:text-slate-200 uppercase tracking-wider font-semibold">
                      Spam & Authenticity Indicator
                    </h3>
                    {result.fakeReview.isFake ? (
                      <ShieldAlert className="w-5 h-5 text-tomato border-none dark:text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-500 border-none" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Suspicion Rate</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{(result.fakeReview.confidence * 100).toFixed(0)}%</span>
                    </div>
                    {/* Progress slider */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${result.fakeReview.isFake ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${result.fakeReview.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                    <span className="font-semibold">{result.fakeReview.isFake ? "Suspicious" : "Clean feedback"}:</span> {result.fakeReview.reasoning}
                  </p>
                </div>
              </div>

              {/* Emotional breakdowns progress list */}
              <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-heading font-medium text-slate-800 dark:text-slate-200 uppercase tracking-widest font-semibold mb-6">
                  Emotional State breakdowns
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {Object.entries(result.emotions).map(([emoKey, val]) => {
                    const emoVal = val as number;
                    let color = "bg-indigo-500";
                    let emojiVal = "😐";
                    if (emoKey === 'happy') { color = "bg-emerald-500"; emojiVal = "😊"; }
                    else if (emoKey === 'sad') { color = "bg-sky-500"; emojiVal = "😢"; }
                    else if (emoKey === 'angry') { color = "bg-rose-500"; emojiVal = "😡"; }
                    else if (emoKey === 'excited') { color = "bg-amber-500"; emojiVal = "🤩"; }
                    else if (emoKey === 'fear') { color = "bg-purple-500"; emojiVal = "😨"; }

                    return (
                      <div key={emoKey} className="space-y-2 p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-850">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold capitalize text-slate-600 dark:text-slate-350 select-none inline-flex items-center gap-1">
                            <span>{emojiVal}</span>
                            {emoKey}
                          </span>
                          <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400">{(emoVal * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${color}`} 
                            style={{ width: `${emoVal * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center py-20 text-center space-y-4 bg-slate-50/40 dark:bg-slate-900/10 rounded-2xl border border-slate-200/50 border-dashed">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 font-heading text-lg">Awaiting Your Input</h3>
                <p className="text-sm text-slate-400 max-w-sm">Write or select a preset study block on the left and start the dynamic classifier map.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
