import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Search, X, Play, Pause, Flame, Zap, Radio, Heart, Disc, Coffee, Activity, Mic } from 'lucide-react';
import { GENRE_CATEGORIES } from '../data/mockData';
import { Track } from '../types';

export const SearchView: React.FC = () => {
  const {
    allTracks,
    allArtists,
    allPlaylists,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    setSelectedArtist,
    setSelectedPlaylist,
  } = usePlayer();

  const [query, setQuery] = useState('');

  const filteredTracks = query.trim()
    ? allTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase()) ||
          t.album.toLowerCase().includes(query.toLowerCase()) ||
          t.genre.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredArtists = query.trim()
    ? allArtists.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.genre.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredPlaylists = query.trim()
    ? allPlaylists.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const getGenreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-white/90" />;
      case 'Zap': return <Zap className="w-5 h-5 text-white/90" />;
      case 'Radio': return <Radio className="w-5 h-5 text-white/90" />;
      case 'Heart': return <Heart className="w-5 h-5 text-white/90" />;
      case 'Disc': return <Disc className="w-5 h-5 text-white/90" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-white/90" />;
      case 'Activity': return <Activity className="w-5 h-5 text-white/90" />;
      case 'Mic': return <Mic className="w-5 h-5 text-white/90" />;
      default: return <Radio className="w-5 h-5 text-white/90" />;
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, filteredTracks.length > 0 ? filteredTracks : allTracks);
    }
  };

  return (
    <div id="search-view-page" className="pb-32 pt-2 px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-white tracking-tight">Search & Explore</h1>
        
        {/* Search Bar matching Figma specs */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="search-input-field"
            type="text"
            placeholder="Search for songs, artists, or podcasts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl py-3 pl-11 pr-10 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.09] transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* When Query is Present: Show Live Search Results */}
      {query.trim() ? (
        <div className="space-y-6">
          {filteredTracks.length === 0 && filteredArtists.length === 0 && filteredPlaylists.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-neutral-400 text-sm">No results found for "{query}"</p>
              <p className="text-neutral-500 text-xs">Try searching for The Weeknd, Drake, Starboy, or Synthwave</p>
            </div>
          ) : (
            <>
              {/* Songs Results */}
              {filteredTracks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">Songs</h3>
                  <div className="space-y-1.5">
                    {filteredTracks.map((track) => {
                      const isThisPlaying = isPlaying && currentTrack.id === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => handleTrackClick(track)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer group transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isThisPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-xs font-bold truncate ${isThisPlaying ? 'text-purple-300' : 'text-white'}`}>
                                {track.title}
                              </span>
                              <span className="text-[11px] text-neutral-400 truncate">{track.artist}</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Artists Results */}
              {filteredArtists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">Artists</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => setSelectedArtist(artist)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer"
                      >
                        <img src={artist.avatarUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">{artist.name}</span>
                          <span className="text-[10px] text-neutral-400">Artist &bull; {artist.monthlyListeners}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Results */}
              {filteredPlaylists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">Playlists</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => setSelectedPlaylist(playlist)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer"
                      >
                        <img src={playlist.coverUrl} alt={playlist.title} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">{playlist.title}</span>
                          <span className="text-[10px] text-neutral-400">Playlist &bull; {playlist.creator}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* When Query is Empty: Show Genre & Mood Exploration Cards */
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-white tracking-wider uppercase">
            Browse All Genres & Moods
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GENRE_CATEGORIES.map((genre) => (
              <div
                key={genre.id}
                id={`genre-chip-${genre.id}`}
                onClick={() => setQuery(genre.name.split(' ')[0])}
                className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${genre.gradient} border border-white/10 hover:border-white/30 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 transition-all group`}
              >
                <div className="relative z-10 flex flex-col justify-between h-20">
                  <span className="text-sm font-black text-white leading-tight">
                    {genre.name}
                  </span>
                  <div className="self-end p-2 rounded-xl bg-black/20 backdrop-blur-md group-hover:scale-110 transition-transform">
                    {getGenreIcon(genre.iconName)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
