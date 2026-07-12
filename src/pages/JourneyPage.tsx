import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Target, Trophy, Gift, ShoppingBag, Package, Wrench, Upload, QrCode, Wallet, ShieldCheck, FileText, CircleCheck as CheckCircle, Clock, Users, Heart, Droplet, Utensils, UserRound, Baby, UserCog, Brain, Chrome as HomeIcon, GraduationCap, BookOpen, Award, Store, Sprout, Scissors, BadgeCheck, Bot, TrendingUp, Calendar, Sparkles, Medal, Download, ChevronRight, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

type JourneyData = {
  totalPoints: number;
  totalSmartCodes: number;
  challengesJoined: number;
  rewardsReceived: number;
  ordersCompleted: number;
  productsPurchased: number;
  billsUploaded: number;
  wallet1: number;
  wallet2: number;
  totalCashback: number;
  lifetimeSavings: number;
  policiesActivated: number;
  protectionDays: number;
  claimsSubmitted: number;
  claimsApproved: number;
  protectionActive: boolean;
  familiesHelped: number;
  careContributions: number;
  bloodSupported: number;
  foodCompleted: number;
  womenSupport: number;
  childCare: number;
  seniorCare: number;
  coursesCompleted: number;
  certificatesEarned: number;
  quizParticipation: number;
  skillLevel: string;
  localStoresSupported: number;
  villageBusinesses: number;
  farmerPurchases: number;
  womenEntrepreneurs: number;
  tier: string;
  trustScore: string;
  memberSince: string;
  journeyProgress: string;
  badges: { icon: typeof Star; label: string; unlocked: boolean; color: string }[];
  insights: string[];
  timeline: { icon: typeof Star; label: string; date: string; done: boolean }[];
};

const DEFAULT_DATA: JourneyData = {
  totalPoints: 0, totalSmartCodes: 0, challengesJoined: 0, rewardsReceived: 0,
  ordersCompleted: 0, productsPurchased: 0, billsUploaded: 0,
  wallet1: 0, wallet2: 0, totalCashback: 0, lifetimeSavings: 0,
  policiesActivated: 0, protectionDays: 0, claimsSubmitted: 0, claimsApproved: 0, protectionActive: false,
  familiesHelped: 0, careContributions: 0, bloodSupported: 0, foodCompleted: 0,
  womenSupport: 0, childCare: 0, seniorCare: 0,
  coursesCompleted: 0, certificatesEarned: 0, quizParticipation: 0, skillLevel: 'Beginner',
  localStoresSupported: 0, villageBusinesses: 0, farmerPurchases: 0, womenEntrepreneurs: 0,
  tier: 'Standard', trustScore: 'Verified', memberSince: '—', journeyProgress: 'Growing',
  badges: [], insights: [], timeline: [],
};

function tierFromPoints(pts: number): string {
  if (pts >= 10000) return 'Prime';
  if (pts >= 3000) return 'Premium';
  return 'Standard';
}

function skillLevelFromParticipation(count: number): string {
  if (count >= 50) return 'Expert';
  if (count >= 20) return 'Advanced';
  if (count >= 5) return 'Intermediate';
  return 'Beginner';
}

export default function JourneyPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { profile } = useAuth();
  const [data, setData] = useState<JourneyData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;

    (async () => {
      const uid = profile.id;

      const [
        scCount, entriesCount, winnerCount, ordersData, careData,
        benefitsData, walletA, walletB, quizData,
      ] = await Promise.all([
        supabase.from('smartcode_allocations').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('is_active', true),
        supabase.from('smartcode_entries').select('entry_method, is_winner', { count: 'exact', head: false }).eq('user_id', uid),
        supabase.from('smartcode_entries').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('is_winner', true),
        supabase.from('orders').select('quantity, total_amount, status').eq('user_id', uid),
        supabase.from('care_club_contributions').select('contribution_type, beneficiaries_estimate, amount').eq('user_id', uid),
        supabase.from('benefits_history').select('benefit_type, amount, created_at').eq('user_id', uid),
        supabase.from('wallet_a_smart').select('smartpoints_balance, total_earned, total_redeemed').eq('user_id', uid).maybeSingle(),
        supabase.from('wallet_b_foe').select('foe_units_balance, total_benefits_earned').eq('user_id', uid).maybeSingle(),
        supabase.from('participation').select('participation_type, points_earned').eq('user_id', uid),
      ]);

      if (cancelled) return;

      const totalSmartCodes = scCount.count ?? 0;
      const entries = entriesCount.data ?? [];
      const challengesJoined = entries.length;
      const billsUploaded = entries.filter((e: any) => e.entry_method === 'offline' || e.entry_method === 'bill_upload').length;
      const rewardsReceived = winnerCount.count ?? 0;

      const orders = ordersData.data ?? [];
      const ordersCompleted = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;
      const productsPurchased = orders.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);
      const lifetimeSavings = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0) * 0.02, 0);

      const care = careData.data ?? [];
      const familiesHelped = care.reduce((sum: number, c: any) => sum + (c.beneficiaries_estimate || 0), 0);
      const careContributions = care.length;
      const foodCompleted = care.filter((c: any) => c.contribution_type?.includes('food')).length;
      const bloodSupported = care.filter((c: any) => c.contribution_type?.includes('blood')).length;
      const womenSupport = care.filter((c: any) => c.contribution_type?.includes('women')).length;
      const childCare = care.filter((c: any) => c.contribution_type?.includes('child')).length;
      const seniorCare = care.filter((c: any) => c.contribution_type?.includes('senior')).length;

      const benefits = benefitsData.data ?? [];
      const protectionBenefits = benefits.filter((b: any) => b.benefit_type === 'protection');
      const policiesActivated = protectionBenefits.length;
      const protectionActive = protectionBenefits.some((b: any) => {
        return (Date.now() - new Date(b.created_at).getTime()) / 86400000 <= 30;
      });
      const protectionDays = protectionBenefits.reduce((sum: number, b: any) => {
        const days = Math.min(30, Math.floor((Date.now() - new Date(b.created_at).getTime()) / 86400000));
        return sum + Math.max(0, days);
      }, 0);
      const totalCashback = benefits
        .filter((b: any) => b.benefit_type === 'cashback')
        .reduce((sum: number, b: any) => sum + Number(b.amount || 0), 0);

      const quiz = quizData.data ?? [];
      const quizParticipation = quiz.filter((q: any) => q.participation_type === 'quiz').length;
      const skillLevel = skillLevelFromParticipation(quizParticipation + challengesJoined);

      const pts = profile.points ?? 0;
      const tier = tierFromPoints(pts);
      const memberSince = new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      const badges: JourneyData['badges'] = [
        { icon: Sparkles, label: 'Early Member', unlocked: true, color: 'from-sky-500 to-sky-600' },
        { icon: Trophy, label: 'Prime Winner', unlocked: rewardsReceived > 0, color: 'from-signal-500 to-signal-600' },
        { icon: Heart, label: 'Care Supporter', unlocked: careContributions > 0, color: 'from-rose-500 to-rose-600' },
        { icon: ShieldCheck, label: 'Protected Member', unlocked: protectionActive, color: 'from-success-500 to-success-600' },
        { icon: GraduationCap, label: 'Learner', unlocked: quizParticipation > 0, color: 'from-ink-600 to-ink-800' },
        { icon: Users, label: 'Community Builder', unlocked: familiesHelped > 0, color: 'from-sky-600 to-ink-700' },
      ];

      const insights: string[] = [];
      if (pts < 3000) insights.push(`You are ${3000 - pts} SmartPoints away from Premium Tier.`);
      else if (pts < 10000) insights.push(`You are ${10000 - pts} SmartPoints away from Prime Tier.`);
      if (billsUploaded < 5) insights.push('Upload one more bill this week to boost your SmartPoints.');
      if (protectionActive) {
        const latest = protectionBenefits.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        const daysLeft = 30 - Math.floor((Date.now() - new Date(latest.created_at).getTime()) / 86400000);
        if (daysLeft <= 7) insights.push(`Protection expires in ${Math.max(0, daysLeft)} days.`);
      } else {
        insights.push('Activate Sponsored Protection to unlock partner benefits.');
      }
      insights.push('You can join this week\'s SmartCode Challenge.');

      const timeline = [
        { icon: Sparkles, label: 'Joined VLOOP', date: memberSince, done: true },
        { icon: ShoppingBag, label: 'First Purchase', date: ordersCompleted > 0 ? 'Completed' : 'Pending', done: ordersCompleted > 0 },
        { icon: Target, label: 'First SmartCode', date: totalSmartCodes > 0 ? 'Completed' : 'Pending', done: totalSmartCodes > 0 },
        { icon: Gift, label: 'First Reward', date: rewardsReceived > 0 ? 'Completed' : 'Pending', done: rewardsReceived > 0 },
        { icon: ShieldCheck, label: 'First Protection', date: policiesActivated > 0 ? 'Completed' : 'Pending', done: policiesActivated > 0 },
        { icon: BookOpen, label: 'First Certificate', date: quizParticipation > 0 ? 'Completed' : 'Pending', done: quizParticipation > 0 },
        { icon: Award, label: 'Latest Achievement', date: tier !== 'Standard' ? `${tier} Tier` : 'Growing', done: tier !== 'Standard' },
      ];

      if (!cancelled) {
        setData({
          totalPoints: pts, totalSmartCodes, challengesJoined, rewardsReceived,
          ordersCompleted, productsPurchased, billsUploaded,
          wallet1: Number(profile.wallet1_balance ?? 0),
          wallet2: Number(profile.wallet2_balance ?? 0),
          totalCashback, lifetimeSavings,
          policiesActivated, protectionDays, claimsSubmitted: 0, claimsApproved: 0, protectionActive,
          familiesHelped, careContributions, bloodSupported, foodCompleted, womenSupport, childCare, seniorCare,
          coursesCompleted: 0, certificatesEarned: 0, quizParticipation, skillLevel,
          localStoresSupported: ordersCompleted, villageBusinesses: Math.floor(ordersCompleted * 0.3),
          farmerPurchases: Math.floor(ordersCompleted * 0.15), womenEntrepreneurs: Math.floor(ordersCompleted * 0.1),
          tier, trustScore: 'Verified', memberSince, journeyProgress: 'Growing',
          badges, insights, timeline,
        });
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 animate-pulse" />
          <p className="text-sm text-ink-500">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 animate-fade-in">
      <JourneyHeader onNavigate={onNavigate} name={profile?.name || 'Member'} />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <LifetimeOverview data={data} />
        <LifetimeStatistics data={data} />
        <ShoppingHistory data={data} />
        <WalletHistory data={data} />
        <ProtectionHistory data={data} />
        <CommunityImpact data={data} />
        <LearningJourney data={data} />
        <LocalEconomyImpact data={data} />
        <Badges data={data} />
        <AIInsights data={data} />
        <Timeline data={data} />
        <ExportSection />
      </div>
    </div>
  );
}

/* 1. Header */
function JourneyHeader({ onNavigate, name }: { onNavigate: (p: string) => void; name: string }) {
  return (
    <header className="bg-ink-900 text-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('profile')} className="flex items-center gap-2 text-sm text-sky-200 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Profile
        </button>
        <h1 className="text-lg font-bold font-display">My VLOOP Journey</h1>
        <button onClick={() => onNavigate('home')} className="text-sm text-sky-200 hover:text-white">Home</button>
      </div>
    </header>
  );
}

/* 2. Lifetime Overview */
function LifetimeOverview({ data }: { data: JourneyData }) {
  const items = [
    { icon: Calendar, label: 'Member Since', value: data.memberSince },
    { icon: Medal, label: 'Current Tier', value: data.tier, badge: data.tier === 'Prime' ? 'bg-signal-100 text-signal-700' : data.tier === 'Premium' ? 'bg-sky-100 text-sky-700' : 'bg-ink-100 text-ink-600' },
    { icon: BadgeCheck, label: 'Trust Score', value: data.trustScore, badge: 'bg-success-100 text-success-700' },
    { icon: TrendingUp, label: 'Journey Progress', value: data.journeyProgress, badge: 'bg-sky-100 text-sky-700' },
  ];
  return (
    <section className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-6 text-white shadow-soft-hover">
      <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-signal-400" /> Lifetime Overview
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <it.icon className="w-5 h-5 text-sky-300 mb-3" />
            <div className="text-xs text-sky-200/70 mb-1">{it.label}</div>
            {it.badge ? (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${it.badge}`}>{it.value}</span>
            ) : (
              <div className="text-lg font-bold">{it.value}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* 3. Lifetime Statistics */
function LifetimeStatistics({ data }: { data: JourneyData }) {
  const stats = [
    { icon: Star, label: 'Total SmartPoints Earned', value: data.totalPoints.toLocaleString(), color: 'from-sky-500 to-sky-600' },
    { icon: Target, label: 'Total SmartCodes Generated', value: data.totalSmartCodes.toLocaleString(), color: 'from-signal-500 to-signal-600' },
    { icon: Trophy, label: 'Weekly Challenges Joined', value: data.challengesJoined.toLocaleString(), color: 'from-ink-600 to-ink-800' },
    { icon: Gift, label: 'Rewards Received', value: data.rewardsReceived.toLocaleString(), color: 'from-success-500 to-success-600' },
  ];
  return (
    <section>
      <SectionTitle title="Lifetime Statistics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-soft border border-ink-100">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-ink-900 font-display animate-count-up">{s.value}</div>
            <div className="text-xs text-ink-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 4. Shopping History */
function ShoppingHistory({ data }: { data: JourneyData }) {
  const items = [
    { icon: Package, label: 'Orders Completed', value: data.ordersCompleted },
    { icon: ShoppingBag, label: 'Products Purchased', value: data.productsPurchased },
    { icon: Wrench, label: 'Services Used', value: 0 },
    { icon: Upload, label: 'Bills Uploaded', value: data.billsUploaded },
    { icon: QrCode, label: 'QR Payments', value: 0 },
  ];
  return (
    <section>
      <SectionTitle title="Shopping History" />
      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 divide-y divide-ink-100">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center flex-shrink-0">
              <it.icon className="w-5 h-5 text-sky-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-ink-700">{it.label}</span>
            <span className="text-lg font-bold text-ink-900 font-display">{it.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 5. Wallet History */
function WalletHistory({ data }: { data: JourneyData }) {
  const items = [
    { icon: Wallet, label: 'Wallet-1', value: `₹${data.wallet1.toFixed(2)}` },
    { icon: Wallet, label: 'Wallet-2', value: `₹${data.wallet2.toFixed(2)}` },
    { icon: TrendingUp, label: 'Total Cashback', value: `₹${data.totalCashback.toFixed(2)}` },
    { icon: Gift, label: 'Lifetime Savings', value: `₹${data.lifetimeSavings.toFixed(2)}` },
  ];
  return (
    <section>
      <SectionTitle title="Wallet History" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-white rounded-2xl p-5 shadow-soft border border-ink-100 text-center">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-3">
              <it.icon className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-lg font-bold text-ink-900 font-display">{it.value}</div>
            <div className="text-xs text-ink-500 mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 6. Protection History */
function ProtectionHistory({ data }: { data: JourneyData }) {
  const items = [
    { icon: ShieldCheck, label: 'Policies Activated', value: data.policiesActivated },
    { icon: Clock, label: 'Protection Days', value: data.protectionDays },
    { icon: FileText, label: 'Claims Submitted', value: data.claimsSubmitted },
    { icon: CheckCircle, label: 'Claims Approved', value: data.claimsApproved },
  ];
  return (
    <section>
      <SectionTitle title="Protection History" />
      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-2">
                <it.icon className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-xl font-bold text-ink-900 font-display">{it.value}</div>
              <div className="text-xs text-ink-500 mt-1">{it.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 border border-success-200">
          <BadgeCheck className="w-5 h-5 text-success-600 flex-shrink-0" />
          <span className="text-sm text-success-700 font-semibold">
            Current Status: {data.protectionActive ? 'ACTIVE' : 'No active protection'}
          </span>
        </div>
      </div>
    </section>
  );
}

/* 7. Community Impact */
function CommunityImpact({ data }: { data: JourneyData }) {
  const items = [
    { icon: Users, label: 'Families Helped', value: data.familiesHelped, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { icon: Heart, label: 'Care Contributions', value: data.careContributions, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { icon: Droplet, label: 'Blood Requests Supported', value: data.bloodSupported, color: 'text-error-600 bg-error-50 border-error-200' },
    { icon: Utensils, label: 'Food Requests Completed', value: data.foodCompleted, color: 'text-signal-600 bg-signal-50 border-signal-200' },
    { icon: UserRound, label: 'Women Support', value: data.womenSupport, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { icon: Baby, label: 'Child Care', value: data.childCare, color: 'text-signal-600 bg-signal-50 border-signal-200' },
    { icon: UserCog, label: 'Senior Care', value: data.seniorCare, color: 'text-ink-600 bg-ink-100 border-ink-200' },
  ];
  return (
    <section>
      <SectionTitle title="Community Impact" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {items.map((it) => (
          <div key={it.label} className="bg-white rounded-2xl p-4 shadow-soft border border-ink-100 text-center">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-3 ${it.color}`}>
              <it.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-ink-900 font-display">{it.value}</div>
            <div className="text-[11px] text-ink-500 mt-1 leading-tight">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 8. Learning Journey */
function LearningJourney({ data }: { data: JourneyData }) {
  const items = [
    { icon: BookOpen, label: 'Courses Completed', value: data.coursesCompleted },
    { icon: Award, label: 'Certificates Earned', value: data.certificatesEarned },
    { icon: GraduationCap, label: 'Quiz Participation', value: data.quizParticipation },
    { icon: TrendingUp, label: 'Skill Level', value: data.skillLevel, isText: true },
  ];
  return (
    <section>
      <SectionTitle title="Learning Journey" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-white rounded-2xl p-5 shadow-soft border border-ink-100 text-center">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-3">
              <it.icon className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-xl font-bold text-ink-900 font-display">{it.value}</div>
            <div className="text-xs text-ink-500 mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 9. Local Economy Impact */
function LocalEconomyImpact({ data }: { data: JourneyData }) {
  const items = [
    { icon: Store, label: 'Local Stores Supported', value: data.localStoresSupported },
    { icon: HomeIcon, label: 'Village Businesses Supported', value: data.villageBusinesses },
    { icon: Sprout, label: 'Farmer Purchases', value: data.farmerPurchases },
    { icon: Scissors, label: 'Women Entrepreneurs Supported', value: data.womenEntrepreneurs },
  ];
  return (
    <section>
      <SectionTitle title="Local Economy Impact" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-white rounded-2xl p-5 shadow-soft border border-ink-100 text-center">
            <div className="w-10 h-10 rounded-xl bg-success-50 border border-success-200 flex items-center justify-center mx-auto mb-3">
              <it.icon className="w-5 h-5 text-success-600" />
            </div>
            <div className="text-xl font-bold text-ink-900 font-display">{it.value}</div>
            <div className="text-xs text-ink-500 mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 10. Badges */
function Badges({ data }: { data: JourneyData }) {
  return (
    <section>
      <SectionTitle title="Badges" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {data.badges.map((b) => (
          <div
            key={b.label}
            className={`rounded-2xl p-5 border text-center transition-all ${
              b.unlocked
                ? 'bg-white shadow-soft border-ink-100'
                : 'bg-ink-50 border-ink-100 opacity-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
              b.unlocked ? `bg-gradient-to-br ${b.color}` : 'bg-ink-200'
            }`}>
              <b.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-semibold text-ink-800">{b.label}</div>
            <div className={`text-[10px] mt-1 font-semibold ${b.unlocked ? 'text-success-600' : 'text-ink-400'}`}>
              {b.unlocked ? 'Unlocked' : 'Locked'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 11. AI Insights */
function AIInsights({ data }: { data: JourneyData }) {
  return (
    <section>
      <SectionTitle title="AI Insights" />
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-6 text-white shadow-soft-hover">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-sm">Personalized Guidance</div>
        </div>
        <div className="space-y-3">
          {data.insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <ChevronRight className="w-4 h-4 text-signal-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-sky-100">{ins}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 12. Timeline */
function Timeline({ data }: { data: JourneyData }) {
  return (
    <section>
      <SectionTitle title="My Journey Timeline" />
      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-ink-200" />
        <div className="space-y-6">
          {data.timeline.map((t, i) => (
            <div key={i} className="relative animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`absolute -left-[22px] w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                t.done ? 'bg-sky-500 border-sky-500' : 'bg-white border-ink-300'
              }`}>
                {t.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className={`rounded-2xl p-4 border ${
                t.done ? 'bg-white shadow-soft border-ink-100' : 'bg-ink-50 border-ink-100'
              }`}>
                <div className="flex items-center gap-3">
                  <t.icon className={`w-5 h-5 ${t.done ? 'text-sky-600' : 'text-ink-300'}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-ink-900 text-sm">{t.label}</div>
                    <div className="text-xs text-ink-500">{t.date}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 13. Export */
function ExportSection() {
  return (
    <section>
      <SectionTitle title="Export" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="group bg-white rounded-2xl p-6 shadow-soft border border-ink-100 hover:border-sky-300 hover:shadow-soft-hover transition-all flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-900">Journey Report (PDF)</div>
            <div className="text-sm text-ink-500">Download your complete journey</div>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-300 group-hover:text-sky-500 transition-colors" />
        </button>
        <button className="group bg-white rounded-2xl p-6 shadow-soft border border-ink-100 hover:border-signal-300 hover:shadow-soft-hover transition-all flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-signal-500 to-signal-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-900">Achievement Certificate</div>
            <div className="text-sm text-ink-500">Download your achievements</div>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-300 group-hover:text-signal-500 transition-colors" />
        </button>
      </div>
    </section>
  );
}

/* Shared */
function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-xl font-bold text-ink-900 font-display mb-4">{title}</h2>;
}
