import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Artist, Playlist, NavigationTab, RepeatMode, UserSettings } from '../types';
import { TRACKS, ARTISTS, PLAYLISTS } from '../data/mockData';
import { audioEngine } from '../utils/audioEngine';

interface PlayerContextType {
  // Navigation & Views
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  headerCategory: 'Music' | 'Podcasts' | 'Live';
  setHeaderCategory: (cat: 'Music' | 'Podcasts' | 'Live') => void;
  
  // Selected Details Modals
  selectedArtist: Artist | null;
  setSelectedArtist: (artist: Artist | null) => void;
  selectedPlaylist: Playlist | null;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Track & Playback
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  isFullPlayerOpen: boolean;
  showLyrics: boolean;
  showQueue: boolean;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLikeTrack: (trackId: string) => void;
  likedTrackIds: Set<string>;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  setShowLyrics: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowQueue: (show: boolean | ((prev: boolean) => boolean)) => void;
  
  // Playlists & Artists data
  allTracks: Track[];
  allPlaylists: Playlist[];
  allArtists: Artist[];
  toggleFollowArtist: (artistId: string) => void;
  createPlaylist: (title: string, description: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [headerCategory, setHeaderCategory] = useState<'Music' | 'Podcasts' | 'Live'>('Music');
  
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [allTracks, setAllTracks] = useState<Track[]>(TRACKS);
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>(PLAYLISTS);
  const [allArtists, setAllArtists] = useState<Artist[]>(ARTISTS);

  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(TRACKS[0].duration);
  const [volume, setVolState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>(TRACKS);

  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(
    new Set(TRACKS.filter((t) => t.isLiked).map((t) => t.id))
  );

  const [settings, setSettings] = useState<UserSettings>({
    audioQuality: 'ultra_lossless',
    crossfade: true,
    offlineMode: false,
    normalizeVolume: true,
    notifications: true,
    hapticFeedback: true,
  });

  const timerRef = useRef<number | null>(null);

  // Playback timer & progress
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            handleTrackEnded();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, duration]);

  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      audioEngine.playTrack(currentTrack, 0);
    } else {
      playNextTrack();
    }
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
    }
    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.playTrack(track, 0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.pause();
    } else {
      setIsPlaying(true);
      audioEngine.playTrack(currentTrack, currentTime);
    }
  };

  const seekTo = (time: number) => {
    const clampedTime = Math.max(0, Math.min(duration, time));
    setCurrentTime(clampedTime);
    if (isPlaying) {
      audioEngine.playTrack(currentTrack, clampedTime);
    }
  };

  const playNextTrack = () => {
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    let nextIndex = 0;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      setIsPlaying(false);
      audioEngine.pause();
      return;
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const playPreviousTrack = () => {
    if (currentTime > 4) {
      seekTo(0);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    let prevIndex = 0;
    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    } else {
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const setVolume = (vol: number) => {
    setVolState(vol);
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    audioEngine.setVolume(vol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });

    setAllTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const isLiked = !t.isLiked;
          return {
            ...t,
            isLiked,
            playsCount: isLiked ? t.playsCount + 1 : t.playsCount,
          };
        }
        return t;
      })
    );
  };

  const openFullPlayer = () => setIsFullPlayerOpen(true);
  const closeFullPlayer = () => setIsFullPlayerOpen(false);

  const toggleFollowArtist = (artistId: string) => {
    setAllArtists((prev) =>
      prev.map((a) => (a.id === artistId ? { ...a, isFollowing: !a.isFollowing } : a))
    );
    if (selectedArtist && selectedArtist.id === artistId) {
      setSelectedArtist((prev) => (prev ? { ...prev, isFollowing: !prev.isFollowing } : null));
    }
  };

  const createPlaylist = (title: string, description: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title,
      description,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      trackIds: [currentTrack.id],
      creator: 'You',
      gradient: 'from-violet-900/80 via-purple-950/60 to-black',
    };
    setAllPlaylists((prev) => [newPlaylist, ...prev]);
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setAllPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && !p.trackIds.includes(trackId)) {
          return { ...p, trackIds: [...p.trackIds, trackId] };
        }
        return p;
      })
    );
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        headerCategory,
        setHeaderCategory,
        selectedArtist,
        setSelectedArtist,
        selectedPlaylist,
        setSelectedPlaylist,
        isSettingsOpen,
        setIsSettingsOpen,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        isFullPlayerOpen,
        showLyrics,
        showQueue,
        playTrack,
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
        openFullPlayer,
        closeFullPlayer,
        setShowLyrics,
        setShowQueue,
        allTracks,
        allPlaylists,
        allArtists,
        toggleFollowArtist,
        createPlaylist,
        addTrackToPlaylist,
        settings,
        updateSettings,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
