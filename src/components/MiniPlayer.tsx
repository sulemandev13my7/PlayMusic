import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNextTrack,
    toggleLikeTrack,
    likedTrackIds,
    openFullPlayer,
  } = usePlayer();

  const isLiked = likedTrackIds.has(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      id="persistent-mini-player"
      className="fixed bottom-[60px] left-0 right-0 z-30 px-3 pb-1"
    >
      <div
        onClick={openFullPlayer}
        className="max-w-md mx-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden cursor-pointer group hover:border-purple-500/30 transition-all duration-300"
      >
        {/* Top subtle progress bar */}
        <div className="w-full bg-white/5 h-[3px]">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between p-2.5 gap-3">
          {/* Cover Art & Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-md">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms] h-4" />
                  <span className="w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms] h-3" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms] h-5" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                {currentTrack.title}
              </span>
              <span className="text-xs text-neutral-400 truncate">
                {currentTrack.artist}
              </span>
            </div>
          </div>

          {/* Quick Playback Controls */}
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Like button */}
            <button
              id="mini-player-like-btn"
              onClick={() => toggleLikeTrack(currentTrack.id)}
              aria-label={isLiked ? 'Unlike song' : 'Like song'}
              className="p-2 text-neutral-400 hover:text-white rounded-full transition-transform active:scale-90"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'
                }`}
              />
            </button>

            {/* Play / Pause button */}
            <button
              id="mini-player-play-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white text-white" />
              ) : (
                <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
              )}
            </button>

            {/* Skip Next button */}
            <button
              id="mini-player-next-btn"
              onClick={playNextTrack}
              aria-label="Skip next track"
              className="p-2 text-neutral-400 hover:text-white rounded-full transition-transform active:scale-90"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
