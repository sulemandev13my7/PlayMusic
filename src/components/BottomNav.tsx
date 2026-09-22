import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Home, Search, Library, User } from 'lucide-react';
import { NavigationTab } from '../types';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedArtist, setSelectedPlaylist } = usePlayer();

  const handleTabClick = (tab: NavigationTab) => {
    // Clear sub-modals when switching primary tabs
    setSelectedArtist(null);
    setSelectedPlaylist(null);
    setCurrentTab(tab);
  };

  const navItems: { tab: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'search', label: 'Search', icon: Search },
    { tab: 'library', label: 'Library', icon: Library },
    { tab: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#08090d]/95 backdrop-blur-2xl border-t border-white/5 py-2 px-6"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map(({ tab, label, icon: Icon }) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              id={`nav-btn-${tab}`}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 relative ${
                isActive ? 'text-white scale-105' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
