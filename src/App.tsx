import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { LyricsModal } from './components/LyricsModal';
import { QueueModal } from './components/QueueModal';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { LibraryView } from './components/LibraryView';
import { ProfileView } from './components/ProfileView';
import { ArtistProfileModal } from './components/ArtistProfileModal';
import { PlaylistDetailModal } from './components/PlaylistDetailModal';
import { SettingsModal } from './components/SettingsModal';

const MainContent: React.FC = () => {
  const { currentTab, isFullPlayerOpen } = usePlayer();

  return (
    <div className="min-h-screen bg-[#08090d] text-white flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Active Tab Feed */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && <HomeView />}
        {currentTab === 'search' && <SearchView />}
        {currentTab === 'library' && <LibraryView />}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Detail Overlays */}
      <ArtistProfileModal />
      <PlaylistDetailModal />

      {/* Playback Modals & Persistent Controls */}
      <LyricsModal />
      <QueueModal />
      <SettingsModal />

      {/* Persistent Mini Player */}
      {!isFullPlayerOpen && <MiniPlayer />}

      {/* Full Screen Player Modal */}
      <FullPlayerModal />

      {/* Persistent Bottom Tab Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <MainContent />
    </PlayerProvider>
  );
}
