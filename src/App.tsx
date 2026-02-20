/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Globe, MessageSquare, Video, Music, Gamepad2, Sparkles, Home, Bot, Youtube, Twitter, Twitch, Instagram, Github, Grid3X3, Bird, Ghost, LayoutGrid, Box, TrendingDown, Plus, X, Settings, ArrowLeft, ArrowRight, RotateCw, Code, ShieldAlert, EyeOff, Keyboard, ExternalLink } from 'lucide-react';
import Starfield from './components/Starfield';
import { GoogleGenAI } from '@google/genai';

const CLOAKS: Record<string, { title: string, icon: string }> = {
  none: { title: 'Echo V4', icon: '/vite.svg' },
  google: { title: 'Google', icon: 'https://www.google.com/favicon.ico' },
  drive: { title: 'My Drive - Google Drive', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' },
  classroom: { title: 'Classes', icon: 'https://www.gstatic.com/classroom/favicon.png' },
};

const QUICK_APPS = [
  { name: 'TikTok', image: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', color: 'shadow-pink-500/20', url: 'https://www.tiktok.com' },
  { name: 'Discord', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png', color: 'shadow-indigo-500/20', url: 'https://discord.com/app' },
  { name: 'YouTube', image: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', color: 'shadow-red-500/20', url: 'https://www.youtube.com' },
  { name: 'Twitter', image: 'https://cdn-icons-png.flaticon.com/512/733/733579.png', color: 'shadow-blue-400/20', url: 'https://twitter.com' },
  { name: 'Twitch', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png', color: 'shadow-purple-500/20', url: 'https://twitch.tv' },
  { name: 'Instagram', image: 'https://cdn-icons-png.flaticon.com/512/174/174855.png', color: 'shadow-pink-600/20', url: 'https://instagram.com' },
  { name: 'Fortnite', image: 'https://cdn-icons-png.flaticon.com/512/10300/10300438.png', color: 'shadow-blue-500/20', url: 'https://www.xbox.com/en-US/play/games/fortnite/BT5P2X999VH2' },
  { name: 'GeForce Now', image: 'https://cdn-icons-png.flaticon.com/512/882/882731.png', color: 'shadow-green-400/20', url: 'https://play.geforcenow.com' },
  { name: 'Google', image: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', color: 'shadow-blue-500/20', url: 'https://www.google.com/webhp?igu=1' },
  { name: 'Movies', image: 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png', color: 'shadow-yellow-500/20', url: 'https://bcine.app' },
];

const BUILT_IN_GAMES = [
  { name: 'Poki Games', icon: Gamepad2, url: 'https://poki.com' },
  { name: 'GN Math', icon: LayoutGrid, url: 'https://gn-math.dev' },
  { name: 'now.gg', icon: Globe, url: 'https://now.gg' },
  { name: '2048', icon: Grid3X3, url: 'https://play2048.co/' },
  { name: 'Flappy Bird', icon: Bird, url: 'https://flappybird.io/' },
  { name: 'Pac-Man', icon: Ghost, url: 'https://freepacman.org/' },
  { name: 'Tetris', icon: LayoutGrid, url: 'https://tetris.com/play-tetris' },
  { name: 'Minecraft', icon: Box, url: 'https://eaglercrafthub.com' },
  { name: 'Slope', icon: TrendingDown, url: 'https://slopegame.online/' }
];

function AITab() {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'No response' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-[60vh] flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <Sparkles className="w-12 h-12 mb-4 opacity-50" />
            <p>Hello! I am Echo AI. How can I help you today?</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-zinc-400 rounded-2xl px-4 py-3 animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Echo AI..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'games' | 'ai' | 'settings' | 'music'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [proxyUrlInput, setProxyUrlInput] = useState('');
  const [cloakType, setCloakType] = useState<string>('none');
  const [panicUrl, setPanicUrl] = useState<string>('https://google.com');
  const [panicKey, setPanicKey] = useState<string>('`');
  const [isBinding, setIsBinding] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const cloak = CLOAKS[cloakType] || CLOAKS.none;
    document.title = cloak.title;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = cloak.icon;
  }, [cloakType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBinding) {
        e.preventDefault();
        setPanicKey(e.key);
        setIsBinding(false);
        return;
      }
      if (e.key === panicKey) {
        window.location.href = panicUrl;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl, isBinding]);

  useEffect(() => {
    if (activeUrl) {
      setProxyUrlInput(activeUrl);
    }
  }, [activeUrl]);

  const handleProxyUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = proxyUrlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setActiveUrl(url);
  };

  const injectEruda = () => {
    if (iframeRef.current) {
      const script = `
        (function () { 
          var script = document.createElement('script'); 
          script.src="//cdn.jsdelivr.net/npm/eruda"; 
          document.body.appendChild(script); 
          script.onload = function () { eruda.init() } 
        })();
      `;
      // This will only work if the iframe is same-origin or has relaxed security
      try {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (doc) {
          const s = doc.createElement('script');
          s.textContent = script;
          doc.body.appendChild(s);
        }
      } catch (e) {
        console.error("Cannot inject Eruda due to cross-origin restrictions", e);
        alert("Cannot inject Eruda on this site due to security restrictions (CORS).");
      }
    }
  };

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const goBack = () => {
    try {
      iframeRef.current?.contentWindow?.history.back();
    } catch (e) {
      console.error("Back navigation failed", e);
    }
  };

  const goForward = () => {
    try {
      iframeRef.current?.contentWindow?.history.forward();
    } catch (e) {
      console.error("Forward navigation failed", e);
    }
  };
  const [customApps, setCustomApps] = useState<{name: string, url: string, image?: string}[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    let url = searchQuery.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(url) + '&igu=1';
      }
    }
    setActiveUrl(url);
  };

  const openApp = (url: string) => {
    setActiveUrl(url);
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim() || !newAppUrl.trim()) return;
    
    let url = newAppUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    setCustomApps([...customApps, { name: newAppName.trim(), url }]);
    setNewAppName('');
    setNewAppUrl('');
    setIsAddModalOpen(false);
  };

  if (activeUrl) {
    return (
      <div className="w-full h-screen flex flex-col bg-black text-white font-sans">
        <div className="flex items-center gap-2 p-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-1 mr-2">
            <button 
              onClick={() => setActiveUrl('')}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button 
              onClick={goBack}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goForward}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Forward"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={reloadIframe}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Reload"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.open(activeUrl, '_blank')}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Open in New Tab (Fixes Blocked Sites)"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleProxyUrlSubmit} className="flex-1 flex items-center bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-700 focus-within:border-purple-500 transition-colors">
            <Globe className="w-4 h-4 text-zinc-500 mr-2" />
            <input 
              type="text" 
              value={proxyUrlInput}
              onChange={(e) => setProxyUrlInput(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-zinc-200"
            />
          </form>

          <div className="flex items-center gap-1 ml-2">
            <button 
              onClick={injectEruda}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Inspect (Eruda)"
            >
              <Code className="w-5 h-5" />
            </button>
          </div>
        </div>
        <iframe 
          ref={iframeRef}
          src={activeUrl} 
          className="flex-1 w-full border-none bg-white"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden text-white font-sans selection:bg-purple-500/30">
      <Starfield />
      
      {/* Navigation */}
      <nav className="relative z-20 w-full flex justify-center pt-8 pb-4">
        <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-2xl shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
            <Home className="w-4 h-4" /> Home
          </button>
          <button onClick={() => setActiveTab('games')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'games' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
            <Gamepad2 className="w-4 h-4" /> Games
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
            <Bot className="w-4 h-4" /> AI
          </button>
          <button onClick={() => setActiveTab('music')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'music' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
            <Music className="w-4 h-4" /> Music
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center mt-12 pb-20">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            <div className="mb-12 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
                  Echo
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-600 ml-4">
                  V4
                </span>
              </h1>
            </div>

            <form 
              onSubmit={handleSearch}
              className="w-full max-w-3xl relative group"
            >
              <div className="relative p-[2px] rounded-2xl overflow-hidden shadow-2xl">
                {/* Spinning purplish line */}
                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#a855f7_100%)]"></div>
                
                {/* Inner search bar */}
                <div className="relative flex items-center bg-zinc-900/95 backdrop-blur-xl rounded-2xl p-2 w-full h-full">
                  <div className="pl-4 pr-2 text-zinc-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search the web or enter a URL..."
                    className="flex-1 bg-transparent border-none outline-none text-lg py-3 px-2 text-white placeholder:text-zinc-500"
                  />
                  <button 
                    type="submit"
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-16 w-full max-w-4xl">
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {QUICK_APPS.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => openApp(app.url)}
                    className="flex flex-col items-center gap-3 group w-20"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/20 group-hover:border-purple-500/50 overflow-hidden p-3 ${app.color}`}>
                      <img src={app.image} alt={app.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors text-center truncate w-full">
                      {app.name}
                    </span>
                  </button>
                ))}

                {customApps.map((app, idx) => (
                  <button
                    key={`custom-${idx}`}
                    onClick={() => openApp(app.url)}
                    className="flex flex-col items-center gap-3 group w-20"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/20 group-hover:border-purple-500/50 overflow-hidden p-3">
                      <Globe className="w-full h-full text-zinc-400" />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors text-center truncate w-full">
                      {app.name}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex flex-col items-center gap-3 group w-20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900/30 backdrop-blur-md border border-dashed border-zinc-700 flex items-center justify-center group-hover:bg-zinc-800 group-hover:scale-110 transition-all duration-300 group-hover:border-solid group-hover:border-purple-500/50">
                    <Plus className="w-8 h-8 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 group-hover:text-purple-400 transition-colors text-center">
                    Add App
                  </span>
                </button>
              </div>
            </div>

            {/* Add App Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                >
                  <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                    <h3 className="text-xl font-bold text-white">Add Custom App</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={handleAddApp} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">App Name</label>
                      <input
                        type="text"
                        value={newAppName}
                        onChange={(e) => setNewAppName(e.target.value)}
                        placeholder="e.g. Reddit"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">App URL</label>
                      <input
                        type="text"
                        value={newAppUrl}
                        onChange={(e) => setNewAppUrl(e.target.value)}
                        placeholder="e.g. reddit.com"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        Add App
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'games' && (
          <motion.div
            key="games"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Games Arcade</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {BUILT_IN_GAMES.map(game => (
                <button
                  key={game.name}
                  onClick={() => openApp(game.url)}
                  className="group relative h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <game.icon className="w-10 h-10 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                    <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">{game.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <AITab />
          </motion.div>
        )}

        {activeTab === 'music' && (
          <motion.div
            key="music"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Spotify Music</h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800">
                <iframe 
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM3M?utm_source=generator" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>
              <p className="mt-4 text-zinc-500 text-sm text-center">
                Connect your Spotify account to listen to your favorite tracks.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Settings</h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-semibold text-zinc-200">
                  <EyeOff className="w-5 h-5 text-purple-400" />
                  <h3>Tab Cloaker</h3>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <p className="text-sm text-zinc-400 mb-3">Change how this tab appears in your browser history and tab bar.</p>
                  <select 
                    value={cloakType}
                    onChange={(e) => setCloakType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                  >
                    <option value="none">None (Echo V4)</option>
                    <option value="google">Google Search</option>
                    <option value="drive">Google Drive</option>
                    <option value="classroom">Google Classroom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-semibold text-zinc-200">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <h3>Panic Button</h3>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 space-y-4">
                  <p className="text-sm text-zinc-400">Quickly redirect to a safe site when someone walks in.</p>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Redirect URL</label>
                    <input 
                      type="text"
                      value={panicUrl}
                      onChange={(e) => setPanicUrl(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500 transition-all"
                      placeholder="https://google.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Panic Key</label>
                    <div className="flex gap-2">
                      <div className={`flex-1 flex items-center bg-zinc-900 border ${isBinding ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'border-zinc-700'} rounded-lg px-4 py-2 text-white transition-all duration-300`}>
                        <Keyboard className={`w-4 h-4 mr-2 ${isBinding ? 'text-purple-400 animate-pulse' : 'text-zinc-500'}`} />
                        <span className={isBinding ? 'text-purple-400 font-medium' : 'text-zinc-300'}>
                          {isBinding ? 'Press any key...' : panicKey === ' ' ? 'Space' : panicKey}
                        </span>
                      </div>
                      <button 
                        onClick={() => setIsBinding(!isBinding)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isBinding ? 'bg-zinc-700 text-zinc-300' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20'}`}
                      >
                        {isBinding ? 'Cancel' : 'Bind Key'}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Press the panic key to trigger the redirect instantly.</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = panicUrl}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg transition-colors font-medium"
                  >
                    Test Panic Button
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-zinc-200">Appearance</h3>
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <div>
                    <p className="font-medium text-white">Starfield Background</p>
                    <p className="text-sm text-zinc-400">Toggle the animated stars</p>
                  </div>
                  <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-zinc-200">Search Engine</h3>
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500">
                    <option>Google</option>
                    <option>DuckDuckGo</option>
                    <option>Bing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-zinc-200">About</h3>
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-zinc-400 text-sm">
                  <p>Echo V4 Proxy</p>
                  <p className="mt-1">Version 4.0.0</p>
                  <p className="mt-4">Built by Xubty, ayden, and sofaking.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
