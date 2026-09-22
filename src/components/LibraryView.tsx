import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Heart, Plus, Play, Pause, Music, UserCheck, X } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    allTracks,
    allPlaylists,
    allArtists,
    likedTrackIds,
    playTrack,
    currentTrack,
    isPlaying,
    togglePlayPause,
    setSelectedPlaylist,
    setSelectedArtist,
    createPlaylist,
  } = usePlayer();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Playlists' | 'Artists' | 'Liked'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const likedTracks = allTracks.filter((t) => likedTrackIds.has(t.id));
  const followedArtists = allArtists.filter((a) => a.isFollowing);

  const handlePlayLiked = () => {
    if (likedTracks.length > 0) {
      if (currentTrack.id === likedTracks[0].id) {
        togglePlayPause();
      } else {
        playTrack(likedTracks[0], likedTracks);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim(), newDesc.trim() || 'Custom playlist created by you.');
    setNewTitle('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div id="library-view-page" className="pb-32 pt-2 px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header & Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Your Library</h1>
          <button
            id="create-playlist-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-purple-600 text-white transition-all active:scale-95"
            aria-label="Create playlist"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Playlists', 'Artists', 'Liked'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Liked Songs Pinned Card */}
      {(activeFilter === 'All' || activeFilter === 'Liked') && (
        <div
          id="pinned-liked-songs-card"
          onClick={handlePlayLiked}
          className="relative p-5 rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 shadow-2xl cursor-pointer group hover:scale-[1.01] transition-all overflow-hidden border border-white/15"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/80">
                PLAYLIST &bull; AUTO SAVED
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Liked Songs
              </h2>
              <p className="text-xs text-purple-100 font-medium">
                {likedTracks.length} tracks favorited
              </p>
            </div>

            <button
              className="w-12 h-12 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-transform shrink-0"
              aria-label="Play liked songs"
            >
              {isPlaying && likedTracks.some((t) => t.id === currentTrack.id) ? (
                <Pause className="w-5 h-5 fill-purple-700" />
              ) : (
                <Play className="w-5 h-5 fill-purple-700 translate-x-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. Playlists List */}
      {(activeFilter === 'All' || activeFilter === 'Playlists') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
              Playlists ({allPlaylists.length})
            </h3>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Playlist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate group-hover:text-purple-300">
                      {pl.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 truncate">
                      {pl.trackIds.length} tracks &bull; {pl.creator}
                    </span>
                  </div>
                </div>
                <Play className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Followed Artists */}
      {(activeFilter === 'All' || activeFilter === 'Artists') && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
            Followed Artists ({followedArtists.length})
          </h3>

          {followedArtists.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4">You haven't followed any artists yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {followedArtists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist)}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer flex flex-col items-center text-center group transition-all"
                >
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover mb-2 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-bold text-white truncate max-w-full">
                    {artist.name}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {artist.monthlyListeners}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Playlist Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Playlist</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Playlist Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Synth Rides"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  placeholder="What's the vibe of this playlist?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 h-20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
