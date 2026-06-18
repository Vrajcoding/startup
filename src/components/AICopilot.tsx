import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Clock, 
  Wand2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Message, AssessmentResult } from '../types';

interface AICopilotProps {
  assessmentResult: AssessmentResult;
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  onUnlockAIBadge: () => void;
}

export default function AICopilot({
  assessmentResult,
  messages,
  onAddMessage,
  onUnlockAIBadge,
}: AICopilotProps) {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested starter prompts
  const suggestedPrompts = [
    "What should I do next?",
    "How can I validate my idea?",
    "How can I improve my pitch deck?",
    "Which milestone should I complete first?",
    "How can I get my first customers?",
    "Am I investor-ready?"
  ];

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || loading) return;

    // 1. Add user message
    onAddMessage({
      sender: 'user',
      text: text,
      timestamp: new Date()
    });
    setUserInput('');
    setLoading(true);

    try {
      // 2. Fetch from Express API
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          startupContext: {
            stage: assessmentResult.overallScore > 0 ? "Validated Concept" : "Early Idea",
            overallScore: assessmentResult.overallScore,
            problemValidation: assessmentResult.problemValidation,
            customerValidation: assessmentResult.customerValidation,
            productReadiness: assessmentResult.productReadiness
          }
        })
      });

      const data = await response.json();
      if (data.text) {
        onAddMessage({
          sender: 'assistant',
          text: data.text,
          timestamp: new Date(),
          actionPlan: data.actionPlan || []
        });

        // Trigger badge unlocks
        onUnlockAIBadge();
      }
    } catch (error) {
      console.error(error);
      onAddMessage({
        sender: 'assistant',
        text: "I apologize, but I had trouble establishing server contact. Please check your network and try again shortly.",
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Find latest assistant action plan if any to render in sidecard
  const getLatestActionPlan = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'assistant' && messages[i].actionPlan) {
        return messages[i].actionPlan;
      }
    }
    return [
      "Launch the 15-question diagnostic assessment.",
      "Conduct 5 unstructured customer problem discovery calls.",
      "Review competitor matrices."
    ];
  };

  const currentActionPlan = getLatestActionPlan();

  return (
    <div id="ai-copilot" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto h-[600px] md:h-[680px]">
      
      {/* Messages Column (Main Chat panel) */}
      <div className="lg:col-span-8 bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border rounded-3xl overflow-hidden shadow-sm flex flex-col h-full justify-between">
        
        {/* Chat Banner bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-display">Gemini Growth Copilot</h3>
              <span className="text-[9px] font-mono text-emerald-400 block tracking-wide uppercase uppercase">Active Advisor</span>
            </div>
          </div>
          
          <div className="text-[9px] font-mono text-slate-400 uppercase hidden md:block">
            Model Context: Gemini 3.5 Flash
          </div>
        </div>

        {/* Messaging Box */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border font-mono ${
                  isUser ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-indigo-500'
                }`}>
                  {isUser ? 'F' : 'G'}
                </div>

                <div className={`space-y-2 p-4 rounded-2xl border text-xs leading-relaxed font-sans ${
                  isUser 
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 dark:border-white' 
                    : 'bg-slate-50 border-slate-100 dark:bg-slate-900/60 dark:border-slate-850 text-slate-800 dark:text-slate-205'
                }`}>
                  <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                  
                  {!isUser && (
                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                      <button 
                        id={`copy-chat-${idx}`}
                        className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                        onClick={() => handleCopyText(msg.text, idx)}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy advice</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[80%] items-center">
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-indigo-500 flex items-center justify-center font-bold text-xs">
                G
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500 font-medium font-mono">Gemini formulating direction...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area plus presets */}
        <div className="p-4 border-t border-slate-101 dark:border-slate-850/80 space-y-4 shrink-0 bg-slate-50/40 dark:bg-slate-950/20">
          
          {/* Preset Buttons */}
          <div className="flex gap-2 pb-1 overflow-x-auto select-none no-scrollbar">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`preset-${idx}`}
                onClick={() => setUserInput(prompt)}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3 py-1.5 rounded-xl text-[10px] font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 shrink-0 select-none transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendPrompt(userInput); }}
            className="flex gap-2"
          >
            <input
              id="chat-input"
              type="text"
              required
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask anything about your customer Validation, financial spreadsheets, or pitch deck structure..."
              className="flex-1 text-xs px-4 py-3 rounded-2xl border border-slate-205 dark:border-dark-border bg-white dark:bg-slate-900/60 shadow-sm"
            />
            <button
              id="chat-submit"
              type="submit"
              disabled={!userInput.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-105 text-white p-3 rounded-2xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Action Plan side display Column */}
      <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border p-5 rounded-3xl h-full flex flex-col justify-between shadow-sm overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-900 pb-3">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h3 className="font-display font-extrabold text-xs tracking-wide uppercase text-slate-800 dark:text-white">Active Growth Action Plan</h3>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            High priority actions inferred dynamically from your diagnostic assessment results and recent dialogue commits.
          </p>

          <div className="space-y-3 pt-2">
            {currentActionPlan.map((action, idx) => (
              <div 
                key={idx}
                className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-3 hover:translate-x-0.5 transition-transform"
              >
                <div className="w-5 h-5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal font-sans font-medium">{action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-600 dark:text-slate-350">Continuous validation loop active.</span>
          </div>
          <p>Tackle adjacent milestones on your roadmap dynamically to refine advice parameters.</p>
        </div>
      </div>

    </div>
  );
}
