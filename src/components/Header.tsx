import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Sparkles, SlidersHorizontal, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    headerCategory,
    setHeaderCategory,
    setIsSettingsOpen,
    setCurrentTab,
  } = usePlayer();

  const categories: Array<'Music' | 'Podcasts' | 'Live'> = ['Music', 'Podcasts', 'Live'];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#08090d]/85 backdrop-blur-xl border-b border-white/5 px-4 pt-3 pb-2 transition-all">
      <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
        {/* Brand Logo matching Figma "PLAY" */}
        <div
          id="play-brand-logo"
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentTab('home')}
        >
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white text-xs font-black tracking-tighter">►</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-white via-neutral-100 to-purple-200 bg-clip-text text-transparent font-['Plus_Jakarta_Sans']">
              PLAY
            </span>
          </div>
        </div>

        {/* Category Pills (Music, Podcasts, Live) from Figma Row 1 */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/5">
          {categories.map((cat) => {
            const isActive = headerCategory === cat;
            return (
              <button
                key={cat}
                id={`category-tab-${cat.toLowerCase()}`}
                onClick={() => setHeaderCategory(cat)}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Profile/Settings action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="header-search-btn"
            onClick={() => setCurrentTab('search')}
            aria-label="Search"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button
            id="header-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
};
