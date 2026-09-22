export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  genre: string;
  lyrics: LyricLine[];
  playsCount: number;
  isLiked?: boolean;
  accentColor?: string;
  bpm?: number;
  keyNote?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  monthlyListeners: string;
  bio: string;
  verified: boolean;
  isFollowing?: boolean;
  topTrackIds: string[];
  genre: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  creator: string;
  gradient: string;
}

export interface GenreCategory {
  id: string;
  name: string;
  color: string;
  iconName: string;
  gradient: string;
}

export type NavigationTab = 'home' | 'search' | 'library' | 'profile';

export type RepeatMode = 'off' | 'all' | 'one';

export interface UserSettings {
  audioQuality: 'normal' | 'high' | 'ultra_lossless';
  crossfade: boolean;
  offlineMode: boolean;
  normalizeVolume: boolean;
  notifications: boolean;
  hapticFeedback: boolean;
}
