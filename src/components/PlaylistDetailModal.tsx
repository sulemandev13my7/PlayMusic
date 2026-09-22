import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { ArrowLeft, Play, Pause, Shuffle, Heart, Clock } from 'lucide-react';
import { Track } from '../types';

export const PlaylistDetailModal: React.FC = () => {
  const {
    selectedPlaylist,
    setSelectedPlaylist,
    allTracks,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLikeTrack,
    likedTrackIds,
  } = usePlayer();

  if (!selectedPlaylist) return null;

  const playlistTracks = allTracks.filter((t) =>
    selectedPlaylist.trackIds.includes(t.id)
  );

  const isPlaylistActive =
    isPlaying && playlistTracks.some((t) => t.id === currentTrack.id);

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      if (isPlaylistActive) {
        togglePlayPause();
      } else {
        playTrack(playlistTracks[0], playlistTracks);
      }
    }
  };

  const handleShufflePlay = () => {
    if (playlistTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlistTracks.length);
      playTrack(playlistTracks[randomIndex], playlistTracks);
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, playlistTracks);
    }
  };

  const totalSeconds = playlistTracks.reduce((acc, t) => acc + t.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div
      id="playlist-detail-view"
      className="fixed inset-0 z-40 bg-[#08090d] overflow-y-auto pb-32 animate-in fade-in duration-200"
    >
      {/* Header Banner */}
      <div className={`relative p-6 sm:p-8 bg-gradient-to-b ${selectedPlaylist.gradient} to-[#08090d] pt-14`}>
        <button
          onClick={() => setSelectedPlaylist(null)}
          className="absolute top-5 left-5 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 max-w-4xl mx-auto">
          <img
            src={selectedPlaylist.coverUrl}
            alt={selectedPlaylist.title}
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover shadow-2xl border border-white/10 shrink-0"
          />

          <div className="space-y-2 text-center sm:text-left min-w-0">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-300">
              PLAYLIST &bull; {selectedPlaylist.creator}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {selectedPlaylist.title}
            </h1>
            <p className="text-xs text-neutral-300 max-w-lg">
              {selectedPlaylist.description}
            </p>
            <div className="text-[11px] text-neutral-400 font-medium">
              {playlistTracks.length} tracks &bull; approx. {totalMinutes} min
            </div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-6 max-w-4xl mx-auto py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAll}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
            aria-label="Play all"
          >
            {isPlaylistActive ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleShufflePlay}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            aria-label="Shuffle play"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Track Listing */}
      <div className="px-6 max-w-4xl mx-auto pt-4 space-y-1.5">
        {playlistTracks.map((track, idx) => {
          const isThisPlaying = isPlaying && currentTrack.id === track.id;
          const isLiked = likedTrackIds.has(track.id);

          return (
            <div
              key={track.id}
              onClick={() => handleTrackClick(track)}
              className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer group ${
                isThisPlaying
                  ? 'bg-purple-600/15 border-purple-500/40'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-center text-xs font-bold text-neutral-400 group-hover:text-purple-300">
                  {idx + 1}
                </span>

                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />

                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold truncate ${isThisPlaying ? 'text-purple-300' : 'text-white'}`}>
                    {track.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate">
                    {track.artist}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleLikeTrack(track.id)}
                  className="p-1 text-neutral-400 hover:text-white"
                  aria-label="Like"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                </button>
                <span className="text-xs text-neutral-400 font-mono">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
