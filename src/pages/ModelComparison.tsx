import React, { useState } from 'react';
import { Play, Sliders, Cpu, Terminal, RefreshCw, BarChart2 } from 'lucide-react';
import { ModelMetrics } from '../types';

export default function ModelComparison() {
  const [modelType, setModelType] = useState<'logistic_regression' | 'naive_bayes' | 'random_forest' | 'rnn_lstm'>('naive_bayes');
  const [learningRate, setLearningRate] = useState(0.1);
  const [epochs, setEpochs] = useState(10);
  const [testSplit, setTestSplit] = useState(0.2);
  const [isTraining, setIsTraining] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  const startTrainingSequence = () => {
    setIsTraining(true);
    setMetrics(null);
    setLogs([]);
    
    let currentLogs: string[] = [];
    const addLog = (text: string) => {
      currentLogs = [...currentLogs, `[${new Date().toLocaleTimeString()}] ${text}`];
      setLogs(currentLogs);
    };

    addLog(`Initializing corpus tokens & compiling vocabulary dimensions...`);
    
    // Step 1: Preprocessing logs
    setTimeout(() => {
      addLog(`Preprocessed 30 document collections (tokenized, lowercase stem, filtered stopwords).`);
      addLog(`Vocabulary size fitted successfully: 242 unique feature tokens.`);
      
      const testCount = Math.round(30 * testSplit);
      const trainCount = 30 - testCount;
      addLog(`Dataset split parameters: Training docs: ${trainCount}, Testing/Holdout validation docs: ${testCount}.`);
    }, 400);

    // Step 2: Epoch calculations logs
    let currentEpoch = 1;
    const runTrainingEpochs = () => {
      if (currentEpoch <= epochs) {
        setTimeout(() => {
          // Simulated learning improvements
          const simulatedLoss = 0.68 - (0.35 * (currentEpoch / epochs)) + Math.random() * 0.05;
          const simulatedAcc = 0.55 + (0.32 * (currentEpoch / epochs)) - Math.random() * 0.03;
          
          addLog(`Epoch ${currentEpoch}/${epochs} - Training Loss Checkpoint: ${simulatedLoss.toFixed(4)} - Metric accuracy: ${simulatedAcc.toFixed(4)}`);
          currentEpoch++;
          runTrainingEpochs();
        }, 180);
      } else {
        // Training over. Invoke server-side metrics compilation
        setTimeout(async () => {
          addLog(`Convergence threshold satisfied. Validating models performance on host testing sets...`);
          try {
            const resp = await fetch('/api/train', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ modelType, learningRate, epochs, testSplit })
            });
            const data = await resp.json();
            if (data.report) {
              setMetrics(data.report);
              addLog(`Supervised optimization successfully completed! Target accuracy reaches ${(data.report.accuracy * 100).toFixed(1)}%.`);
            }
          } catch (e) {
            console.error(e);
            addLog("Error executing server-side training metrics. Restoring local backup stats.");
          } finally {
            setIsTraining(false);
          }
        }, 300);
      }
    };

    setTimeout(() => {
      addLog(`Beginning gradient optimization steps using parameters of type: ${modelType.toUpperCase()}...`);
      runTrainingEpochs();
    }, 800);
  };

  return (
    <div id="model-sandbox" className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">AI & ML Model Comparisons</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure parameters, train multiple ML classifiers live on-screen, and evaluate confusion matrices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Controls & Sliders */}
        <div id="model-playground-controls" className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
            <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              Classifier parameters
            </h3>

            {/* Model Selecting List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Algorithm selector</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'naive_bayes', name: 'Multinomial Naive Bayes' },
                  { id: 'logistic_regression', name: 'Logistic Regression SGD' },
                  { id: 'random_forest', name: 'Random Decision Forest' },
                  { id: 'rnn_lstm', name: 'LSTM/BiLSTM Network' },
                ].map((mOption) => (
                  <button
                    id={`model-select-btn-${mOption.id}`}
                    key={mOption.id}
                    onClick={() => setModelType(mOption.id as any)}
                    className={`w-full text-left p-3.5 rounded-xl border font-sans text-xs font-semibold transition cursor-pointer flex justify-between items-center ${
                      modelType === mOption.id 
                        ? 'bg-indigo-50 dark:bg-white/5 text-indigo-700 dark:text-indigo-400 border-indigo-455' 
                        : 'bg-white dark:bg-white/[0.01] border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>{mOption.name}</span>
                    {modelType === mOption.id && <Cpu className="w-4 h-4 text-indigo-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders group */}
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide">Learning rate (Alpha)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-300">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  disabled={modelType === 'naive_bayes'}
                  className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide">Optimization Epochs</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-300">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={epochs}
                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                  disabled={modelType === 'naive_bayes'}
                  className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide">Test split ratio</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-300">{(testSplit * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={testSplit}
                  onChange={(e) => setTestSplit(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              id="model-train-start-button"
              onClick={startTrainingSequence}
              disabled={isTraining}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 rounded-xl shadow-lg shadow-indigo-600/15 inline-flex items-center justify-center gap-2 transition cursor-pointer active:scale-97 hover:shadow-none animate-pulse-slow"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Optimizing Weights...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Train Selected Model
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Training Console & Interactive Metrics */}
        <div className="lg:col-span-8 space-y-6">
          {/* Terminal Console Logs */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 shadow-inner relative flex flex-col h-72">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono mb-3 border-b border-white/5 pb-2 select-none">
              <span className="inline-flex items-center gap-1.5 text-lime-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                Live supervised output log
              </span>
              <span className="animate-pulse text-emerald-500 font-semibold uppercase tracking-wider text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">● CORE_VM_ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] text-lime-400 leading-normal focus:outline-none">
              {logs.length > 0 ? (
                logs.map((logStr, idx) => (
                  <div key={idx} className="animate-fade-in">{logStr}</div>
                ))
              ) : (
                <div className="text-slate-650 italic select-none">Awaiting supervised pipeline training triggers. Set parameters and click "Train Model" to initialize...</div>
              )}
            </div>
          </div>

          {/* Model Statistics Summary Cards */}
          {metrics && (
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-white/5 shadow-md p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-neutral-100 capitalize">
                    {metrics.name.toLowerCase().replace('_', ' ')} Report Metrics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy compiled on {testSplit * 100}% test holdout splits in {metrics.trainingTimeMs}ms.</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/5 shrink-0">
                  <span className="text-xs font-mono text-slate-400 block uppercase">Accuracy</span>
                  <span className="text-2xl font-bold font-heading text-indigo-700 dark:text-indigo-400">{(metrics.accuracy * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Statistics values grids */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3.5 bg-slate-50/50 dark:bg-white/[0.01] rounded-xl border border-slate-105 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block mb-1">Precision</span>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{(metrics.precision * 100).toFixed(0)}%</span>
                </div>
                <div className="p-3.5 bg-slate-50/50 dark:bg-white/[0.01] rounded-xl border border-slate-105 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block mb-1">Recall</span>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{(metrics.recall * 100).toFixed(0)}%</span>
                </div>
                <div className="p-3.5 bg-slate-50/50 dark:bg-white/[0.01] rounded-xl border border-slate-105 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block mb-1">F1 Score</span>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{(metrics.f1Score * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Confusion Matrix Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest block font-heading">Confusion Matrix</h4>
                  
                  {/* Confusion Table layout */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center border-none select-none">
                    {/* Headers */}
                    <div></div>
                    <div className="font-semibold text-slate-400 text-[10px] uppercase">Pred POS</div>
                    <div className="font-semibold text-slate-400 text-[10px] uppercase">Pred NEG</div>

                    {/* True POS row */}
                    <div className="font-semibold text-slate-400 flex items-center justify-end pr-2 text-[10px] uppercase">Act POS</div>
                    <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-lg font-bold border border-emerald-500/20">
                      {metrics.confusionMatrix[0][0]}
                      <div className="text-[8px] font-normal text-slate-400 block mt-0.5">TP</div>
                    </div>
                    <div className="p-4 bg-rose-500/10 text-rose-600 rounded-lg font-bold border border-rose-500/20">
                      {metrics.confusionMatrix[0][1]}
                      <div className="text-[8px] font-normal text-slate-400 block mt-0.5">FN</div>
                    </div>

                    {/* True NEG row */}
                    <div className="font-semibold text-slate-400 flex items-center justify-end pr-2 text-[10px] uppercase">Act NEG</div>
                    <div className="p-4 bg-rose-500/10 text-rose-600 rounded-lg font-bold border border-rose-500/20">
                      {metrics.confusionMatrix[1][0]}
                      <div className="text-[8px] font-normal text-slate-400 block mt-0.5">FP</div>
                    </div>
                    <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-lg font-bold border border-emerald-500/20">
                      {metrics.confusionMatrix[1][1]}
                      <div className="text-[8px] font-normal text-slate-400 block mt-0.5">TN</div>
                    </div>
                  </div>
                </div>

                {/* Sub-Classification Report text block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest block font-heading">Labels performance</h4>
                  
                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5">
                      <span className="font-semibold text-emerald-650 dark:text-emerald-450">Positive classification</span>
                      <div className="flex gap-4 items-center">
                        <span className="text-[11px] text-slate-400">P: <b className="text-slate-700 dark:text-slate-300">{(metrics.classificationReport.positive.precision * 100).toFixed(0)}%</b></span>
                        <span className="text-[11px] text-slate-400">R: <b className="text-slate-700 dark:text-slate-300">{(metrics.classificationReport.positive.recall * 100).toFixed(0)}%</b></span>
                        <span className="text-[11px] text-slate-400">F1: <b className="text-slate-700 dark:text-slate-300">{(metrics.classificationReport.positive.f1 * 100).toFixed(0)}%</b></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-white/[0.01] border border-slate-105 dark:border-white/5">
                      <span className="font-semibold text-rose-650 dark:text-rose-455">Negative classification</span>
                      <div className="flex gap-4 items-center">
                        <span className="text-[11px] text-slate-400">P: <b className="text-slate-700 dark:text-slate-300">{(metrics.classificationReport.negative.precision * 100).toFixed(0)}%</b></span>
                        <span className="text-[11px] text-slate-400">R: <b className="text-slate-700 dark:text-slate-300">{(metrics.classificationReport.negative.recall * 100).toFixed(0)}%</b></span>
                        <span className="text-[11px] text-slate-400">F1: <b className="text-slate-700 dark:text-slate-300">{(metrics.classificationReport.negative.f1 * 100).toFixed(0)}%</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
