import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { ArrowLeft, CheckCircle, Play, Pause, Heart, UserPlus, UserCheck } from 'lucide-react';
import { Track } from '../types';

export const ArtistProfileModal: React.FC = () => {
  const {
    selectedArtist,
    setSelectedArtist,
    allTracks,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLikeTrack,
    likedTrackIds,
    toggleFollowArtist,
  } = usePlayer();

  if (!selectedArtist) return null;

  const artistTracks = allTracks.filter(
    (t) => t.artistId === selectedArtist.id || t.artist.includes(selectedArtist.name)
  );

  const isCurrentArtistPlaying =
    isPlaying && artistTracks.some((t) => t.id === currentTrack.id);

  const handlePlayArtist = () => {
    if (artistTracks.length > 0) {
      if (isCurrentArtistPlaying) {
        togglePlayPause();
      } else {
        playTrack(artistTracks[0], artistTracks);
      }
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, artistTracks);
    }
  };

  return (
    <div
      id="artist-profile-view"
      className="fixed inset-0 z-40 bg-[#08090d] overflow-y-auto pb-32 animate-in fade-in duration-200"
    >
      {/* Top Banner with Artist Image */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img
          src={selectedArtist.bannerUrl}
          alt={selectedArtist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-black/30" />

        {/* Floating Back Button */}
        <button
          onClick={() => setSelectedArtist(null)}
          className="absolute top-5 left-5 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Artist Name & Stats Overlay */}
        <div className="absolute bottom-5 left-6 right-6 max-w-4xl mx-auto space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 fill-purple-400 text-black" />
            <span>Verified Artist</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {selectedArtist.name}
          </h1>
          <p className="text-xs text-neutral-300 font-medium">
            {selectedArtist.monthlyListeners} monthly listeners
          </p>
        </div>
      </div>

      <div className="px-5 max-w-4xl mx-auto space-y-7 pt-4">
        {/* Action Row: Play, Follow, Share */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayArtist}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all"
          >
            {isCurrentArtistPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
                <span>PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleFollowArtist(selectedArtist.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
              selectedArtist.isFollowing
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-transparent text-purple-300 border-purple-500/40 hover:bg-purple-500/10'
            }`}
          >
            {selectedArtist.isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>

        {/* Popular Tracks Section */}
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-white tracking-tight">
            Popular Releases
          </h2>

          <div className="space-y-2">
            {artistTracks.map((track, idx) => {
              const isThisPlaying = isPlaying && currentTrack.id === track.id;
              const isLiked = likedTrackIds.has(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${
                    isThisPlaying
                      ? 'bg-purple-600/15 border-purple-500/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-4 text-center text-xs font-bold text-neutral-400">
                      {idx + 1}
                    </span>

                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold truncate ${isThisPlaying ? 'text-purple-300' : 'text-white'}`}>
                        {track.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 truncate">
                        {Math.round(track.playsCount / 1000000).toLocaleString()}M plays
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleLikeTrack(track.id)}
                      className="text-neutral-400 hover:text-white"
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

        {/* About Section */}
        <div className="space-y-2 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
          <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
            About {selectedArtist.name}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {selectedArtist.bio}
          </p>
          <div className="pt-2 flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Primary Genre: <strong className="text-white">{selectedArtist.genre}</strong></span>
            <span>Monthly Reach: <strong className="text-purple-300">{selectedArtist.monthlyListeners}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
