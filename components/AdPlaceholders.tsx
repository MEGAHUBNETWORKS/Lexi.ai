import React, { useEffect, useRef } from 'react';

export const TopBannerAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const scriptOptions = document.createElement('script');
      scriptOptions.type = 'text/javascript';
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '7ef8502cbbdb63ce7398ff24c36c91b8',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = 'https://www.highperformanceformat.com/7ef8502cbbdb63ce7398ff24c36c91b8/invoke.js';
      
      adRef.current.appendChild(scriptOptions);
      adRef.current.appendChild(scriptInvoke);
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-2 bg-black/40 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50 min-h-[66px]">
      <div ref={adRef} id="adsterra-banner"></div>
    </div>
  );
};

export const SidebarAd: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div className={`hidden lg:flex fixed top-24 ${side === 'left' ? 'left-4' : 'right-4'} w-[160px] h-[300px] bg-[#141821] rounded-2xl flex-col items-center justify-center p-5 text-center z-10 border border-pink-500/10 shadow-2xl`}>
    <i className="fas fa-crown text-4xl text-pink-500 mb-5 animate-pulse"></i>
    <h3 className="text-xs font-bold text-pink-400 mb-2 tracking-wide">Misty's VIP</h3>
    <p className="text-[10px] text-gray-400 leading-relaxed">Unlock deeper secrets and uncensored snaps.</p>
    <button className="mt-5 w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
      Join VIP
    </button>
  </div>
);

export const NativeAd: React.FC = () => (
  <div className="mx-auto my-6 max-w-md w-full bg-[#1a1d24] rounded-2xl p-5 border border-pink-500/20 relative overflow-hidden group shadow-xl">
    <div className="flex items-start gap-4 relative z-10">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
        <i className="fas fa-star text-xl"></i>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest">Sponsored</span>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed italic font-medium">
          "Join the elite circle and get exclusive early access to my private, unedited gallery."
        </p>
        <button className="mt-3 w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-pink-300 transition-all">
          Unlock Access
        </button>
      </div>
    </div>
  </div>
);

export const BottomAdsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const rectangleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = "https://pl28402873.effectivegatecpm.com/d501597fa1ca22d24bfcd67233d1f0f5/invoke.js";
      containerRef.current.appendChild(script);
    }

    if (bannerRef.current && !bannerRef.current.firstChild) {
      const scriptOptions = document.createElement('script');
      scriptOptions.type = 'text/javascript';
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '031f6b97d186a16274858038b4e2d98a',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = 'https://www.highperformanceformat.com/031f6b97d186a16274858038b4e2d98a/invoke.js';
      bannerRef.current.appendChild(scriptOptions);
      bannerRef.current.appendChild(scriptInvoke);
    }

    if (rectangleRef.current && !rectangleRef.current.firstChild) {
      const scriptOptions = document.createElement('script');
      scriptOptions.type = 'text/javascript';
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '493be9c622d91c9e65189777f441f298',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = 'https://www.highperformanceformat.com/493be9c622d91c9e65189777f441f298/invoke.js';
      rectangleRef.current.appendChild(scriptOptions);
      rectangleRef.current.appendChild(scriptInvoke);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-12 py-12 px-4 bg-black/60 border-t border-white/5 relative z-10">
      {/* Container Ad Slot */}
      <div id="container-d501597fa1ca22d24bfcd67233d1f0f5" ref={containerRef} className="w-full flex justify-center min-h-[50px] transition-all"></div>

      {/* Leaderboard Ad Slot */}
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-[8px] text-gray-600 uppercase font-black tracking-[0.2em]">Featured Sponsor</span>
        <div className="w-full flex justify-center overflow-x-auto py-2">
          <div ref={bannerRef} className="min-w-[728px] h-[90px] flex items-center justify-center bg-white/5 border border-white/5 rounded-xl">
             {!bannerRef.current?.firstChild && <span className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">Sponsor Connection...</span>}
          </div>
        </div>
      </div>

      {/* Rectangle Ad Slot */}
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-[8px] text-gray-600 uppercase font-black tracking-[0.2em]">Recommended</span>
        <div className="w-full flex justify-center">
          <div ref={rectangleRef} className="w-[300px] h-[250px] flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl shadow-2xl">
             {!rectangleRef.current?.firstChild && <span className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">Sponsor Connection...</span>}
          </div>
        </div>
      </div>
      
      <div className="h-8" />
    </div>
  );
};