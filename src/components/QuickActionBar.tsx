import { useState, useEffect } from 'react';
import {
  Search, Camera, Upload, Mic, AlertTriangle, Wallet, Bell,
  X, ChevronUp, QrCode, FileText, Sparkles, Bot
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import AIAssistant, { AIAssistantMini } from './AIAssistant';

interface QuickActionBarProps {
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
  onOpenSearch?: () => void;
}

export default function QuickActionBar({ onNavigate, onOpenSearch }: QuickActionBarProps) {
  const { profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [unreadNotifications] = useState(3);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.quick-action-bar') && !target.closest('.quick-action-modal') && !target.closest('.ai-assistant')) {
        setIsExpanded(false);
        setShowEmergency(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const quickActions = [
    { key: 'ai', icon: Bot, label: 'AI Assistant', color: 'bg-cyan-600', action: () => { setShowAI(true); setIsExpanded(false); } },
    { key: 'search', icon: Search, label: 'Search', color: 'bg-blue-600', action: () => onOpenSearch?.() || onNavigate('marketplace') },
    { key: 'scan', icon: Camera, label: 'Scan SmartCode', color: 'bg-emerald-600', action: () => onNavigate('smartcode') },
    { key: 'upload', icon: Upload, label: 'Upload Paper Code', color: 'bg-violet-600', action: () => onNavigate('smartcode') },
    { key: 'voice', icon: Mic, label: 'Voice Assistant', color: 'bg-indigo-600', action: () => setIsExpanded(false), future: true },
    { key: 'emergency', icon: AlertTriangle, label: 'Emergency', color: 'bg-red-600', action: () => setShowEmergency(true) },
    { key: 'wallet', icon: Wallet, label: 'Wallet', color: 'bg-amber-600', action: () => onNavigate('wallet') },
    { key: 'notifications', icon: Bell, label: 'Notifications', color: 'bg-slate-600', badge: unreadNotifications, action: () => onNavigate('dashboard') },
  ];

  return (
    <>
      <div className="quick-action-bar fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-2">
        {/* Expanded Actions */}
        {isExpanded && (
          <div className="flex flex-col gap-2 mb-2 animate-fade-in">
            {quickActions.map((action) => (
              <button
                key={action.key}
                onClick={action.action}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${action.color} text-white shadow-lg hover:scale-105 transition-all group`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{action.label}</span>
                {action.future && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Soon</span>
                )}
                {action.badge && action.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-xs font-bold flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full ${isExpanded ? 'bg-slate-800' : 'bg-gradient-to-br from-blue-600 to-indigo-600'} text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 ${isExpanded ? 'rotate-45' : ''}`}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Sparkles className="w-6 h-6" />
          )}
        </button>

        {/* Collapsed Quick Actions (Mobile) */}
        {!isExpanded && (
          <div className="flex gap-2 md:hidden">
            <button
              onClick={() => setShowAI(true)}
              className="w-12 h-12 rounded-full bg-cyan-600 text-white shadow-lg flex items-center justify-center"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('wallet')}
              className="w-12 h-12 rounded-full bg-amber-600 text-white shadow-lg flex items-center justify-center"
            >
              <Wallet className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant */}
      {showAI && (
        <div className="ai-assistant">
          <AIAssistant
            assistantType="universal"
            onClose={() => setShowAI(false)}
          />
        </div>
      )}

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="quick-action-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEmergency(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Emergency Care</h2>
                  <p className="text-red-200 text-sm">Select type of assistance needed</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {[
                { label: 'Food Support', icon: '🍽️', desc: 'Request food assistance' },
                { label: 'Medicine Support', icon: '💊', desc: 'Emergency medical help' },
                { label: 'Blood Request', icon: '🩸', desc: 'Request blood donors' },
                { label: 'Shelter Assistance', icon: '🏠', desc: 'Temporary shelter help' },
                { label: 'Mental Wellness', icon: '🧠', desc: 'Mental health support' },
                { label: 'Senior Support', icon: '👴', desc: 'Elder care assistance' },
                { label: 'Women Support', icon: '👩', desc: 'Women safety & support' },
                { label: 'Child Support', icon: '👶', desc: 'Child welfare assistance' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setShowEmergency(false);
                    onNavigate('careclub');
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-left transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="text-xs text-slate-500 text-center">
                All emergency requests are verified before assistance is provided.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
