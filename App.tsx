import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { MarkdownView } from './components/MarkdownView';
import { SourceList } from './components/SourceList';
import { HistorySidebar } from './components/HistorySidebar';
import { analyzeQuery } from './services/geminiService';
import { SummaryData, LoadingState, User, HistoryItem, Theme, Message } from './types';
import { ArrowRight, Link as LinkIcon, Loader2, Scroll, CheckCircle2, KeyRound, Sun, Moon, GraduationCap, Lightbulb, Headphones, Info } from 'lucide-react';

export default function App() {
  // --- State: Auth & Theme ---
  const [user, setUser] = useState<User | null>(null);
  // Default to DARK theme
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Auth Form State
  const [tempName, setTempName] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  // --- State: App Core ---
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Effects: Initialization ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('thread_digest_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // FORCE DEFAULT TO DARK THEME
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    const savedUser = localStorage.getItem('thread_digest_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      const savedHistory = localStorage.getItem(`thread_digest_history_${u.name}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // --- Auto-scroll to bottom ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  // --- Handlers: Auth ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim() || !tempPassword.trim()) return;
    
    // In a real app, we would validate the password here
    const newUser = { name: tempName.trim() };
    setUser(newUser);
    localStorage.setItem('thread_digest_user', JSON.stringify(newUser));
    
    const savedHistory = localStorage.getItem(`thread_digest_history_${newUser.name}`);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else setHistory([]);
    
    // Clear password field for security
    setTempPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setMessages([]);
    setTempName('');
    setTempPassword('');
    setQuery('');
    setStatus(LoadingState.IDLE);
    localStorage.removeItem('thread_digest_user');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('thread_digest_theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // --- Handlers: Analysis ---
  const handleSubmit = async (e: React.FormEvent, overrideQuery?: string) => {
    e.preventDefault();
    const textToAnalyze = overrideQuery || query;
    
    if (!textToAnalyze.trim()) return;
    if (status === LoadingState.LOADING) return;

    setQuery(''); // Clear input
    setStatus(LoadingState.LOADING);
    setIsHistoryOpen(false);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToAnalyze,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Pass previous messages as history for context
      const result = await analyzeQuery(textToAnalyze, messages);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: result.summary,
        sources: result.sources,
        title: result.title,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      setStatus(LoadingState.SUCCESS);

      if (user) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          query: textToAnalyze,
          summaryData: result,
          timestamp: Date.now()
        };
        const newHistory = [...history, newItem];
        setHistory(newHistory);
        localStorage.setItem(`thread_digest_history_${user.name}`, JSON.stringify(newHistory));
      }

    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
         id: Date.now().toString(),
         role: 'model',
         content: `Error: ${err.message || "Failed to analyze. Please try again."}`,
         timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      setStatus(LoadingState.ERROR);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setMessages([
      {
        id: '1',
        role: 'user',
        content: item.query,
        timestamp: item.timestamp
      },
      {
        id: '2',
        role: 'model',
        content: item.summaryData.summary,
        sources: item.summaryData.sources,
        title: item.summaryData.title,
        timestamp: item.timestamp + 1000
      }
    ]);
    setStatus(LoadingState.SUCCESS);
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your history?")) {
      setHistory([]);
      if (user) {
        localStorage.removeItem(`thread_digest_history_${user.name}`);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setQuery('');
    setStatus(LoadingState.IDLE);
  };

  const handleExampleClick = (text: string) => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent, text);
  };

  // --- View: Auth Screen ---
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <div className="w-full max-w-xl p-12 text-center space-y-10 bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="inline-flex items-center justify-center p-6 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 ring-8 ring-primary-50 dark:ring-primary-900/10">
            {/* Thread Roll Icon */}
            <Scroll className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Thread Digest</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400">Sign in to your intelligent summarizer.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 pt-6">
            <div className="space-y-4">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Name"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-dark-950 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-xl text-gray-900 dark:text-white transition-all shadow-sm"
                autoFocus
              />
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-dark-950 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-xl text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!tempName.trim() || !tempPassword.trim()}
              className="w-full py-6 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-100 text-white dark:text-slate-900 text-2xl font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Start Reading Less
            </button>
          </form>
           <div className="mt-8 flex justify-center">
            <button 
              onClick={toggleTheme}
              className="p-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- View: Landing Page (Empty State) ---
  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950 flex flex-col font-sans transition-colors duration-300">
        <Header 
          user={user} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          toggleHistory={() => setIsHistoryOpen(true)}
          onLogout={handleLogout}
        />
        <HistorySidebar 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)} 
          history={history}
          onSelect={loadHistoryItem}
          onClear={clearHistory}
        />

        <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-8 max-w-7xl mx-auto w-full">
          
          {/* Header Section */}
          <div className="text-center space-y-8 mb-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-4">
               {/* Thread Roll Icon */}
               <Scroll className="w-16 h-16 sm:w-20 sm:h-20 text-primary-600 dark:text-primary-500" strokeWidth={2} />
               <h1 className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight">
                 Thread Summarizer
               </h1>
            </div>
            {/* Updated Hero Text */}
            <p className="text-3xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              TL;DR - We read it so you don’t have to
            </p>
            <p className="text-base text-slate-400 uppercase tracking-widest font-bold">
              Powered by Gemini AI • Strict Context Analysis • Instant Results
            </p>
          </div>

          {/* Eye-Catchy Input Card */}
          <div className="w-full max-w-5xl bg-white dark:bg-dark-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 p-10 sm:p-12 mb-20 relative overflow-hidden group">
            {/* Subtle glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <label className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-200">
                 <LinkIcon className="w-6 h-6 text-primary-500" />
                 Paste URL or Topic
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="https://reddit.com/r/..."
                  className="flex-grow px-8 py-6 bg-white dark:bg-dark-950 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-xl text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="px-10 py-6 bg-slate-900 dark:bg-white text-slate-100 dark:text-slate-900 text-xl font-bold rounded-2xl hover:bg-primary-600 dark:hover:bg-primary-400 hover:text-white dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[160px] shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1"
                >
                  Summarize
                </button>
              </div>
            </form>
          </div>

          {/* Examples Section */}
          <div className="w-full max-w-7xl mb-16">
            <div className="flex items-center justify-center gap-3 mb-10">
               <span className="text-primary-500 text-3xl">✨</span>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Try These Examples</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Example 1 */}
              <div 
                onClick={() => handleExampleClick("Explain like I'm 5: How is computer data measured (bits, bytes) and visualized?")}
                className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer group"
              >
                 <div className="flex justify-between items-start mb-6">
                    <GraduationCap className="w-10 h-10 text-slate-700 dark:text-slate-300 group-hover:text-primary-500 transition-colors" />
                    <span className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase rounded-xl">Education</span>
                 </div>
                 <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">ELI5: How is data measured?</h4>
                 <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Technical explanation made simple</p>
                 <div className="text-lg font-semibold text-primary-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                   Try this example <ArrowRight className="w-5 h-5" />
                 </div>
              </div>

              {/* Example 2 */}
              <div 
                onClick={() => handleExampleClick("What is a small thing that improved your quality of life significantly?")}
                className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer group"
              >
                 <div className="flex justify-between items-start mb-6">
                    <Lightbulb className="w-10 h-10 text-slate-700 dark:text-slate-300 group-hover:text-primary-500 transition-colors" />
                    <span className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase rounded-xl">Life Tips</span>
                 </div>
                 <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Small life improvements?</h4>
                 <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Life advice and personal stories</p>
                 <div className="text-lg font-semibold text-primary-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                   Try this example <ArrowRight className="w-5 h-5" />
                 </div>
              </div>

              {/* Example 3 */}
              <div 
                onClick={() => handleExampleClick("What are the best budget audiophile headphones under $100?")}
                className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer group"
              >
                 <div className="flex justify-between items-start mb-6">
                    <Headphones className="w-10 h-10 text-slate-700 dark:text-slate-300 group-hover:text-primary-500 transition-colors" />
                    <span className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase rounded-xl">Shopping</span>
                 </div>
                 <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Best budget headphones?</h4>
                 <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Product recommendations and reviews</p>
                 <div className="text-lg font-semibold text-primary-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                   Try this example <ArrowRight className="w-5 h-5" />
                 </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="w-full max-w-6xl bg-primary-50/50 dark:bg-slate-900/50 border border-primary-100 dark:border-slate-800 rounded-3xl p-10 flex items-start gap-8">
            <div className="bg-primary-500 text-white p-4 rounded-2xl mt-1 shadow-lg shadow-primary-500/30">
              <Info className="w-8 h-8" />
            </div>
            <div>
               <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How it works</h4>
               <ul className="space-y-3 text-lg text-slate-600 dark:text-slate-300">
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Fetches the thread content strictly from your link</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Filters out jokes, spam, and noise</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Uses Gemini AI to extract key insights without external hallucinations</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Presents a structured summary in seconds</li>
               </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-base text-slate-400">
            <p>Built with React, Gemini AI, and Tailwind CSS</p>
          </div>

        </main>
      </div>
    );
  }

  // --- View: Chat Interface (Active State) ---
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex flex-col font-sans transition-colors duration-300">
      <Header 
        user={user} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleHistory={() => setIsHistoryOpen(true)}
        onLogout={handleLogout}
      />
      
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={loadHistoryItem}
        onClear={clearHistory}
      />

      <main className="flex-grow flex flex-col relative w-full max-w-7xl mx-auto px-6 sm:px-8 h-[calc(100vh-96px)]">
        
        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto pb-56 pt-12 no-scrollbar">
            <div className="space-y-12">
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                     // User Message
                     <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-5 rounded-3xl rounded-tr-sm max-w-[85%] sm:max-w-[70%] shadow-sm border border-slate-200 dark:border-slate-700">
                       <p className="whitespace-pre-wrap text-xl break-words break-all">{msg.content}</p>
                     </div>
                  ) : (
                    // AI Message
                    <div className="w-full bg-white dark:bg-dark-900 rounded-[2rem] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                       <div className="bg-gray-50 dark:bg-slate-900 px-10 py-6 border-b border-gray-100 dark:border-gray-800">
                         <div className="flex items-center gap-5">
                           {/* Orange icon background */}
                           <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-500">
                             <Scroll className="w-8 h-8" />
                           </div>
                           <h3 className="font-bold text-2xl text-slate-900 dark:text-white truncate">{msg.title || "Summary"}</h3>
                         </div>
                       </div>
                       <div className="p-10 sm:p-12">
                         <div className="prose prose-lg dark:prose-invert max-w-none">
                            <MarkdownView content={msg.content} />
                         </div>
                         {msg.sources && <SourceList sources={msg.sources} />}
                       </div>
                    </div>
                  )}
                </div>
              ))}
              
              {status === LoadingState.LOADING && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-dark-900 px-10 py-6 rounded-3xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium text-xl">Generating summary...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area - Fixed Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-dark-950 dark:via-dark-950 p-8 sm:p-10 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="w-full bg-white dark:bg-dark-900 p-4 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-gray-200 dark:border-gray-800 relative">
              <form onSubmit={(e) => handleSubmit(e)} className="flex gap-4">
                <div className="relative flex-grow">
                   <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    className="w-full pl-8 pr-16 py-5 bg-transparent text-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                    disabled={status === LoadingState.LOADING}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === LoadingState.LOADING || !query.trim()}
                  className={`
                    p-5 rounded-2xl transition-all flex-shrink-0
                    ${!query.trim() || status === LoadingState.LOADING
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 shadow-md transform hover:scale-105'
                    }
                  `}
                >
                  <ArrowRight className="w-8 h-8" />
                </button>
              </form>
            </div>
            <div className="text-center mt-5">
               <button 
                 onClick={handleNewChat} 
                 className="text-base font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-wide"
               >
                 Start New Session
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
