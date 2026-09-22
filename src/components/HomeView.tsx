import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Heart, Sparkles, TrendingUp, Music2, Radio, Mic } from 'lucide-react';
import { Track } from '../types';

export const HomeView: React.FC = () => {
  const {
    allTracks,
    allPlaylists,
    allArtists,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLikeTrack,
    likedTrackIds,
    setSelectedArtist,
    setSelectedPlaylist,
    headerCategory,
  } = usePlayer();

  const featuredTrack = allTracks[1]; // "Blinding Lights" or "Starboy"
  const isFeaturedPlaying = isPlaying && currentTrack.id === featuredTrack?.id;

  const handleTrackCardClick = (track: Track) => {
    if (currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, allTracks);
    }
  };

  return (
    <div id="home-view-feed" className="pb-32 pt-2 px-4 max-w-4xl mx-auto space-y-7 animate-in fade-in duration-300">
      {/* Category Notification / Switch Banner if Podcasts or Live */}
      {headerCategory !== 'Music' && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black border border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {headerCategory === 'Podcasts' ? (
              <Mic className="w-5 h-5 text-purple-400 shrink-0" />
            ) : (
              <Radio className="w-5 h-5 text-pink-400 shrink-0 animate-pulse" />
            )}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {headerCategory === 'Podcasts' ? 'Curated Audio Episodes' : 'Live Streams & Stations'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {headerCategory === 'Podcasts'
                  ? 'Trending music commentaries, interviews, and sonic deep dives.'
                  : 'Broadcasting live 24/7 lo-fi beats, synthwave radio, and club sets.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/10 text-white shrink-0">
            {headerCategory === 'Live' ? 'ON AIR' : 'NEW'}
          </span>
        </div>
      )}

      {/* 1. Hero Featured Banner ("Recommended for you") */}
      <section id="hero-featured-banner" className="relative">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-950/80 to-neutral-950 p-6 sm:p-8 border border-white/10 shadow-2xl">
          {/* Ambient background decoration */}
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold text-purple-300 uppercase tracking-widest border border-white/10">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>Recommended For You</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {featuredTrack.title}
              </h2>
              <p className="text-sm font-semibold text-neutral-300">
                {featuredTrack.artist} &bull; <span className="text-purple-400 font-normal">{featuredTrack.album}</span>
              </p>
              <p className="text-xs text-neutral-400 line-clamp-2">
                Chart-topping record with {Math.round(featuredTrack.playsCount / 1000000).toLocaleString()}M+ streams worldwide.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  id="hero-play-btn"
                  onClick={() => handleTrackCardClick(featuredTrack)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
                >
                  {isFeaturedPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white text-white" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                      <span>PLAY NOW</span>
                    </>
                  )}
                </button>

                <button
                  id="hero-like-btn"
                  onClick={() => toggleLikeTrack(featuredTrack.id)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                  aria-label="Like featured track"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedTrackIds.has(featuredTrack.id) ? 'fill-pink-500 text-pink-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Album Thumbnail with glow */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/15 mx-auto sm:mx-0">
              <img
                src={featuredTrack.coverUrl}
                alt={featuredTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Recently Played Carousel (Figma Row 1) */}
      <section id="recently-played-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            Recently Played
          </h2>
          <span className="text-xs text-purple-400 font-semibold cursor-pointer hover:underline">
            See all
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {allTracks.slice(0, 6).map((track) => {
            const isThisPlaying = isPlaying && currentTrack.id === track.id;
            return (
              <div
                key={track.id}
                id={`recent-track-${track.id}`}
                onClick={() => handleTrackCardClick(track)}
                className="w-36 shrink-0 group cursor-pointer space-y-2"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-purple-500/40 transition-all shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  {/* Hover / Active Play Button */}
                  <div
                    className={`absolute bottom-2 right-2 w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transition-all ${
                      isThisPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Top Charts / Trending List */}
      <section id="top-charts-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            Top Charts & Global Trending
          </h2>
          <span className="text-xs text-purple-400 font-semibold cursor-pointer hover:underline">
            View Chart
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allTracks.map((track, idx) => {
            const isThisPlaying = isPlaying && currentTrack.id === track.id;
            const isLiked = likedTrackIds.has(track.id);

            return (
              <div
                key={track.id}
                id={`chart-track-${track.id}`}
                onClick={() => handleTrackCardClick(track)}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer group ${
                  isThisPlaying
                    ? 'bg-purple-600/15 border-purple-500/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-5 text-center text-xs font-black ${idx < 3 ? 'text-purple-400' : 'text-neutral-400'}`}>
                    {idx + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 text-white fill-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-bold truncate ${isThisPlaying ? 'text-purple-300' : 'text-white'}`}>
                      {track.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 truncate">
                      {track.artist}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleLikeTrack(track.id)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-full transition-all"
                    aria-label="Like track"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'}`} />
                  </button>
                  <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Popular Artists Hub (Figma Row 2) */}
      <section id="popular-artists-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white tracking-tight">
            Popular Artists
          </h2>
          <span className="text-xs text-purple-400 font-semibold cursor-pointer hover:underline">
            Explore
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allArtists.map((artist) => (
            <div
              key={artist.id}
              id={`artist-card-${artist.id}`}
              onClick={() => setSelectedArtist(artist)}
              className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2.5 shadow-lg border-2 border-white/10 group-hover:border-purple-400 transition-colors">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xs font-bold text-white truncate max-w-full group-hover:text-purple-300">
                {artist.name}
              </h4>
              <p className="text-[10px] text-neutral-400 truncate max-w-full">
                {artist.genre}
              </p>
              <span className="mt-2 text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10">
                {artist.isFollowing ? 'Following' : 'View Profile'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Curated Playlists / Made For You */}
      <section id="curated-playlists-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white tracking-tight">
            Made For You
          </h2>
          <span className="text-xs text-purple-400 font-semibold cursor-pointer hover:underline">
            All Playlists
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              id={`playlist-card-${playlist.id}`}
              onClick={() => setSelectedPlaylist(playlist)}
              className={`p-4 rounded-3xl bg-gradient-to-br ${playlist.gradient} border border-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-xl flex items-center justify-between gap-4`}
            >
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold tracking-wider uppercase text-purple-300">
                  {playlist.creator}
                </span>
                <h3 className="text-base font-extrabold text-white truncate group-hover:text-purple-200">
                  {playlist.title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2">
                  {playlist.description}
                </p>
                <div className="pt-2 text-[11px] font-bold text-white/80">
                  {playlist.trackIds.length} Songs &bull; Listen Now &rarr;
                </div>
              </div>

              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
