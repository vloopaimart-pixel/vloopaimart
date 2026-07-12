import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { CartProvider } from './lib/cart';
import { CommerceProvider } from './lib/commerceContext';
import AuthPage from './AuthPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import JourneyPage from './pages/JourneyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import BenefitsPage from './pages/BenefitsPage';
import BenefitClaimPage from './pages/BenefitClaimPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CommerceShopPage from './pages/CommerceShopPage';
import CommerceCartPage from './pages/CommerceCartPage';
import CommerceCheckoutPage from './pages/CommerceCheckoutPage';
import CommerceConfirmationPage from './pages/CommerceConfirmationPage';
import CommerceInvoicePage from './pages/CommerceInvoicePage';
import CommerceTrackPage from './pages/CommerceTrackPage';
import CommerceWishlistPage from './pages/CommerceWishlistPage';
import SellerStorePage from './pages/SellerStorePage';
import StorePartnerPage from './pages/StorePartnerPage';
import SmartCodePage from './pages/SmartCodePage';
import SmartCodeDashboardPage from './pages/SmartCodeDashboardPage';
import SmartCodeEnginePage from './pages/SmartCodeEnginePage';
import SmartCodeInfoPage from './pages/SmartCodeInfoPage';
import SmartCodeIntelligencePage from './pages/SmartCodeIntelligencePage';
import MySmartCodesPage from './pages/MySmartCodesPage';
import OfflineSmartCodePage from './pages/OfflineSmartCodePage';
import ChallengeCenterPage from './pages/ChallengeCenterPage';
import QuizPage from './pages/QuizPage';
import WalletPage from './pages/WalletPage';
import SmartWalletPage from './pages/SmartWalletPage';
import UniversalWalletPage from './pages/UniversalWalletPage';
import UniversalWalletEcosystemPage from './pages/UniversalWalletEcosystemPage';
import WalletSystemPage from './pages/WalletSystemPage';
import PaymentFinancePage from './pages/PaymentFinancePage';
import IdentityTrustPage from './pages/IdentityTrustPage';
import TrustScorePage from './pages/TrustScorePage';
import SecurityCenterPage from './pages/SecurityCenterPage';
import FOEPage from './pages/FOEPage';
import FOEWalletPage from './pages/FOEWalletPage';
import FOEProjectAdminCenter from './pages/FOEProjectAdminCenter';
import FuturePage from './pages/FuturePage';
import FutureOpportunitiesPage from './pages/FutureOpportunitiesPage';
import FutureProjectsPage from './pages/FutureProjectsPage';
import FutureProjectDetailsPage from './pages/FutureProjectDetailsPage';
import GlobalOpportunitiesPage from './pages/GlobalOpportunitiesPage';
import GlobalIdentityPage from './pages/GlobalIdentityPage';
import GlobalPartnerEcosystemPage from './pages/GlobalPartnerEcosystemPage';
import GlobalVCOSControlCenterPage from './pages/GlobalVCOSControlCenterPage';
import GlobalVCOSGlobalEcosystemPage from './pages/GlobalVCOSGlobalEcosystemPage';
import VCOSAISuperPlatformPage from './pages/VCOSAISuperPlatformPage';
import VCOSOperationsPage from './pages/VCOSOperationsPage';
import ControlMatrixPage from './pages/ControlMatrixPage';
import AIIntelligencePage from './pages/AIIntelligencePage';
import AwarenessCenterPage from './pages/AwarenessCenterPage';
import MerchantPortalPage from './pages/MerchantPortalPage';
import PartnerInfoPage from './pages/PartnerInfoPage';
import EnterpriseAdminPage from './pages/EnterpriseAdminPage';
import AdminPage from './pages/AdminPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminSmartCodeControlCenter from './pages/AdminSmartCodeControlCenter';
import AdminAIControlCenter from './pages/AdminAIControlCenter';
import InsurancePage from './pages/InsurancePage';
import CareClubPage from './pages/CareClubPage';
import CareOSPage from './pages/CareOSPage';
import EssentialServicesPage from './pages/EssentialServicesPage';
import LocalCommunityServicesPage from './pages/LocalCommunityServicesPage';
import AcademyHomePage from './pages/AcademyHomePage';
import AcademyCategoriesPage from './pages/AcademyCategoriesPage';
import AcademyCoursePage from './pages/AcademyCoursePage';
import AcademyLearnPage from './pages/AcademyLearnPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import { ShieldAlert } from 'lucide-react';

const PROTECTED_PAGES = new Set([
  'profile',
  'journey',
  'wallet',
  'smart-wallet',
  'universal-wallet',
  'wallet-system',
  'wallet-ecosystem',
  'dashboard',
  'foe-wallet',
  'payment-finance',
  'trust-score',
  'benefit-claim',
  'merchant-portal',
  'admin',
  'admin-products',
  'admin-smartcode',
  'admin-ai-control-center',
  'admin-control-center',
  'enterprise-admin',
  'control-matrix',
  'foe-project-admin',
  'global-vcos-control-center',
  'vcos-operations',
  'vcos-ai-super-platform',
  'smartcode',
  'smartcode-dashboard',
  'my-smartcodes',
  'offline-smartcode',
  'smartcode-engine',
  'smartcode-intelligence',
  'challenge-center',
  'quiz',
  'checkout',
  'commerce-checkout',
  'cart',
  'commerce-cart',
  'orders',
  'order-details',
]);

const ADMIN_PAGES = new Set([
  'admin',
  'admin-products',
  'admin-smartcode',
  'admin-ai-control-center',
  'admin-control-center',
  'enterprise-admin',
  'control-matrix',
  'foe-project-admin',
  'global-vcos-control-center',
  'vcos-operations',
]);

type NavParams = Record<string, string>;

function Shell() {
  const { session, profile, loading, isAdmin } = useAuth();
  const [page, setPage] = useState('home');
  const [params, setParams] = useState<NavParams>({});
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const authFlash = useRef(false);

  useEffect(() => {
    if (pendingRedirect && session && profile) {
      setPage(pendingRedirect);
      setPendingRedirect(null);
      authFlash.current = false;
    }
  }, [pendingRedirect, session, profile]);

  const nav = useCallback((p: string, navParams?: NavParams) => {
    if (navParams) setParams(navParams);
    else setParams({});
    setPage(p);
  }, []);

  const openAuth = useCallback((mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 animate-pulse" />
      </div>
    );
  }

  const isProtected = PROTECTED_PAGES.has(page);
  const needsAuth = isProtected && (!session || !profile);

  if (authFlash.current && session && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 animate-pulse" />
      </div>
    );
  }

  if (needsAuth) {
    const handleAuthed = (p?: string) => {
      authFlash.current = true;
      if (p) setPendingRedirect(p);
      else if (page !== 'auth') setPendingRedirect(page);
    };
    return (
      <AuthPage
        redirectTo={page}
        onAuthed={handleAuthed}
        onBack={() => { authFlash.current = false; setPendingRedirect(null); setPage('home'); }}
      />
    );
  }

  if (page === 'auth') {
    if (session && profile) {
      setPage('profile');
      return null;
    }
    return (
      <AuthPage
        onAuthed={(p) => { authFlash.current = true; if (p) setPendingRedirect(p); }}
        onBack={() => setPage('home')}
      />
    );
  }

  // Admin route guard: block non-admin users from admin pages
  if (ADMIN_PAGES.has(page) && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-error-50 flex items-center justify-center mb-4">
          <ShieldAlert size={40} className="text-error-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
        <p className="text-gray-500 text-sm mb-6">You don't have permission to access this page.</p>
        <button onClick={() => nav('home')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  const onViewDetails = (productId: string) => {
    setParams({ productId });
    setPage('product-details');
  };

  const onProductView = (productId: string) => {
    setParams({ productId });
    setPage('product-details');
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={nav} />;
      case 'profile':
        return <ProfilePage onNavigate={nav} />;
      case 'journey':
        return <JourneyPage onNavigate={nav} />;
      case 'about':
        return <AboutPage onNavigate={nav} />;
      case 'contact':
        return <ContactPage onNavigate={nav} />;
      case 'faq':
        return <FAQPage onNavigate={nav} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
      case 'refund':
        return <TermsPage />;
      case 'disclaimer':
        return <DisclaimerPage />;
      case 'benefits':
        return <BenefitsPage onNavigate={nav} />;
      case 'benefit-claim':
        return <BenefitClaimPage />;
      case 'dashboard':
        return <DashboardPage onNavigate={nav} />;
      case 'marketplace':
        return <MarketplacePage searchQuery={searchQuery} onViewDetails={onViewDetails} onNavigate={nav} />;
      case 'catalog':
        return <CatalogPage onNavigate={nav} onViewDetails={onViewDetails} />;
      case 'product-details':
        return <ProductDetailsPage productId={params.productId || ''} onNavigate={nav} onViewDetails={onViewDetails} />;
      case 'cart':
        return <CartPage onNavigate={nav} />;
      case 'commerce-shop':
        return <CommerceShopPage onNavigate={nav} />;
      case 'commerce-cart':
        return <CommerceCartPage onNavigate={nav} />;
      case 'commerce-checkout':
        return <CommerceCheckoutPage onNavigate={nav} />;
      case 'commerce-confirmation':
        return <CommerceConfirmationPage onNavigate={nav} />;
      case 'commerce-invoice':
        return <CommerceInvoicePage onNavigate={nav} />;
      case 'commerce-track':
        return <CommerceTrackPage onNavigate={nav} />;
      case 'commerce-wishlist':
        return <CommerceWishlistPage onNavigate={nav} />;
      case 'seller-store':
        return <SellerStorePage onNavigate={nav} onProductView={onProductView} />;
      case 'store-partner':
        return <StorePartnerPage />;
      case 'smartcode':
        return <SmartCodePage onNavigate={nav} />;
      case 'smartcode-dashboard':
        return <SmartCodeDashboardPage onNavigate={nav} />;
      case 'smartcode-engine':
        return <SmartCodeEnginePage onNavigate={nav} />;
      case 'smartcode-info':
        return <SmartCodeInfoPage onNavigate={nav} />;
      case 'smartcode-intelligence':
        return <SmartCodeIntelligencePage onNavigate={nav} />;
      case 'my-smartcodes':
        return <MySmartCodesPage onNavigate={nav} />;
      case 'offline-smartcode':
        return <OfflineSmartCodePage onNavigate={nav} />;
      case 'challenge-center':
        return <ChallengeCenterPage onNavigate={nav} />;
      case 'quiz':
        return <QuizPage onNavigate={nav} />;
      case 'wallet':
        return <WalletPage onNavigate={nav} />;
      case 'smart-wallet':
        return <SmartWalletPage onNavigate={nav} />;
      case 'universal-wallet':
        return <UniversalWalletPage onNavigate={nav} />;
      case 'wallet-ecosystem':
        return <UniversalWalletEcosystemPage onNavigate={nav} />;
      case 'wallet-system':
        return <WalletSystemPage onNavigate={nav} />;
      case 'payment-finance':
        return <PaymentFinancePage onNavigate={nav} />;
      case 'identity-trust':
        return <IdentityTrustPage onNavigate={nav} />;
      case 'trust-score':
        return <TrustScorePage onNavigate={nav} />;
      case 'security-center':
        return <SecurityCenterPage onNavigate={nav} />;
      case 'foe':
        return <FOEPage onNavigate={nav} />;
      case 'foe-wallet':
        return <FOEWalletPage onNavigate={nav} />;
      case 'foe-project-admin':
        return <FOEProjectAdminCenter onNavigate={nav} />;
      case 'future':
        return <FuturePage />;
      case 'future-opportunities':
        return <FutureOpportunitiesPage onNavigate={nav} />;
      case 'future-projects':
        return <FutureProjectsPage onNavigate={nav} />;
      case 'future-project-details':
        return <FutureProjectDetailsPage projectCode={params.projectCode || ''} onNavigate={nav} />;
      case 'global-opportunities':
        return <GlobalOpportunitiesPage onNavigate={nav} />;
      case 'global-identity':
        return <GlobalIdentityPage onNavigate={nav} />;
      case 'partner-ecosystem':
        return <GlobalPartnerEcosystemPage onNavigate={nav} />;
      case 'vcos-control-center':
        return <GlobalVCOSControlCenterPage onNavigate={nav} />;
      case 'global-ecosystem':
        return <GlobalVCOSGlobalEcosystemPage onNavigate={nav} />;
      case 'ai-super-platform':
        return <VCOSAISuperPlatformPage onNavigate={nav} />;
      case 'vcos-operations':
        return <VCOSOperationsPage onNavigate={nav} />;
      case 'control-matrix':
        return <ControlMatrixPage onNavigate={nav} />;
      case 'ai-intelligence':
        return <AIIntelligencePage onNavigate={nav} />;
      case 'awareness-center':
        return <AwarenessCenterPage onNavigate={nav} />;
      case 'merchant-portal':
        return <MerchantPortalPage onNavigate={nav} />;
      case 'partner-info':
        return <PartnerInfoPage onNavigate={nav} />;
      case 'enterprise-admin':
        return <EnterpriseAdminPage onNavigate={nav} />;
      case 'admin':
        return <AdminPage onNavigate={nav} />;
      case 'admin-products':
        return <AdminProductsPage />;
      case 'admin-smartcode':
        return <AdminSmartCodeControlCenter onNavigate={nav} />;
      case 'admin-ai-control-center':
      case 'admin-control-center':
        return <AdminAIControlCenter onNavigate={nav} />;
      case 'insurance':
        return <InsurancePage onNavigate={nav} />;
      case 'careclub':
        return <CareClubPage onNavigate={nav} />;
      case 'care-os':
        return <CareOSPage onNavigate={nav} />;
      case 'essential-services':
        return <EssentialServicesPage onNavigate={nav} />;
      case 'local-community':
        return <LocalCommunityServicesPage onNavigate={nav} />;
      case 'academy-home':
        return <AcademyHomePage onNavigate={nav} />;
      case 'academy-categories':
        return <AcademyCategoriesPage onNavigate={nav} />;
      case 'academy-course':
        return <AcademyCoursePage courseId={params.courseId || ''} onNavigate={nav} />;
      case 'academy-learn':
        return <AcademyLearnPage courseId={params.courseId || ''} onNavigate={nav} />;
      case 'orders':
        return <OrderHistoryPage onNavigate={nav} />;
      case 'order-details':
        return <OrderDetailsPage orderId={params.orderId || ''} onNavigate={nav} />;
      default:
        return <HomePage onNavigate={nav} />;
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <Header
        onNavigate={nav}
        currentPage={page}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={openAuth}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={nav} />
      <CartDrawer onNavigate={nav} />
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuth}
        mode={authMode}
        setMode={setAuthMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CommerceProvider>
          <Shell />
        </CommerceProvider>
      </CartProvider>
    </AuthProvider>
  );
}
