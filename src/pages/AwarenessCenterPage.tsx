import { useState, useEffect } from 'react';
import { Play, Clock, Eye, Share2, ChevronRight, Sparkles, Youtube, Instagram, MessageCircle, Sparkle, Bot, User, Heart, Bookmark, X, ExternalLink } from 'lucide-react';
import { supabase, type AwarenessContent, type DailyHint } from '../lib/supabase';
import { MASCOTS, getAwarenessContent, getDailyHints, incrementViewCount, trackSocialShare, getShareMessage } from '../lib/engagementEngine';

type AwarenessCenterPageProps = {
  onNavigate: (page: string) => void;
};

export default function AwarenessCenterPage({ onNavigate }: AwarenessCenterPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'cartoons' | 'videos' | 'hints' | 'discussions'>('all');
  const [content, setContent] = useState<AwarenessContent[]>([]);
  const [hints, setHints] = useState<DailyHint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<AwarenessContent | null>(null);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'hints') {
        const hintsData = await getDailyHints();
        setHints(hintsData);
      } else {
        let type: AwarenessContent['content_type'] | undefined;
        if (activeTab === 'cartoons') type = 'cartoon';
        else if (activeTab === 'videos') type = 'educational_video';
        else if (activeTab === 'discussions') type = 'smartcode_discussion';

        const contentData = await getAwarenessContent(type, 20);
        setContent(contentData);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    }
    setLoading(false);
  };

  const handleViewContent = async (item: AwarenessContent) => {
    setSelectedContent(item);
    await incrementViewCount(item.id);
  };

  const handleShare = async (platform: 'whatsapp' | 'facebook' | 'instagram', item: AwarenessContent) => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (userId) {
      await trackSocialShare(userId, platform as any, 'awareness_video', item.id);
    }

    const message = encodeURIComponent(getShareMessage(platform, 'awareness_video'));
    const url = encodeURIComponent(`https://vloop.ai/awareness/${item.id}`);

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${message}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: `https://www.instagram.com/`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  const getMascot = (mascot: string | null) => {
    if (!mascot) return MASCOTS.vloop_owl;
    return MASCOTS[mascot as keyof typeof MASCOTS] || MASCOTS.vloop_owl;
  };

  const contentTypes = [
    { key: 'all', label: 'All Content', icon: Sparkles },
    { key: 'cartoons', label: 'Cartoons', icon: Heart },
    { key: 'videos', label: 'Videos', icon: Play },
    { key: 'hints', label: 'Daily Hints', icon: Bookmark },
    { key: 'discussions', label: 'Discussions', icon: MessageCircle },
  ];

  const featuredContent = content.filter(c => c.view_count > 0).slice(0, 3);

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header with Mascots */}
      <div className="bg-gradient-to-br from-vloop-700 via-vloop-800 to-vloop-950 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-vloop-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
              <Sparkle size={24} className="text-vloop-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display">VLOOP Awareness Center</h1>
              <p className="text-vloop-200 text-sm">Learn, engage, and stay informed</p>
            </div>
          </div>

          {/* Mascots */}
          <div className="flex flex-wrap gap-3 mt-6">
            {Object.entries(MASCOTS).slice(0, 3).map(([key, mascot]) => (
              <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                  {key === 'vloop_owl' ? '🦉' : key === 'vloop_robot' ? '🤖' : '👤'}
                </div>
                <div>
                  <div className="text-xs font-bold">{mascot.name}</div>
                  <div className="text-[10px] text-vloop-300">{mascot.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {contentTypes.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-vloop-600 text-white shadow-md'
                    : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'hints' ? (
          // Daily Hints View
          <div className="space-y-4">
            {hints.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Hints Available</h3>
                <p className="text-gray-400 text-sm">Check back later for SmartCode and quiz hints</p>
              </div>
            ) : (
              hints.map((hint) => (
                <div key={hint.id} className="card-premium p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      hint.hint_type === 'smartcode' ? 'bg-gold-100 text-gold-600' :
                      hint.hint_type === 'quiz' ? 'bg-vloop-100 text-vloop-600' :
                      'bg-success-100 text-success-600'
                    }`}>
                      {hint.hint_type === 'smartcode' ? '🎯' : hint.hint_type === 'quiz' ? '❓' : '💡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 uppercase mb-1">{hint.hint_type} Hint</div>
                      <h3 className="font-bold text-gray-900 mb-2">{hint.title}</h3>
                      {hint.content && <p className="text-sm text-gray-600">{hint.content}</p>}
                      {hint.image_url && (
                        <img src={hint.image_url} alt="" className="mt-3 rounded-xl max-h-48 object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Content Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Play size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Content Available</h3>
                <p className="text-gray-400 text-sm">New content coming soon!</p>
              </div>
            ) : (
              content.map((item) => {
                const mascot = getMascot(item.mascot);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all cursor-pointer group"
                    onClick={() => handleViewContent(item)}
                  >
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vloop-100 to-gold-100">
                          <Play size={32} className="text-vloop-600" />
                        </div>
                      )}
                      {item.duration_seconds && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono">
                          {Math.floor(item.duration_seconds / 60)}:{String(item.duration_seconds % 60).padStart(2, '0')}
                        </div>
                      )}
                      {item.sponsored && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-gold-500 text-vloop-950 text-xs font-bold">
                          Sponsored
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Play size={40} className="text-white opacity-0 group-hover:opacity-90 transition-opacity" fill="white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-vloop-50 text-vloop-700 capitalize">
                          {(item.content_type || '').replace('_', ' ')}
                        </span>
                        {item.mascot && (
                          <span className="text-xs text-gray-400">by {mascot.name}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye size={12} /> {item.view_count.toLocaleString('en-IN')} views
                        </div>
                        {item.episode_number && (
                          <span>Episode {item.episode_number}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Content Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in">
            <div className="relative aspect-video bg-gray-900">
              {selectedContent.video_url ? (
                <video
                  src={selectedContent.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : selectedContent.thumbnail_url ? (
                <img src={selectedContent.thumbnail_url} alt={selectedContent.title} className="w-full h-full object-cover" />
              ) : null}
              <button
                onClick={() => setSelectedContent(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-vloop-100 text-vloop-700 capitalize">
                  {(selectedContent.content_type || '').replace('_', ' ')}
                </span>
                {selectedContent.sponsored && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">Sponsored</span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedContent.title}</h2>
              {selectedContent.description && (
                <p className="text-sm text-gray-600 mb-4">{selectedContent.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Eye size={14} /> {selectedContent.view_count} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('whatsapp', selectedContent)}
                    className="p-2 rounded-lg bg-success-100 text-success-600 hover:bg-success-200 transition-colors"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleShare('facebook', selectedContent)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
