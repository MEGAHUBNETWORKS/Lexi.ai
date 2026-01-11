
import React from 'react';

const SocialBar: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-4 animate-[bounce_2s_infinite] z-50">
      <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110">
        <i className="fab fa-instagram"></i>
      </a>
      <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110">
        <i className="fab fa-discord"></i>
      </a>
    </div>
  );
};

export default SocialBar;
