import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "Hello! I am your Sentiment Insights Assistant. Ask me how to interpret classification scores, analyze brand feedback trends, or write code snippets to integrate our APIs." }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest bottom messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = inputText;
    // Add to state
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setLoading(true);

    try {
      const payloadHistory = messages.map(m => ({
        message: m.text,
        role: m.sender === 'user' ? 'user' : 'model'
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, previousHistory: payloadHistory }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.response || "No valid response." }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { sender: 'ai', text: `Failed to contact chatbot API: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="floating-ai-chatbot" className="fixed bottom-6 right-6 z-50 font-sans text-xs">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="chatbot-trigger-fab"
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer"
          title="Open AI Advisor Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Expanded Chat window */}
      {isOpen && (
        <div id="chatbot-box-panel" className="w-80 h-[400px] mb-2 rounded-2xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-850">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <div>
                <h4 className="font-semibold text-xs text-white">Sentiment Advisor</h4>
                <span className="text-[10px] text-indigo-200 block mt-0.5">NLP Advisor Chat</span>
              </div>
            </div>
            <button
              id="chatbot-close-button"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/40 dark:border-slate-700/40'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-450 border border-slate-200/40 dark:border-slate-700/40 rounded-bl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form field typing input */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex gap-2">
            <input
              id="chatbot-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder="Type business query or NLP question..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-sans text-xs focus:outline-none focus:border-indigo-600 bg-slate-50/50 dark:bg-slate-900 focus:bg-white text-slate-800 dark:text-slate-200"
            />
            <button
              id="chatbot-send-button"
              onClick={handleSendMessage}
              disabled={loading || !inputText.trim()}
              className="w-8 h-8 rounded-lg bg-indigo-600 disabled:bg-slate-350 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
