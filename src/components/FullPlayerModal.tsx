import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  ListMusic,
  Mic2,
  Volume2,
  VolumeX,
  Plus,
  Share2,
  Check,
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const FullPlayerModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isFullPlayerOpen,
    closeFullPlayer,
    togglePlayPause,
    seekTo,
    playNextTrack,
    playPreviousTrack,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    toggleMute,
    toggleLikeTrack,
    likedTrackIds,
    showLyrics,
    setShowLyrics,
    showQueue,
    setShowQueue,
    allArtists,
    setSelectedArtist,
    allPlaylists,
    addTrackToPlaylist,
  } = usePlayer();

  const [copiedShare, setCopiedShare] = useState(false);
  const [showAddToPlaylistMenu, setShowAddToPlaylistMenu] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(24).fill(10));
  const animFrameRef = useRef<number | null>(null);

  const isLiked = likedTrackIds.has(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Real-time audio spectrum analyzer
  useEffect(() => {
    if (!isFullPlayerOpen) return;

    const updateBars = () => {
      if (isPlaying) {
        const data = audioEngine.getVisualizerData();
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(data.length / 24));
        for (let i = 0; i < 24; i++) {
          const val = data[i * step] || 0;
          bars.push(Math.max(6, Math.min(48, Math.round((val / 255) * 44) + 6)));
        }
        setVisualizerBars(bars);
      } else {
        setVisualizerBars(new Array(24).fill(6));
      }
      animFrameRef.current = requestAnimationFrame(updateBars);
    };

    animFrameRef.current = requestAnimationFrame(updateBars);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isFullPlayerOpen, isPlaying]);

  if (!isFullPlayerOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleArtistClick = () => {
    const artist = allArtists.find((a) => a.id === currentTrack.artistId);
    if (artist) {
      setSelectedArtist(artist);
      closeFullPlayer();
    }
  };

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Find active lyric line
  const activeLyricIndex = currentTrack.lyrics.reduce((acc, line, idx) => {
    return currentTime >= line.time ? idx : acc;
  }, 0);

  return (
    <div
      id="full-screen-play-modal"
      className="fixed inset-0 z-50 bg-[#08090d] flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom duration-300"
    >
      {/* Dynamic ambient background glow reflecting song palette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition-all duration-700 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${currentTrack.accentColor || '#7c3aed'} 0%, transparent 65%)`,
        }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <button
          id="close-full-player-btn"
          onClick={closeFullPlayer}
          className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Collapse player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400">
            PLAYING FROM PLAYLIST
          </span>
          <span className="text-xs font-semibold text-white/90 truncate max-w-[200px]">
            {currentTrack.album}
          </span>
        </div>

        <button
          id="player-options-btn"
          onClick={handleShare}
          className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors relative"
          aria-label="Share song"
        >
          {copiedShare ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>

      {copiedShare && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md">
          Track link copied to clipboard!
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full my-auto">
        {/* Cover Art with subtle glow and 3D depth */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group mb-6">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'scale-95 opacity-80'
            }`}
          />
          {/* Subtle vinyl groove overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none" />

          {/* Lossless badge */}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-bold tracking-widest text-neutral-300">
            HI-RES LOSSLESS
          </div>
        </div>

        {/* Real-time Spectrum Visualizer Bars */}
        <div className="flex items-end justify-center gap-1 h-12 mb-4 px-2">
          {visualizerBars.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${height}px`,
                backgroundColor: isPlaying
                  ? currentTrack.accentColor || '#a855f7'
                  : 'rgba(255,255,255,0.15)',
                opacity: isPlaying ? 0.9 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Title, Artist and Action Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col min-w-0 pr-3">
            <h1 className="text-xl sm:text-2xl font-black text-white truncate tracking-tight">
              {currentTrack.title}
            </h1>
            <button
              onClick={handleArtistClick}
              className="text-left text-sm font-medium text-neutral-400 hover:text-purple-300 transition-colors truncate"
            >
              {currentTrack.artist}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Add to Playlist button */}
            <div className="relative">
              <button
                id="add-to-playlist-btn"
                onClick={() => setShowAddToPlaylistMenu(!showAddToPlaylistMenu)}
                className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors active:scale-90"
                aria-label="Add to playlist"
              >
                <Plus className="w-5 h-5" />
              </button>

              {showAddToPlaylistMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-neutral-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase px-2 py-1 block">
                    Add to Playlist
                  </span>
                  {allPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => {
                        addTrackToPlaylist(pl.id, currentTrack.id);
                        setShowAddToPlaylistMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-white/10 rounded-lg truncate flex items-center justify-between"
                    >
                      <span className="truncate">{pl.title}</span>
                      {pl.trackIds.includes(currentTrack.id) && (
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Like button */}
            <button
              id="full-player-like-btn"
              onClick={() => toggleLikeTrack(currentTrack.id)}
              className="p-2 text-neutral-400 hover:text-white rounded-full transition-transform active:scale-90"
              aria-label={isLiked ? 'Unlike song' : 'Like song'}
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  isLiked ? 'fill-pink-500 text-pink-500 scale-110' : 'text-neutral-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Progress Scrubber Bar */}
        <div className="space-y-1 mb-4">
          <div
            id="scrubber-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seekTo(ratio * duration);
            }}
            className="group relative w-full h-2 bg-white/10 rounded-full cursor-pointer py-1"
          >
            <div
              className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform -ml-1.5 pointer-events-none"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-medium text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>

        {/* Playback Controls matching Figma "Play" */}
        <div className="flex items-center justify-between gap-3 mb-6">
          {/* Shuffle */}
          <button
            id="player-shuffle-btn"
            onClick={toggleShuffle}
            aria-label="Toggle shuffle"
            className={`p-2.5 rounded-full transition-colors ${
              isShuffle ? 'text-purple-400 bg-purple-500/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous */}
          <button
            id="player-prev-btn"
            onClick={playPreviousTrack}
            aria-label="Previous track"
            className="p-3 text-neutral-200 hover:text-white transition-transform active:scale-90"
          >
            <SkipBack className="w-7 h-7 fill-neutral-200" />
          </button>

          {/* Large Center Play / Pause */}
          <button
            id="player-main-play-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white text-white" />
            ) : (
              <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            id="player-next-btn"
            onClick={playNextTrack}
            aria-label="Next track"
            className="p-3 text-neutral-200 hover:text-white transition-transform active:scale-90"
          >
            <SkipForward className="w-7 h-7 fill-neutral-200" />
          </button>

          {/* Repeat */}
          <button
            id="player-repeat-btn"
            onClick={toggleRepeat}
            aria-label="Toggle repeat"
            className={`p-2.5 rounded-full transition-colors relative ${
              repeatMode !== 'off'
                ? 'text-purple-400 bg-purple-500/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume & Bottom Tools Row */}
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/5">
          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 max-w-[150px]">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Toggle mute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Quick Buttons: Lyrics & Queue drawers */}
          <div className="flex items-center gap-2">
            <button
              id="toggle-lyrics-sheet-btn"
              onClick={() => setShowLyrics((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                showLyrics
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>Lyrics</span>
            </button>

            <button
              id="toggle-queue-sheet-btn"
              onClick={() => setShowQueue((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                showQueue
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Lyrics Card / Preview at bottom if not in sheet */}
      {!showLyrics && currentTrack.lyrics.length > 0 && (
        <div
          onClick={() => setShowLyrics(true)}
          className="mx-6 mb-6 p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-purple-500/30 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex flex-col min-w-0 pr-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              LYRICS
            </span>
            <span className="text-sm font-semibold text-white/90 truncate group-hover:text-purple-300">
              {currentTrack.lyrics[activeLyricIndex]?.text || '♪ Instrumental ♪'}
            </span>
          </div>
          <span className="text-xs font-bold text-neutral-400 group-hover:text-white shrink-0">
            Open &gt;
          </span>
        </div>
      )}
    </div>
  );
};
