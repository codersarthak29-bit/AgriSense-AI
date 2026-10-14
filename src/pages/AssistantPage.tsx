import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sprout, 
  User, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AssistantMessage } from '../types';
import { api } from '../services/api';

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **AgriSense Crop Care Advisor**.\n\nI can help you analyze plant symptoms, formulate Integrated Pest Management (IPM) strategies, choose resistant varieties, and apply safe biological controls.\n\n*How can I assist your crop management today?*`,
      timestamp: new Date().toISOString(),
      source: 'Agricultural Knowledge Base',
      suggestedFollowUps: [
        'How can I reduce fungal disease risk in tomato plants?',
        'What should I check when potato leaves develop dark spots?',
        'How can I reduce unnecessary chemical pesticide use?'
      ]
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [cropContext, setCropContext] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const q = questionText || inputQuestion.trim();
    if (!q || loading) return;

    const userMsg: AssistantMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: q,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await api.askAssistant(q, cropContext);
      const assistantMsg: AssistantMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: response.reply,
        timestamp: response.timestamp || new Date().toISOString(),
        source: response.source as any,
        suggestedFollowUps: response.suggestedFollowUps
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: AssistantMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: `I encountered an issue consulting the agronomic knowledge base. Please check your internet connection or try again.`,
        timestamp: new Date().toISOString(),
        source: 'Agricultural Knowledge Base'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Crop Care Advisor</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                IPM Guidance
              </span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Practical diagnostic Q&A focusing on biological controls, cultural hygiene, and avoiding synthetic pesticide misuse.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-5 shadow-2xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-stone-800 text-white' 
                : 'bg-emerald-800 text-lime-400'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
            </div>

            {/* Content Bubble */}
            <div className={`max-w-[85%] space-y-2 ${
              msg.role === 'user'
                ? 'bg-emerald-800 text-white rounded-2xl rounded-tr-xs p-4 text-xs leading-relaxed'
                : 'bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-xs p-4 text-xs text-stone-800 leading-relaxed'
            }`}>
              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                <span>{msg.role === 'user' ? 'You' : 'AgriSense Advisor'}</span>
                {msg.source && <span>Source: {msg.source}</span>}
              </div>

              <div className="whitespace-pre-line prose-xs">
                {msg.content}
              </div>

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-3 border-t border-stone-200/60 space-y-1.5 mt-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Suggested Next Inquiries:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-left text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-lg transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-lime-400 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>Consulting plant pathology & IPM protocols...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Optional crop context (e.g., Tomato flowering stage)..."
            value={cropContext}
            onChange={(e) => setCropContext(e.target.value)}
            className="text-[11px] px-3 py-1 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden w-64"
          />
          <span className="text-[11px] text-stone-700 hidden sm:inline">
            Press Enter to submit
          </span>
        </div>

        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about foliar spots, organic fungicides, pruning, or crop disease risks..."
            className="flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 resize-none placeholder:text-stone-400"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuestion.trim()}
            className="p-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl transition-colors shadow-2xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] text-stone-700 px-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Strict non-chemical dosage safety: Recommends organic IPM, bio-fungicides, and certified extension officer referral.</span>
        </div>
      </div>
    </div>
  );
};
