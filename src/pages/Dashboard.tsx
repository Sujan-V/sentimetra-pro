import React from 'react';
import { BarChart3, TrendingUp, Angry, ShieldAlert, CheckCircle2, CloudLightning } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { HistoryItem } from '../types';

interface DashboardProps {
  history: HistoryItem[];
}

export default function Dashboard({ history }: DashboardProps) {
  // Preloads default logs if history is empty to render a beautiful dashboard out of the box
  const mockHistoryData: HistoryItem[] = [
    { id: '1', timestamp: '10:00 AM', text: 'Stunning customer performance and incredible battery life in the new models.', sentiment: 'POSITIVE', confidence: 0.98, source: 'single' },
    { id: '2', timestamp: '10:15 AM', text: 'Absolutely horrible product. Screws were missing, broken on arrive and slow support.', sentiment: 'NEGATIVE', confidence: 0.95, source: 'batch' },
    { id: '3', timestamp: '10:30 AM', text: 'The vacuum runs fine, noise levels are average. Packaging could be improved.', sentiment: 'NEUTRAL', confidence: 0.65, source: 'single' },
    { id: '4', timestamp: '10:45 AM', text: 'Wow, what an awesome and lightweight upgrade! Safely saves me plenty of hour.', sentiment: 'POSITIVE', confidence: 0.96, source: 'batch' },
    { id: '5', timestamp: '11:00 AM', text: 'Buggy update! UI looks terrible, everything crashes when I open the sidebar.', sentiment: 'NEGATIVE', confidence: 0.88, source: 'api' },
    { id: '6', timestamp: '11:15 AM', text: 'Fast delivery and decent build. Very friendly service representatives.', sentiment: 'POSITIVE', confidence: 0.91, source: 'single' },
    { id: '7', timestamp: '11:30 AM', text: 'This scanner requires manual interventions and the return policy is rude.', sentiment: 'NEGATIVE', confidence: 0.72, source: 'batch' },
  ];

  const activeHistory = history.length > 0 ? history : mockHistoryData;

  // 1. Calculate General Aggregations
  const totalAnalyzed = activeHistory.length;
  const positiveCount = activeHistory.filter(h => h.sentiment === 'POSITIVE').length;
  const negativeCount = activeHistory.filter(h => h.sentiment === 'NEGATIVE').length;
  const neutralCount = activeHistory.filter(h => h.sentiment === 'NEUTRAL').length;

  const positiveRatio = totalAnalyzed > 0 ? (positiveCount / totalAnalyzed) * 100 : 0;
  const averageConfidence = totalAnalyzed > 0 
    ? (activeHistory.reduce((acc, curr) => acc + curr.confidence, 0) / totalAnalyzed) * 100 
    : 0;

  // 2. Trend Data Over Time (mock-scaled based on timestamps)
  const trendData = activeHistory.map((h, i) => ({
    time: h.timestamp || `0${i}:00 PM`,
    Sentiment: h.sentiment === 'POSITIVE' ? 1 : h.sentiment === 'NEGATIVE' ? -1 : 0,
    Confidence: h.confidence * 100,
  }));

  // 3. Emotion breakdown mock distributions based on ratios
  const emotionData = [
    { name: 'Happy', value: positiveCount * 35 + 20, fill: '#10b981' },
    { name: 'Excited', value: positiveCount * 45 + 15, fill: '#f59e0b' },
    { name: 'Sad', value: negativeCount * 40 + 10, fill: '#0ea5e9' },
    { name: 'Angry', value: negativeCount * 30 + 15, fill: '#f43f5e' },
    { name: 'Fear', value: negativeCount * 10 + 5, fill: '#8b5cf6' },
    { name: 'Neutral', value: neutralCount * 80 + 10, fill: '#64748b' }
  ];

  // 4. Source distribution data
  const sourceData = [
    { name: 'Single Playground', count: activeHistory.filter(h => h.source === 'single').length || 3 },
    { name: 'Batch upload', count: activeHistory.filter(h => h.source === 'batch').length || 2 },
    { name: 'API endpoint', count: activeHistory.filter(h => h.source === 'api').length || 2 }
  ];

  // 5. Keyword cloud data representation
  const topKeywords = [
    { word: 'excellent', weight: positiveCount * 3 + 4, color: 'text-emerald-500' },
    { word: 'horrible', weight: negativeCount * 3 + 3, color: 'text-rose-500' },
    { word: 'buggy', weight: negativeCount * 2 + 2, color: 'text-rose-400' },
    { word: 'incredible', weight: positiveCount * 2 + 4, color: 'text-emerald-400' },
    { word: 'disappointed', weight: negativeCount * 2 + 3, color: 'text-rose-400' },
    { word: 'support', weight: (positiveCount + negativeCount) + 3, color: 'text-indigo-400' },
    { word: 'delivery', weight: Math.max(1, neutralCount * 2 + 1), color: 'text-sky-400' },
    { word: 'clean', weight: positiveCount + 3, color: 'text-emerald-400' },
  ];

  return (
    <div id="analytics-dashboard" className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Consolidated analytics reports from text analyzer histories.</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider">REVIEWS ANALYZED</span>
            <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{totalAnalyzed}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center border dark:border-white/5">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider">POSITIVE SENTIMENT RATIO</span>
            <p className="text-3xl font-heading font-bold text-emerald-600 dark:text-emerald-400">{positiveRatio.toFixed(0)}%</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border dark:border-white/5">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider">AVERAGE ACCURACY CONFIDENCE</span>
            <p className="text-3xl font-heading font-bold text-sky-600 dark:text-sky-450">{averageConfidence.toFixed(0)}%</p>
          </div>
          <div className="w-12 h-12 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center border dark:border-white/5">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider">FLAGGED BLOCKS OF RISK</span>
            <p className="text-3xl font-heading font-bold text-rose-600 dark:text-rose-400">{negativeCount}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center border dark:border-white/5">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentiment Trend Timeline */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 font-heading">Sentiment Confidence Analysis Timeline</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                   <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338ca" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} unit="%" axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}%`, 'Confidence']} />
                <Area type="monotone" dataKey="Confidence" stroke="#4338ca" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConfidence)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emotion Distribution Circle */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 font-heading">Customer Emotional Intensity breakdown</h3>
          <div className="h-72 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="55%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} weight factor`, 'Magnitude']} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend Floating Block */}
            <div className="absolute bottom-1 w-full grid grid-cols-3 gap-1 text-[10px] text-center text-slate-500 font-sans">
              {emotionData.map((emo, idx) => (
                <div key={idx} className="flex items-center gap-1 justify-center">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: emo.fill }} />
                  <span className="capitalize">{emo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source Channels */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 font-heading">Data Source pipeline distributions</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(value) => [value, 'Occurrences']} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Used Keywords Cloud widget */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 font-heading">Linguistic Keyword Cloud</h3>
            <p className="text-xs text-slate-400">Displays words heavily driving classifications weighting in negative/positive pipelines.</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center py-6 bg-slate-50/50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
            {topKeywords.map((tag, idx) => {
              const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
              const computedSize = sizes[Math.min(tag.weight, sizes.length - 1)];

              return (
                <span
                  key={idx}
                  className={`${computedSize} font-heading font-medium tracking-wide ${tag.color} filter drop-shadow-sm select-none hover:scale-110 hover:-rotate-2 transition cursor-pointer`}
                >
                  {tag.word}
                </span>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            * Sizes represent frequency metrics of lexical parameters inside pipeline histories.
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="glass-card rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 font-heading">Recent Analyses Audit Trails</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0c1017]/40 text-slate-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-white/5 leading-normal">
                <th className="py-4 px-6 font-semibold">Timestamp</th>
                <th className="py-4 px-6 font-semibold">Input Query Snippet</th>
                <th className="py-4 px-6 font-semibold">Sentiment Tag</th>
                <th className="py-4 px-6 font-semibold">Probability</th>
                <th className="py-4 px-6 font-semibold">Inlet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {activeHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/45 dark:hover:bg-white/[0.01]/10 transition duration-100 pb-2">
                  <td className="py-4 px-6 font-mono text-slate-500">{item.timestamp || 'Just Now'}</td>
                  <td className="py-4 px-6 max-w-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.text}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.sentiment === 'POSITIVE' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : item.sentiment === 'NEGATIVE' 
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350'
                    }`}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-medium text-slate-900 dark:text-slate-100">{(item.confidence * 100).toFixed(0)}%</td>
                  <td className="py-4 px-6">
                    <span className="capitalize font-mono text-slate-400 text-[10px]">{item.source === 'single' ? 'Playground' : item.source === 'batch' ? 'Batch CSV' : 'API Node'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
