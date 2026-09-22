import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Headphones, Sliders, Bell, HelpCircle, Shield, Check, ChevronDown } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings } = usePlayer();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!isSettingsOpen) return null;

  const faqs = [
    {
      q: 'How does Ultra Lossless streaming work in PLAY?',
      a: 'Ultra Lossless streams full 24-bit 96kHz uncompressed audio directly into your browser using Web Audio hardware acceleration, preserving exact studio masters.',
    },
    {
      q: 'What is gapless crossfade?',
      a: 'Crossfade blends the concluding 4 seconds of a track into the beginning of the next track for a seamless DJ-style transition without silence.',
    },
    {
      q: 'Can I listen offline?',
      a: 'Yes, enabling Offline Mode caches your liked tracks and current playlists locally for playback even without an internet connection.',
    },
  ];

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 bg-[#08090d]/95 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="max-w-lg mx-auto w-full pb-20 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-black text-white tracking-tight">Settings & Preferences</h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Audio Quality Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-purple-400" />
            <span>Audio Quality</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'normal', title: 'Normal (160 kbps)', desc: 'Optimized for low data usage' },
              { id: 'high', title: 'High (320 kbps)', desc: 'Rich dynamic range with punchy bass' },
              { id: 'ultra_lossless', title: 'Ultra Lossless (24-bit / 96kHz)', desc: 'Master quality studio playback (Default)' },
            ].map((item) => {
              const isSelected = settings.audioQuality === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => updateSettings({ audioQuality: item.id as any })}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500/50'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className={`text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400">{item.desc}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Playback Preferences */}
        <div className="space-y-3">
          <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
            Playback Preferences
          </h3>

          <div className="rounded-2xl bg-white/[0.03] border border-white/5 divide-y divide-white/5">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Gapless Crossfade</p>
                <p className="text-[11px] text-neutral-400">Smooth 4-second audio transition</p>
              </div>
              <input
                type="checkbox"
                checked={settings.crossfade}
                onChange={(e) => updateSettings({ crossfade: e.target.checked })}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Normalize Volume</p>
                <p className="text-[11px] text-neutral-400">Equalize loudness across all tracks</p>
              </div>
              <input
                type="checkbox"
                checked={settings.normalizeVolume}
                onChange={(e) => updateSettings({ normalizeVolume: e.target.checked })}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Offline Mode</p>
                <p className="text-[11px] text-neutral-400">Stream exclusively from local storage</p>
              </div>
              <input
                type="checkbox"
                checked={settings.offlineMode}
                onChange={(e) => updateSettings({ offlineMode: e.target.checked })}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Notifications */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm uppercase tracking-wider">
            <Bell className="w-4 h-4 text-pink-400" />
            <span>Alerts & Updates</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">New Release Alerts</p>
              <p className="text-[11px] text-neutral-400">Notify when followed artists release music</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="w-4 h-4 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Help & FAQ (from Figma Help screen) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Help & FAQ</span>
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/5 divide-y divide-white/5 overflow-hidden">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-2"
                >
                  <span className="text-xs font-bold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-purple-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="pt-2 text-[11px] text-neutral-300 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Terms */}
        <div className="pt-4 text-center space-y-1 text-[11px] text-neutral-500">
          <p>PLAY Audio Engine v2.4 &bull; Designed in Figma</p>
          <p className="hover:underline cursor-pointer">Terms of Service &bull; Privacy Policy &bull; License</p>
        </div>
      </div>
    </div>
  );
};
