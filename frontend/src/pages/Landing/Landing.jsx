import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, BookOpen, Utensils, TrendingUp, ChevronRight, Apple, Zap } from 'lucide-react';
import { SectionTitle, FloatingBadge } from '../../components/Landing/components';
import { shadows } from '../../styles/tokens';
import logo from '../../assets/icons/Nutrivision-logo.png';
import ScanFoodModal from '../../components/scan/ScanFoodModal';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

const navLinks = [
  { name: 'Technology', id: 'technology' },
  { name: 'How It Works', id: 'how-it-works' },
  { name: 'Get Started', id: 'get-started' },
];

const NAVBAR_HEIGHT = 80;

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    const top = section.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

export default function Landing() {
  const { isAuthenticated, logout } = useAuth();
  const { profile, profileImage } = useUser();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const displayName = profile?.fullName?.trim() || 'User';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const toggleUserDropdown = () => {
    setUserDropdownOpen((v) => !v);
    setScanModalOpen(false);
  };

  const openUploadModal = () => {
    setUserDropdownOpen(false);
    setScanModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC', scrollBehavior: 'smooth' }}>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b" style={{ borderColor: '#F1F5F9' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="NutriVision" className="w-9 h-9" />
              <span className="text-lg font-semibold" style={{ color: '#1E293B' }}>NutriVision</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium transition-colors hover:text-emerald-600"
                  style={{ color: '#64748B' }}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleUserDropdown}
                      className="text-sm font-medium hidden sm:block"
                      style={{ color: '#374151' }}
                    >
                      {displayName}
                    </button>
                    <button
                      onClick={toggleUserDropdown}
                      className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                      style={{ lineHeight: 0 }}
                    >
                      <img
                        src={profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </div>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                        border: '1px solid #F1F5F9',
                      }}
                    >
                      <button
                        onClick={() => { setUserDropdownOpen(false); navigate('/dashboard'); }}
                        className="w-full px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                        style={{ color: '#374151' }}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => { setUserDropdownOpen(false); navigate('/settings'); }}
                        className="w-full px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                        style={{ color: '#374151' }}
                      >
                        Settings
                      </button>
                      <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                        style={{ color: '#374151' }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center font-semibold text-white transition-all hover:opacity-90 text-sm"
                  style={{
                    height: '40px',
                    paddingLeft: '22px',
                    paddingRight: '22px',
                    borderRadius: '9999px',
                    backgroundColor: '#006D37',
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ScanFoodModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />

      <main>
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative z-10">
                <span
                  className="inline-flex px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase"
                  style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', marginBottom: '16px' }}
                >
                  AI-POWERED VITALITY
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: '#1E293B' }}>
                  See your food in{' '}
                  <span style={{ color: '#15803D' }}>high definition.</span>
                </h1>

                <p className="text-base md:text-lg mb-8 max-w-md" style={{ color: '#64748B', lineHeight: 1.7 }}>
                  Capture your meals and let AI break down every nutrient with precision. Smarter nutrition starts with one photo.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => { if (isAuthenticated) openUploadModal(); else navigate('/login'); }}
                    className="px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
                    style={{
                      background: 'linear-gradient(to right, #15803D, #10B981)',
                      boxShadow: shadows.glow,
                    }}
                  >
                    Upload Food
                  </button>
                </div>
              </div>

              <div className="relative" style={{ paddingTop: '20px', paddingLeft: '20px' }}>
                <div
                  className="absolute rounded-[40px]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    inset: '-18px',
                    transform: 'rotate(2deg)',
                    boxShadow: '0 24px 50px rgba(15, 23, 42, 0.08)',
                    zIndex: 1,
                  }}
                />

                <div className="relative rounded-[34px] overflow-hidden z-10" style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)', transform: 'rotate(2deg)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop"
                    alt="Healthy food"
                    className="w-full h-auto object-cover block"
                  />
                </div>

                <div
                  className="absolute z-20 hidden lg:block"
                  style={{
                    top: '0px',
                    left: '-25px',
                    marginTop: '-15px',
                  }}
                >
                  <div
                    className="rounded-3xl p-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                      minWidth: '165px',
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                        <Zap className="w-5 h-5" style={{ color: '#15803D' }} />
                      </div>
                      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                        Analysis
                      </span>
                    </div>
                    <div className="flex items-end gap-1.5 mb-2.5">
                      <span className="text-2xl font-bold" style={{ color: '#111827' }}>480</span>
                      <span className="text-xs font-medium pb-0.5" style={{ color: '#94A3B8' }}>kcal</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: '#15803D' }} />
                    </div>
                  </div>
                </div>

                <div
                  className="absolute z-20 hidden lg:block"
                  style={{
                    bottom: '25px',
                    right: '-25px',
                    marginBottom: '-20px',
                  }}
                >
                  <div
                    className="rounded-3xl p-4"
                    style={{
                      backgroundColor: '#D7AE00',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                      maxWidth: '185px',
                    }}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#78350F' }}>
                      AI Discovery
                    </p>
                    <p className="text-xs font-bold leading-tight" style={{ color: '#111827' }}>
                      High in Omega-3<br />and Heart-Healthy<br />Fats
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="technology" className="py-14 lg:py-24" style={{ backgroundColor: '#FAFAFA' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <SectionTitle
                badge="THE SCIENCE"
                title="The Science of Precision"
                subtitle="Our AI models are trained on millions of food images to deliver accurate nutritional analysis for every meal you log."
                badgeStyle={{
                  backgroundColor: '#EEF4FF',
                  color: '#3B82F6',
                  fontSize: '11px',
                  fontWeight: '500',
                }}
                titleStyle={{
                  color: '#111827',
                  fontSize: '48px',
                  lineHeight: 1.15,
                  fontWeight: '700',
                }}
                subtitleStyle={{
                  color: '#64748B',
                  fontSize: '15px',
                  maxWidth: '620px',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div
                className="lg:col-span-7 rounded-[32px] p-8 overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #F5F5F5' }}
              >
                <div className="mb-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #15803D' }}>
                    <Camera className="w-5 h-5" style={{ color: '#15803D' }} />
                  </div>
                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-semibold mb-4" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                    Popular
                  </span>
                  <p className="text-sm max-w-[280px]" style={{ color: '#9CA3AF', lineHeight: 1.65 }}>
                    Snap a photo and our AI identifies ingredients instantly
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop"
                    alt="Healthy food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>

              <div
                className="lg:col-span-5 rounded-[32px] p-8 flex flex-col justify-between"
                style={{ background: 'linear-gradient(160deg, #006D37 0%, #005C32 100%)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Nutrition Analysis</h3>
                  <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    Get detailed macronutrient breakdowns for every meal
                  </p>
                </div>
                <div>
                  <div className="w-full h-px mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Protein</p>
                      <p className="text-xl font-bold text-white">48g</p>
                    </div>
                    <div>
                      <p className="text-[11px] mb-1 text-right" style={{ color: 'rgba(255,255,255,0.45)' }}>Target</p>
                      <p className="text-xl font-bold text-white text-right">120g</p>
                    </div>
                    <div>
                      <p className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Calories</p>
                      <p className="text-xl font-bold text-white">1,840</p>
                    </div>
                    <div>
                      <p className="text-[11px] mb-1 text-right" style={{ color: 'rgba(255,255,255,0.45)' }}>Target</p>
                      <p className="text-xl font-bold text-white text-right">2,200</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="lg:col-span-4 rounded-[32px] p-8 flex flex-col"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #F5F5F5', minHeight: '280px' }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FEF9E7' }}>
                  <BookOpen className="w-5 h-5" style={{ color: '#B45309' }} />
                </div>
                <h3 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Healthy Recipes</h3>
                <p className="text-sm" style={{ color: '#9CA3AF', lineHeight: 1.7 }}>
                  Discover balanced meals tailored to your goals
                </p>
              </div>

              <div
                className="lg:col-span-8 rounded-[32px] p-8 flex items-center gap-8 overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #F5F5F5', minHeight: '280px' }}
              >
                <div className="flex-1 pt-2">
                  <h3 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Real-time Journaling</h3>
                  <p className="text-sm" style={{ color: '#9CA3AF', lineHeight: 1.7 }}>
                    Track your daily nutrition as you eat
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: '240px', height: '180px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=480&h=360&fit=crop"
                    alt="Food journal"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-10 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <SectionTitle
                badge="HOW IT WORKS"
                title="Three steps to smarter nutrition"
                subtitle="From scanning to insights, NutriVision covers your entire nutrition journey."
                align="center"
                badgeStyle={{
                  backgroundColor: '#EEF4FF',
                  color: '#3B82F6',
                  fontSize: '11px',
                  fontWeight: '500',
                }}
                titleStyle={{
                  color: '#111827',
                  fontSize: '36px',
                  lineHeight: 1.2,
                  fontWeight: '700',
                }}
                subtitleStyle={{
                  color: '#64748B',
                  fontSize: '14px',
                  maxWidth: '420px',
                  margin: '8px auto 0',
                }}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
              <div
                className="rounded-[28px] px-6 pt-6 pb-8"
                style={{
                  backgroundColor: '#F2F8F4',
                  border: '1px solid #DDEEE4',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4F4DD' }}>
                    <Camera className="w-4 h-4" style={{ color: '#15803D' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#15803D', opacity: 0.15 }}>
                    01
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>Snap a Photo</h4>
                <p className="text-xs" style={{ color: '#9CA3AF', lineHeight: 1.65, maxWidth: '200px' }}>
                  Take a picture of your meal using our app
                </p>
              </div>

              <div
                className="rounded-[28px] px-6 pt-6 pb-8"
                style={{
                  backgroundColor: '#F2F8F4',
                  border: '1px solid #DDEEE4',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4F4DD' }}>
                    <TrendingUp className="w-4 h-4" style={{ color: '#15803D' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#15803D', opacity: 0.15 }}>
                    02
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>AI Analyzes</h4>
                <p className="text-xs" style={{ color: '#9CA3AF', lineHeight: 1.65, maxWidth: '200px' }}>
                  Our AI identifies ingredients and calculates nutrition
                </p>
              </div>

              <div
                className="rounded-[28px] px-6 pt-6 pb-8"
                style={{
                  backgroundColor: '#F2F8F4',
                  border: '1px solid #DDEEE4',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4F4DD' }}>
                    <TrendingUp className="w-4 h-4" style={{ color: '#15803D' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#15803D', opacity: 0.15 }}>
                    03
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>AI Recommendations</h4>
                <p className="text-xs" style={{ color: '#9CA3AF', lineHeight: 1.65, maxWidth: '200px' }}>
                  Get personalized meal suggestions based on your nutrition needs and goals
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="get-started" className="py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div
              className="rounded-[40px] p-8 lg:p-14 text-center"
              style={{
                background: 'linear-gradient(135deg, #15803D 0%, #1E293B 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                Start Your Vision Today
              </h2>
              <p className="text-base mb-7 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Join thousands of users tracking their nutrition with AI-powered precision.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => { if (isAuthenticated) openUploadModal(); else navigate('/login'); }}
                  className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#15803D',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  Upload Your First Meal
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t" style={{ borderColor: '#F1F5F9', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <img src={logo} alt="NutriVision" className="w-7 h-7" />
              <span className="text-base font-bold" style={{ color: '#1E293B' }}>NutriVision</span>
            </div>

            {/* Center: Description */}
            <p
              className="text-xs text-center"
              style={{ color: '#94A3B8', lineHeight: 1.7, maxWidth: '400px' }}
            >
              Helping you build healthier eating habits through AI-powered nutrition analysis and personalized recommendations.
            </p>

            {/* Right: Copyright */}
            <p className="text-[11px] flex-shrink-0" style={{ color: '#CBD5E1' }}>
              © 2026 NutriVision Team. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}