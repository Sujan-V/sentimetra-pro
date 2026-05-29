import React, { useState } from 'react';
import { Network, Terminal, Code2, Copy, Play, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function APIPlayground() {
  const [activeTab, setActiveTab] = useState<'node' | 'python' | 'curl'>('node');
  const [testText, setTestText] = useState('Excellent performance, incredibly fast support. Satisfied!');
  const [testResponse, setTestResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippets = {
    node: `const fetch = require('node-fetch');

async function checkSentiment() {
  const response = await fetch('https://sentiment.studio/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: "${testText}"
    })
  });
  const data = await response.json();
  console.log("Sentiment labels:", data.result.sentiment);
  console.log("Confidence:", data.result.confidence);
}`,
    python: `import requests

url = "https://sentiment.studio/api/analyze"
payload = {
    "text": "${testText}"
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
analysis = response.json()
print(f"Sentiment: {analysis['result']['sentiment']}")`,
    curl: `curl -X POST https://sentiment.studio/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text": "${testText}"}'`
  };

  const executeTestAPICall = async () => {
    setLoading(true);
    setTestResponse('');
    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText }),
      });
      const data = await resp.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setTestResponse(`Error executing REST test: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="rest-playground" className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">API Developer Portal</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Integrate our machine learning and deep sentiment analysis scoring pipelines directly inside third party systems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Testing Block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-5">
            <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-500" />
              REST Client Sandbox
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">POST request body</label>
              <input
                id="api-payload-text"
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Write custom payload text..."
                className="w-full p-3.5 text-xs rounded-xl border border-slate-205 dark:border-white/10 font-sans glass-input transition focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5 text-xs font-sans text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-600 dark:text-slate-355 block mb-0.5">Endpoint:</span>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-white/[0.02] px-2 py-1 rounded text-indigo-650 dark:text-indigo-400 border dark:border-white/5">POST /api/analyze</span>
            </div>

            <button
              id="api-test-submit"
              onClick={executeTestAPICall}
              disabled={loading || !testText.trim()}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition active:scale-97 shadow-md hover:shadow-none"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Requesting Server...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Test Request Endpoint
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Rate Limiting System:</span>
            <br />
            Our standard public token endpoint limits callers to 60 executions per minute per IP address. Commercial keys provide SLA contracts and infinite throughput.
          </div>
        </div>

        {/* Right Code Block / Response Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* SDK snippet view */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-[340px]">
            <div className="bg-slate-50 dark:bg-white/[0.02] p-4 border-b border-slate-150 dark:border-white/5 flex justify-between items-center">
              <div className="flex gap-2 text-xs font-semibold">
                {['node', 'python', 'curl'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1.5 rounded-lg font-mono capitalize transition cursor-pointer ${activeTab === tab ? 'bg-white dark:bg-white/5 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-400 hover:text-slate-650'}`}
                  >
                    {tab === 'node' ? 'NodeJS' : tab}
                  </button>
                ))}
              </div>

              <button
                id="api-copy-code"
                onClick={copyCodeToClipboard}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 dark:hover:bg-white/5 flex items-center gap-1 cursor-pointer transition text-xs font-sans font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-5 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre select-all">
              {snippets[activeTab]}
            </div>
          </div>

          {/* Test API response display */}
          {testResponse && (
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-white/5 shadow-md p-5 space-y-3 animate-slide-up">
              <div className="flex gap-2 items-center text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold select-none">
                <CheckCircle2 className="w-4 h-4" />
                HTTP 200 OK
              </div>
              <div className="max-h-72 overflow-y-auto bg-slate-950 rounded-xl p-4 font-mono text-[10.5px] text-lime-400 select-all leading-normal whitespace-pre-wrap">
                {testResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
