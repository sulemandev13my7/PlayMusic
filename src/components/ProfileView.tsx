import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  SlidersHorizontal,
  Flame,
  Clock,
  Music,
  Heart,
  ShieldCheck,
  Headphones,
  Award,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    likedTrackIds,
    allPlaylists,
    setIsSettingsOpen,
    settings,
    setCurrentTab,
  } = usePlayer();

  const [username, setUsername] = useState('Alex Morgan');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div id="profile-view-page" className="pb-32 pt-2 px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Profile Card Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/60 via-neutral-900 to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Pro Badge */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white shadow-md">
              <Award className="w-4 h-4" />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-extrabold text-purple-300 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>PLAY PREMIUM MEMBER</span>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-black text-white">{username}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-neutral-400 hover:text-white underline"
                >
                  Edit
                </button>
              </div>
            )}

            <p className="text-xs text-neutral-400">
              sulemanafandi18@gmail.com &bull; Listening since 2023
            </p>

            {/* Followers / Following counts */}
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
              <div>
                <strong className="text-white font-black">1.2K</strong>{' '}
                <span className="text-neutral-400">Followers</span>
              </div>
              <div>
                <strong className="text-white font-black">348</strong>{' '}
                <span className="text-neutral-400">Following</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Listening Activity Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>Liked Tracks</span>
          </div>
          <p className="text-xl font-black text-white">{likedTrackIds.size}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span>Playlists</span>
          </div>
          <p className="text-xl font-black text-white">{allPlaylists.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Hours Streamed</span>
          </div>
          <p className="text-xl font-black text-white">48.2h</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Streak</span>
          </div>
          <p className="text-xl font-black text-white">14 Days</p>
        </div>
      </div>

      {/* Account Preferences Quick Links */}
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
          Quick Preferences
        </h3>

        <div className="rounded-3xl bg-white/[0.03] border border-white/5 divide-y divide-white/5 overflow-hidden">
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs font-bold text-white">Audio Quality</p>
                <p className="text-[11px] text-neutral-400">
                  {settings.audioQuality === 'ultra_lossless'
                    ? 'Ultra Lossless (24-bit / 96kHz)'
                    : settings.audioQuality.toUpperCase()}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>

          <div
            onClick={() => setCurrentTab('library')}
            className="p-4 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-white">Manage Offline Downloads</p>
                <p className="text-[11px] text-neutral-400">
                  {settings.offlineMode ? 'Offline Mode Active' : 'Cache ready (1.4 GB used)'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>

          <div
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-xs font-bold text-white">Full Settings & FAQ</p>
                <p className="text-[11px] text-neutral-400">
                  Crossfade, Volume Normalization, Help & Support
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
