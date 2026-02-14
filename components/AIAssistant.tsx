
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User, Minimize2, Lightbulb, HelpCircle, Rocket } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

const SUGGESTED_QUESTIONS = [
  { id: 1, text: "Como melhorar meu resumo?", icon: <Lightbulb size={12} /> },
  { id: 2, text: "Quais são os planos?", icon: <HelpCircle size={12} /> },
  { id: 3, text: "Dica para vaga sênior", icon: <Rocket size={12} /> }
];

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Olá! Sou a **Aya**, sua assistente WorkGen. Estou pronta para transformar seu currículo hoje. O que você gostaria de saber? ✨\n\nCaso precise de suporte técnico, você também pode nos contatar em: **workgen@profila.site**' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized, loading]);

  const handleSend = async (msgText: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const textToSend = msgText.trim();
    if (!textToSend || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: m.text
    }));

    const response = await chatWithAssistant(textToSend, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  // Função simples para renderizar Markdown básico (negrito e listas)
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Processa negrito
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-black text-brand-dark dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Processa itens de lista
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex items-start space-x-2 my-1">
            <span className="text-brand-blue">•</span>
            <span className="flex-1">{renderedLine}</span>
          </div>
        );
      }

      return <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1'}>{renderedLine}</p>;
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-blue text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group"
      >
        <Sparkles className="h-7 w-7 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 w-[400px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-[100] flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-20' : 'h-[650px] max-h-[75vh]'}`}>
      {/* Header */}
      <div className="p-6 bg-brand-blue text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2.5 rounded-xl border border-white/10">
            <Bot size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight leading-none mb-1.5">Aya Assistant</h4>
            <div className="flex items-center text-[9px] font-black opacity-80 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Especialista em Carreira
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Minimizar">
            <Minimize2 size={18} />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Fechar">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-blue text-white rounded-tr-none font-medium' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  {m.role === 'model' ? renderFormattedText(m.text) : m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Chips */}
          {!loading && (
            <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTED_QUESTIONS.map(q => (
                <button 
                  key={q.id}
                  onClick={() => handleSend(q.text)}
                  className="whitespace-nowrap flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-blue hover:border-brand-blue/30 transition-all"
                >
                  {q.icon}
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={(e) => handleSend(input, e)} className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative flex items-center gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Como descrever meu cargo atual?"
                className="flex-1 pl-5 pr-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm text-slate-800 dark:text-white"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="p-4 bg-brand-blue text-white rounded-2xl hover:bg-blue-600 disabled:opacity-30 transition-all shadow-xl shadow-blue-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
