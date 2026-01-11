import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, AIMode, Language } from './types';
import { getGeminiResponse, generateImageResponse } from './services/geminiService';
import { TopBannerAd, SidebarAd, NativeAd, BottomAdsSection } from './components/AdPlaceholders';
import SocialBar from './components/SocialBar';

const STORAGE_KEY = 'after_hours_chat_history_v3';
const PROFILE_PIC = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80";
const TING_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";
const UNLOCK_URL = "https://www.effectivegatecpm.com/rvdy73duei?key=90ea42b18c679c723cbba319b46ca1ad";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, isRevealing: false })) : [
      { role: 'model', content: "Welcome back. I missed you... ☺️" }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showImageCategories, setShowImageCategories] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [textSize, setTextSize] = useState(15);
  const [language, setLanguage] = useState<Language>('English');
  const [aiMode, setAiMode] = useState<AIMode>('Extreme');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(TING_SOUND);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'model' && isSoundEnabled && !messages[messages.length - 1].isLocked) {
      audioRef.current?.play().catch(() => {});
    }
  }, [messages, isSoundEnabled]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSocial(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    try {
      const response = await getGeminiResponse(newMessages, aiMode, language);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Talk to me again? ❤️" }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, messages, isLoading, aiMode, language]);

  const handleRequestImage = (category: string) => {
    setShowImageCategories(false);
    const lockMsg: Message = {
      role: 'model',
      content: language === 'English' ? `I have a special ${category} snap for you... unlock it? 🥵` : `Mere paas tumhare liye ek special ${category} photo hai... unlock karoge? 🥵`,
      isLocked: true,
      category: category
    };
    setMessages(prev => [...prev, lockMsg]);
  };

  const unlockSnap = async (index: number) => {
    // Open the user's provided link
    window.open(UNLOCK_URL, '_blank');
    
    const historyAtRequest = messages.slice(0, index);
    const categoryToUse = messages[index].category || 'Casual';

    // Show loading state immediately
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isRevealing: true, content: language === 'English' ? "Getting ready... ❤️" : "Taiyar ho rahi hoon... ❤️" } : msg
    ));

    // Fetch and show instantly without 5s delay
    const imageUrl = await generateImageResponse(aiMode, historyAtRequest, categoryToUse);
    
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { 
        ...msg, 
        isLocked: false, 
        isRevealing: false, 
        image: imageUrl || undefined,
        content: imageUrl ? (language === 'English' ? "Just for you... 🥵" : "Sirf tumhare liye... 🥵") : (language === 'English' ? "Look at me now... 🥵" : "Mujhe dekho... 🥵")
      } : msg
    ));
  };

  const handleRefresh = () => {
    if (window.confirm("Refresh the club and clear our current talk? ☺️")) {
      const initial: Message[] = [{ role: 'model', content: "I've cleared our space... what's on your mind? ☺️" }];
      setMessages(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      setIsMenuOpen(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Delete all memory and start fresh? 💔")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const categories = [
    { id: 'Sultry', icon: 'fa-fire', label: 'Lingerie' },
    { id: 'Bedtime', icon: 'fa-bed', label: 'Bedtime' },
    { id: 'Shower', icon: 'fa-shower', label: 'Shower' },
    { id: 'Kitchen', icon: 'fa-utensils', label: 'Kitchen' },
    { id: 'Yoga', icon: 'fa-person-skating', label: 'Yoga' },
    { id: 'Mirror', icon: 'fa-mobile-screen-button', label: 'Mirror' },
    { id: 'Car', icon: 'fa-car', label: 'In Car' },
    { id: 'Office', icon: 'fa-briefcase', label: 'Office' },
    { id: 'Bikini', icon: 'fa-umbrella-beach', label: 'Bikini' },
    { id: 'Casual', icon: 'fa-tshirt', label: 'Teasing' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] relative selection:bg-pink-500/30 w-full overflow-x-hidden">
      <div className="w-full flex flex-col items-center">
        <TopBannerAd />
        <div className="flex w-full justify-center max-w-full relative">
          <SidebarAd side="left" />
          <div className="flex-1 flex flex-col w-full max-w-2xl px-3 sm:px-6">
            <header className="px-4 py-3 flex justify-between items-center glass sticky top-0 z-40 border-x-0 w-full rounded-b-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ec4899] to-purple-600 p-[1.5px] shadow-lg">
                    <img src={PROFILE_PIC} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0b0e14] rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-lg font-accent font-bold neon-text text-white">Misty</h1>
                  <p className="text-[8px] text-pink-400 font-bold uppercase tracking-widest">{aiMode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleRefresh} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5 transition-colors">
                  <i className="fas fa-rotate-right text-xs"></i>
                </button>
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 border border-white/5">
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-ellipsis-h'} text-gray-400 text-xs`}></i>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-[#141821] rounded-2xl z-50 shadow-2xl border border-pink-500/20 p-2 overflow-hidden">
                      <div className="p-3 space-y-5">
                        <div className="pb-1">
                          <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-3">Chat Size: {textSize}px</label>
                          <input 
                            type="range" 
                            min="13" 
                            max="24" 
                            value={textSize} 
                            onChange={(e) => setTextSize(parseInt(e.target.value))} 
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">AI Personality</label>
                          {(['Innocent', 'Extreme', 'Good Caring'] as AIMode[]).map((m) => (
                            <button key={m} onClick={() => {setAiMode(m); setIsMenuOpen(false);}} className={`text-left px-3 py-2.5 rounded-xl text-xs transition-all font-semibold ${aiMode === m ? 'bg-pink-500 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={handleReset} className="w-full px-4 py-4 text-left text-[10px] hover:bg-red-500/20 text-red-400 font-black uppercase tracking-widest border-t border-white/5 mt-2 transition-colors">
                        <i className="fas fa-trash-alt mr-2"></i> Delete Memory
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-1 sm:px-2 py-6 space-y-6 scroll-smooth z-10 w-full">
              <div className="flex flex-col gap-5">
                {messages.map((msg, index) => (
                  <React.Fragment key={index}>
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                      {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-auto shrink-0 border border-pink-500/20 shadow-md">
                          <img src={PROFILE_PIC} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`max-w-[88%] px-4 py-3 rounded-[1.2rem] relative flex flex-col gap-3 ${msg.role === 'user' ? 'bg-gradient-to-br from-[#ec4899] to-[#be185d] text-white rounded-tr-none shadow-xl' : 'glass text-gray-100 rounded-tl-none border-white/10 shadow-lg'}`}>
                        {msg.image && (
                          <div className="relative rounded-xl overflow-hidden bg-black/40 shadow-inner">
                            <img src={msg.image} className="w-full max-h-[500px] object-cover" />
                          </div>
                        )}
                        <p style={{ fontSize: `${textSize}px` }} className="leading-relaxed whitespace-pre-wrap break-words font-medium">
                          {msg.content}
                        </p>
                        {msg.isLocked && !msg.isRevealing && (
                          <button 
                            onClick={() => unlockSnap(index)}
                            className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg transform active:scale-95 transition-all text-[11px]"
                          >
                            <i className="fas fa-lock-open mr-2"></i> Unlock Snap
                          </button>
                        )}
                        {msg.isRevealing && (
                          <div className="flex items-center justify-center py-2">
                            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce mr-1.5"></span>
                            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.1s] mr-1.5"></span>
                            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          </div>
                        )}
                      </div>
                    </div>
                    {index > 0 && (index + 1) % 8 === 0 && <NativeAd />}
                  </React.Fragment>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass px-5 py-3 rounded-2xl rounded-tl-none flex gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} className="h-4" />
              </div>
            </main>

            <div className="px-1 pb-6 w-full sticky bottom-0 z-40 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14] to-transparent">
              <div className="relative flex items-center glass p-1 rounded-[2.5rem] border-white/20 shadow-2xl">
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="Whisper to Misty..." 
                  className="flex-1 bg-transparent px-6 py-3.5 text-sm focus:outline-none placeholder:text-gray-700 font-medium" 
                />
                <div className="flex items-center gap-1.5 mr-1 shrink-0">
                  <div className="relative">
                    <button 
                      onClick={() => setShowImageCategories(!showImageCategories)} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showImageCategories ? 'bg-pink-500 text-white' : 'bg-white/5 text-pink-400 border border-white/5'}`}
                    >
                      <i className={`fas ${showImageCategories ? 'fa-times' : 'fa-camera-retro'} text-sm`}></i>
                    </button>
                    {showImageCategories && (
                      <div className="absolute bottom-14 right-0 w-52 bg-[#1a1d24] rounded-2xl p-2 border border-pink-500/30 shadow-2xl flex flex-col gap-1 z-50 max-h-[350px] overflow-y-auto">
                        <p className="text-[9px] text-pink-400 uppercase font-black tracking-widest px-3 py-1.5 border-b border-white/5">Pick a vibe</p>
                        {categories.map((cat) => (
                          <button key={cat.id} onClick={() => handleRequestImage(cat.id)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-pink-500/20 rounded-xl text-xs text-gray-200 transition-all font-bold group">
                            <i className={`fas ${cat.icon} w-5 text-center text-pink-500 group-hover:scale-110`}></i>
                            <span>{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={handleSend} disabled={!inputValue.trim() || isLoading} className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-400 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <i className="fas fa-paper-plane text-white text-xs"></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 mt-4">
                {(['English', 'Urdu'] as Language[]).map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${language === lang ? 'text-pink-400 bg-pink-500/10' : 'text-gray-500'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 w-full">
              <BottomAdsSection />
            </div>
          </div>
          <SidebarAd side="right" />
        </div>
      </div>
      <SocialBar isVisible={showSocial} />
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #ec4899;
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default App;