import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Mic2 } from 'lucide-react';

export const LyricsModal: React.FC = () => {
  const { currentTrack, currentTime, seekTo, showLyrics, setShowLyrics } = usePlayer();
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  if (!showLyrics) return null;

  return (
    <div
      id="lyrics-view-modal"
      className="fixed inset-0 z-50 bg-[#08090d]/95 backdrop-blur-2xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Live Lyrics &bull; {currentTrack.title}
          </h2>
        </div>
        <button
          onClick={() => setShowLyrics(false)}
          className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close lyrics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Synchronized Lyrics Body */}
      <div className="flex-1 overflow-y-auto py-8 max-w-lg mx-auto w-full space-y-6 text-center select-none">
        {currentTrack.lyrics.length === 0 ? (
          <div className="text-neutral-500 py-20 text-sm">
            No lyrics available for this track.
          </div>
        ) : (
          currentTrack.lyrics.map((line, idx) => {
            const nextLine = currentTrack.lyrics[idx + 1];
            const isActive =
              currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
            const isPast = currentTime > line.time && !isActive;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seekTo(line.time)}
                className={`cursor-pointer transition-all duration-300 py-2 px-4 rounded-xl ${
                  isActive
                    ? 'text-white text-xl sm:text-2xl font-black scale-105 bg-purple-500/10 text-shadow shadow-purple-500/30'
                    : isPast
                    ? 'text-neutral-500 hover:text-neutral-300 text-base sm:text-lg font-medium'
                    : 'text-neutral-400/80 hover:text-neutral-200 text-base sm:text-lg font-medium'
                }`}
              >
                {line.text}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom hint */}
      <div className="text-center text-[11px] text-neutral-400 py-2">
        Tap any line to jump to that moment in the track
      </div>
    </div>
  );
};
