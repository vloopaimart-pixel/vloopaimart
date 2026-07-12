import { useState, useRef } from 'react';
import { ChevronRight, User, Award, Shield, LogOut, MapPin, Calendar, Star, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';

export default function ProfilePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { profile, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menu = [
    { icon: Star, label: 'My VLOOP Journey', desc: 'Lifetime dashboard & achievements', page: 'journey' },
    { icon: Award, label: 'Rewards', desc: 'SmartPoints & benefits', page: 'journey' },
    { icon: Shield, label: 'Protection', desc: 'Sponsored protection status', page: 'journey' },
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const { url, error: uploadErr } = await uploadFile('profile-photos', file, profile.id);
      if (uploadErr || !url) throw new Error(uploadErr || 'Upload failed');
      await supabase.from('profiles').update({ photo_url: url }).eq('id', profile.id);
      await refreshProfile();
    } catch (err) {
      console.error('Photo upload failed:', err);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-ink-50 animate-fade-in">
      <header className="bg-ink-900 text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold font-display">My Profile</h1>
          <button onClick={() => onNavigate('home')} className="text-sm text-sky-200 hover:text-white">Home</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-ink-200 flex items-center justify-center hover:bg-ink-50 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={12} className="animate-spin text-ink-500" /> : <Camera size={12} className="text-ink-500" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-ink-900">{profile?.name || 'Member'}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-ink-500">
                {profile?.email && <span>{profile.email}</span>}
                {profile?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-ink-400">
                <Calendar className="w-3.5 h-3.5" />
                Member since {profile ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {menu.map((m) => (
            <button
              key={m.label}
              onClick={() => onNavigate(m.page)}
              className="w-full bg-white rounded-2xl shadow-soft border border-ink-100 p-5 flex items-center gap-4 hover:border-sky-300 hover:shadow-soft-hover transition-all text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center flex-shrink-0">
                <m.icon className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-ink-900">{m.label}</div>
                <div className="text-sm text-ink-500">{m.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-300" />
            </button>
          ))}
        </div>

        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full mt-6 bg-white rounded-2xl shadow-soft border border-ink-100 p-5 flex items-center gap-4 hover:border-error-300 transition-all text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-error-50 border border-error-200 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-5 h-5 text-error-600" />
          </div>
          <span className="font-semibold text-ink-900">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
