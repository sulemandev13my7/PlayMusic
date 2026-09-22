import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, ListMusic, Play, Trash2 } from 'lucide-react';

export const QueueModal: React.FC = () => {
  const { queue, currentTrack, playTrack, showQueue, setShowQueue } = usePlayer();

  if (!showQueue) return null;

  return (
    <div
      id="queue-view-modal"
      className="fixed inset-0 z-50 bg-[#08090d]/95 backdrop-blur-2xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Playback Queue ({queue.length})
          </h2>
        </div>
        <button
          onClick={() => setShowQueue(false)}
          className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close queue"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto py-4 max-w-lg mx-auto w-full space-y-2">
        {/* Currently Playing Card */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase block mb-2">
            NOW PLAYING
          </span>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-600/15 border border-purple-500/30">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate">
                  {currentTrack.title}
                </span>
                <span className="text-xs text-purple-300 truncate">
                  {currentTrack.artist}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400 px-2 py-1 rounded-md bg-purple-500/20">
              Active
            </span>
          </div>
        </div>

        {/* Up Next List */}
        <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block mb-2">
          UP NEXT
        </span>

        {queue
          .filter((t) => t.id !== currentTrack.id)
          .map((track, idx) => (
            <div
              key={track.id}
              onClick={() => playTrack(track)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-neutral-400 w-4 text-center group-hover:hidden">
                  {idx + 1}
                </span>
                <Play className="w-4 h-4 text-purple-400 hidden group-hover:block shrink-0" />
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover:text-purple-300">
                    {track.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate">
                    {track.artist}
                  </span>
                </div>
              </div>

              <span className="text-xs text-neutral-400 font-mono">
                {Math.floor(track.duration / 60)}:
                {(track.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
