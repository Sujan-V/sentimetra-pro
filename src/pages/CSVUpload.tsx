import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Play, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BatchItemResult } from '../types';

interface CSVUploadProps {
  onAddBatchToHistory: (items: any[]) => void;
}

export default function CSVUpload({ onAddBatchToHistory }: CSVUploadProps) {
  const [items, setItems] = useState<BatchItemResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Loaded presets
  const imdbSample = [
    "I simply love this movie! Absolutely great performance by the actors, wonderfully shot and stunning graphics.",
    "Boring. A complete waste of time. I fell asleep halfway through, the worst movie of the entire series. Avoid.",
    "A brilliant, clean and highly satisfactory story. Operating at peak artistic value. Pure delights.",
    "Awful casting and buggy audio. The dialogue was a total failure and left me incredibly angry in the theatre."
  ];

  const twitterSample = [
    "Wow what a super fast upgrade! UI is clean and saves me a lot of time daily. Outstanding! 🎉",
    "Useless software mess. Broken on arrival, constantly crashes with the same error. Furious.",
    "The software runs fine, average customer support speed, decent features but expensive.",
    "Absolutely terrible service agents are rude. Worst mistake ever to sign up. Disappointed."
  ];

  const loadSample = (sampleTextList: string[]) => {
    setLoading(true);
    setSuccessMsg('');
    setTimeout(() => {
      const results: BatchItemResult[] = sampleTextList.map((text, idx) => {
        // Fast mock lexicons for preview bulk
        const textLower = text.toLowerCase();
        const hasPos = textLower.includes('great') || textLower.includes('love') || textLower.includes('excellent') || textLower.includes('amazing') || textLower.includes('perfect') || textLower.includes('stunning') || textLower.includes('happy') || textLower.includes('satisfact') || textLower.includes('super');
        const hasNeg = textLower.includes('bad') || textLower.includes('waste') || textLower.includes('worst') || textLower.includes('horrible') || textLower.includes('failure') || textLower.includes('terrible') || textLower.includes('furious') || textLower.includes('useless') || textLower.includes('crashes') || textLower.includes('disappointed');

        let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'NEUTRAL';
        if (hasPos && !hasNeg) sentiment = 'POSITIVE';
        else if (hasNeg) sentiment = 'NEGATIVE';

        const confidence = sentiment === 'NEUTRAL' ? 0.6 : 0.85 + Math.random() * 0.12;
        const toxicityScore = textLower.includes('idiot') || textLower.includes('lazy') || textLower.includes('moron') ? 0.72 : (sentiment === 'NEGATIVE' ? 0.22 : 0.05);
        const primaryEmotion = sentiment === 'POSITIVE' ? 'Happy' : sentiment === 'NEGATIVE' ? 'Angry' : 'Neutral';
        
        return {
          id: `batch-${Date.now()}-${idx}`,
          text,
          sentiment,
          confidence: parseFloat(confidence.toFixed(2)),
          toxicityScore: parseFloat(toxicityScore.toFixed(2)),
          primaryEmotion,
          isFake: textLower.includes('🎉') || text.length < 30
        };
      });

      setItems(results);
      onAddBatchToHistory(results);
      setLoading(false);
      setSuccessMsg(`Simulated classification engine successfully parsed ${results.length} rows.`);
    }, 1000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileParsing(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileParsing(e.target.files[0]);
    }
  };

  const handleFileParsing = (file: File) => {
    setLoading(true);
    setSuccessMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (!csvText) {
        setLoading(false);
        return;
      }

      // Basic newline separator csv parsing
      const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      
      // Attempt to isolate content (skipping header, or processing first 10 rows)
      const dataRows = rows.slice(0, 15); // process top 15 rows
      const results: BatchItemResult[] = dataRows.map((row, idx) => {
        // Simple clean punctuation quote characters of CSV cell
        const rawText = row.replace(/^["']|["']$/g, '').trim();
        const textLower = rawText.toLowerCase();

        const posWords = ['great', 'excellent', 'love', 'amazing', 'happy', 'good', 'best', 'cool', 'perfect', 'outstanding', 'glad', 'satisfied', 'incredible', 'brilliant', 'clean', 'smooth', 'fast', 'helpful', 'friendly', 'smart', 'worth', 'gorgeous', 'easy', 'highly'];
        const negWords = ['bad', 'worst', 'terrible', 'awful', 'hate', 'sad', 'poor', 'slow', 'disappointed', 'disappointing', 'waste', 'furious', 'annoyed', 'horrible', 'useless', 'broken', 'ruined', 'crash', 'fail', 'failure', 'scam', 'fraud', 'ugly', 'pain', 'expensive', 'rude', 'boring', 'annoying', 'error', 'buggy', 'unhappy', 'difficult', 'worse'];

        let posCount = 0;
        let negCount = 0;
        posWords.forEach(w => { if (textLower.includes(w)) posCount++; });
        negWords.forEach(w => { if (textLower.includes(w)) negCount++; });

        let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'NEUTRAL';
        if (posCount > negCount && posCount > 0) sentiment = 'POSITIVE';
        else if (negCount > posCount && negCount > 0) sentiment = 'NEGATIVE';

        const confidence = sentiment === 'NEUTRAL' ? 0.55 : 0.75 + Math.random() * 0.18;
        const toxicityScore = textLower.includes('idiot') || textLower.includes('trash') || textLower.includes('bastard') ? 0.78 : (sentiment === 'NEGATIVE' ? 0.28 : 0.04);
        const primaryEmotion = sentiment === 'POSITIVE' ? 'Happy' : sentiment === 'NEGATIVE' ? 'Angry' : 'Neutral';

        return {
          id: `csv-${Date.now()}-${idx}`,
          text: rawText,
          sentiment,
          confidence: parseFloat(confidence.toFixed(2)),
          toxicityScore: parseFloat(toxicityScore.toFixed(2)),
          primaryEmotion,
          isFake: textLower.includes('💸') || rawText.length < 25
        };
      });

      setItems(results);
      onAddBatchToHistory(results);
      setLoading(false);
      setSuccessMsg(`Spreadsheet dataset successfully imported and parsed. Compiled ${results.length} reviews.`);
    };

    reader.readAsText(file);
  };

  const downloadProcessedCSV = () => {
    if (items.length === 0) return;
    
    // Create CSV content headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Text,Sentiment,Confidence,ToxicityScore,PrimaryEmotion,IsFake\n";
    
    items.forEach(item => {
      const cleanText = item.text.replace(/"/g, '""');
      csvContent += `"${cleanText}",${item.sentiment},${item.confidence},${item.toxicityScore},${item.primaryEmotion},${item.isFake ? 'Yes' : 'No'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analyzed_sentiment_batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summaries
  const positiveCount = items.filter(i => i.sentiment === 'POSITIVE').length;
  const negativeCount = items.filter(i => i.sentiment === 'NEGATIVE').length;
  const neutralCount = items.filter(i => i.sentiment === 'NEUTRAL').length;

  const pieData = [
    { name: 'Positive', value: positiveCount, fill: '#10b981' },
    { name: 'Neutral', value: neutralCount, fill: '#64748b' },
    { name: 'Negative', value: negativeCount, fill: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div id="batch-upload-analyzer" className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">Batch CSV Upload</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Classify dozens of customer reviews, product comments, or social postings instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Drag & Drop block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
            <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-slate-100">Import feed portal</h3>

            {/* Drag & drop form */}
            <form 
              onDragEnter={handleDrag} 
              onDragOver={handleDrag} 
              onDragLeave={handleDrag} 
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' 
                  : 'border-slate-250 dark:border-white/10 hover:border-slate-350 dark:hover:border-white/30'
              }`}
            >
              <input 
                type="file" 
                id="file-upload-input" 
                accept=".csv, .txt" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <div className="w-12 h-12 bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center border dark:border-white/5 animate-pulse-slow">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Drag & drop your CSV here</p>
                <p className="text-[11px] text-slate-400 font-sans">Supports standard separated text value columns (.csv / .txt)</p>
              </div>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <span className="absolute w-full border-t border-slate-200 dark:border-white/5"></span>
              <span className="relative z-10 px-3 py-1 font-mono text-[10px] text-slate-400 uppercase tracking-widest bg-white dark:bg-[#09090b]">
                Or load enterprise presets
              </span>
            </div>

            {/* Quick Presets list */}
            <div className="grid grid-cols-2 gap-4">
              <button
                id="preset-load-imdb"
                onClick={() => loadSample(imdbSample)}
                className="p-4 rounded-xl border border-slate-105 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02]/40 flex flex-col items-start text-left gap-1.5 transition cursor-pointer active:scale-97"
              >
                <FileSpreadsheet className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-sans">IMDb movie ratings</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Loads 4 balanced cinema review comments.</p>
                </div>
              </button>

              <button
                id="preset-load-twitter"
                onClick={() => loadSample(twitterSample)}
                className="p-4 rounded-xl border border-slate-105 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02]/30 flex flex-col items-start text-left gap-1.5 transition cursor-pointer active:scale-97"
              >
                <FileSpreadsheet className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-sans">Twitter tweet feed</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Loads micro-blog posts and brand complaints.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Success / Alert boxes */}
          {successMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-600/20 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-sans flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 animate-bounce-slow" />
              <div>
                <span className="font-semibold">Import Complete:</span> {successMsg}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm text-center space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-heading mb-4">Sentiment Distribution Overview</h4>
              <div className="h-48 relative flex justify-center items-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Rows']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-400 font-sans">No data compiled.</div>
                )}
              </div>
              <div className="flex gap-4 items-center justify-center text-[10px] text-slate-500 font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive ({positiveCount})
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#64748b]" /> Neutral ({neutralCount})
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Negative ({negativeCount})
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Batch Data Table list */}
        <div className="lg:col-span-7 space-y-6">
          {items.length > 0 ? (
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-heading font-semibold text-slate-800 dark:text-slate-100">Compiled Batch Grid</h3>
                <button
                  id="batch-download-csv"
                  onClick={downloadProcessedCSV}
                  className="px-3.5 py-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg bg-indigo-50/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/45 inline-flex items-center gap-1.5 transition cursor-pointer active:scale-97"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Results
                </button>
              </div>

              {/* Data list table */}
              <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-white/5">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/[0.01]/10 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-150 dark:border-white/5 leading-normal">
                      <th className="py-3.5 px-4 font-semibold">Row Text</th>
                      <th className="py-3.5 px-4 font-semibold">Classification</th>
                      <th className="py-3.5 px-4 font-semibold">Confidence</th>
                      <th className="py-3.5 px-4 font-semibold">Toxicity Rating</th>
                      <th className="py-3.5 px-4 font-semibold">Spam Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {items.map((it, idx) => (
                      <tr 
                        id={`batch-row-${idx}`}
                        key={it.id} 
                        className="hover:bg-slate-50/45 dark:hover:bg-white/[0.01]/20 transition"
                      >
                        <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-800 dark:text-slate-200" title={it.text}>
                          {it.text}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                            it.sentiment === 'POSITIVE' 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                              : it.sentiment === 'NEGATIVE' 
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450' 
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {it.sentiment}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium">
                          {(it.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${it.toxicityScore > 0.45 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${it.toxicityScore * 100}%` }} />
                            </div>
                            <span className="font-mono text-[9px] text-slate-500">{(it.toxicityScore * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] ${it.isFake ? 'text-orange-600 dark:text-orange-450 font-bold bg-orange-50' : 'text-slate-400'}`}>
                            {it.isFake ? 'SUSPICIOUS' : 'Organic'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center py-24 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 font-heading text-lg">Awaiting Batch Feed</h3>
                <p className="text-sm text-slate-400 max-w-sm">Upload a custom CSV file on the left, or double-click an enterprise preset block to load standard IMDb movie ratings and Twitter feeds immediately.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
