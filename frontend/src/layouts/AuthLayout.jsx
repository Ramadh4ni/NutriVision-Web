import logo from '../assets/icons/Nutrivision-logo.png';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      <nav className="flex-shrink-0 bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src={logo} alt="NutriVision" className="w-9 h-9 md:w-11 md:h-11" />
            <span className="text-lg md:text-xl font-bold" style={{ color: '#1E293B', fontFamily: 'Manrope' }}>NutriVision</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-8 md:py-14">
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content', height: '32px', padding: '0 16px', borderRadius: '9999px', backgroundColor: '#DFF3E6', color: '#006D37', fontSize: '12px', fontWeight: 700, fontFamily: 'Inter', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Precision Nutrition
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight md:leading-none tracking-tight mb-4 md:mb-5" style={{ color: '#1E293B', fontFamily: 'Manrope' }}>
            Monitor Nutrition<br />
            <span style={{ color: '#006D37' }}>with Ease</span>
          </h1>
          <p className="text-sm md:text-base leading-relaxed mb-8 md:mb-10 max-w-md" style={{ color: '#64748B', fontFamily: 'Inter' }}>
            Analyze meals, track calories, and make smarter diet decisions with AI assistance.
          </p>
          <div className="relative w-full rounded-3xl md:rounded-[48px] overflow-hidden h-[220px] md:h-[320px]" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }}>
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop"
              alt="Healthy Food"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white rounded-xl md:rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                  <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#006D37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.07 2.121l-1.414 1.414a4 4 0 01-5.656-5.656l1.414-1.414zM12 18a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm md:text-base font-semibold" style={{ color: '#1E293B', fontFamily: 'Manrope' }}>AI Insight</div>
                  <div className="text-xs md:text-sm" style={{ color: '#64748B', fontFamily: 'Inter' }}>Struck by lightning? Eat fast!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:flex-[1] md:flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 md:py-12">
          <div className="w-full rounded-2xl md:rounded-3xl p-3 sm:p-4" style={{ backgroundColor: '#F3F4F5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div className="w-full bg-white rounded-xl md:rounded-2xl p-6 md:p-10">
              {children}
            </div>
          </div>
        </div>
      </div>

      <footer className="flex-shrink-0 py-4 text-center border-t" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm" style={{ color: '#64748B', fontFamily: 'Inter' }}>&copy; 2026 NutriVision. All rights reserved.</p>
      </footer>
    </div>
  );
}

import AppleIcon from '../assets/icons/apple-logo.png';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: '#1E293B', fontFamily: 'Manrope' }}>Welcome Back</h2>
      <p className="text-base mb-8" style={{ color: '#64748B', fontFamily: 'Inter' }}>Sign in to continue to your account</p>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2.5" style={{ color: '#64748B', fontFamily: 'Inter' }}>Email Address</label>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} size={20} />
            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-5 py-4 text-base rounded-full placeholder-slate-400 focus:outline-none transition-all"
              style={{ backgroundColor: '#F8FAFC', border: 'none', fontFamily: 'Inter' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2.5" style={{ color: '#64748B', fontFamily: 'Inter' }}>Password</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-14 py-4 text-base rounded-full placeholder-slate-400 focus:outline-none transition-all"
              style={{ backgroundColor: '#F8FAFC', border: 'none', fontFamily: 'Inter' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
              style={{ color: '#64748B' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-5 h-5 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-sm" style={{ color: '#64748B', fontFamily: 'Inter' }}>Remember me</span>
          </label>
          <a href="/forgot-password" className="text-sm font-medium" style={{ color: '#006D37', fontFamily: 'Inter' }}>Forgot password?</a>
        </div>

        <button
          type="submit"
          className="w-full py-4 text-base font-semibold rounded-full text-white transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(to right, #005A2C, #006D37)',
            boxShadow: '0 4px 14px rgba(0, 109, 55, 0.25)',
            fontFamily: 'Inter'
          }}
        >
          Sign In
        </button>

        <div className="relative py-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#E2E8F0' }} /></div>
          <div className="relative flex justify-center"><span className="px-5 bg-white text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B', fontFamily: 'Inter' }}>Or Login With</span></div>
        </div>

        <button
          type="button"
          className="w-full py-4 text-base font-medium rounded-full transition-colors flex items-center justify-center gap-3"
          style={{ backgroundColor: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Continue with Google
        </button>

        <button
          type="button"
          className="w-full py-4 text-base font-medium rounded-full transition-colors flex items-center justify-center gap-3"
          style={{ backgroundColor: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter' }}
        >
          <img src={AppleIcon} alt="Apple" className="w-5 h-5 object-contain" />
          Continue with Apple
        </button>
      </div>

      <p className="text-center text-sm mt-8" style={{ color: '#64748B', fontFamily: 'Inter' }}>
        Don't have an account? <Link to="/register" className="font-semibold" style={{ color: '#006D37' }}>Sign up now</Link>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: '#1E293B', fontFamily: 'Manrope' }}>Create Account</h2>
      <p className="text-base mb-8" style={{ color: '#64748B', fontFamily: 'Inter' }}>Join NutriVision today</p>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2.5" style={{ color: '#64748B', fontFamily: 'Inter' }}>Full Name</label>
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} size={20} />
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full pl-14 pr-5 py-4 text-base rounded-full placeholder-slate-400 focus:outline-none transition-all"
              style={{ backgroundColor: '#F8FAFC', border: 'none', fontFamily: 'Inter' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2.5" style={{ color: '#64748B', fontFamily: 'Inter' }}>Email Address</label>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} size={20} />
            <input type="email" placeholder="name@email.com" className="w-full pl-14 pr-5 py-4 text-base rounded-full placeholder-slate-400 focus:outline-none" style={{ backgroundColor: '#F8FAFC', border: 'none', fontFamily: 'Inter' }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2.5" style={{ color: '#64748B', fontFamily: 'Inter' }}>Password</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} size={20} />
            <input type="password" placeholder="At least 6 characters" className="w-full pl-14 pr-14 py-4 text-base rounded-full placeholder-slate-400 focus:outline-none" style={{ backgroundColor: '#F8FAFC', border: 'none', fontFamily: 'Inter' }} />
          </div>
        </div>

        <button className="w-full py-4 text-base font-semibold rounded-full text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #005A2C, #006D37)', boxShadow: '0 4px 14px rgba(0, 109, 55, 0.25)', fontFamily: 'Inter' }}>
          Sign Up
        </button>

        <div className="relative py-5">
          <div className="absolute inset-0 flex items-center"><div class="w-full border-t" style={{ borderColor: '#E2E8F0' }} /></div>
          <div className="relative flex justify-center"><span className="px-5 bg-white text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B', fontFamily: 'Inter' }}>Or Login With</span></div>
        </div>

        <button type="button" className="w-full py-4 text-base font-medium rounded-full transition-colors flex items-center justify-center gap-3"
          style={{ backgroundColor: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18C3.99 20.53 7.7 23 12 23z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Continue with Google
        </button>

        <button type="button" className="w-full py-4 text-base font-medium rounded-full transition-colors flex items-center justify-center gap-3"
          style={{ backgroundColor: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter' }}>
          <img src={AppleIcon} alt="Apple" className="w-5 h-5 object-contain" />
          Continue with Apple
        </button>

        <p className="text-center text-sm" style={{ color: '#64748B', fontFamily: 'Inter' }}>
          Already have an account? <Link to="/login" className="font-semibold" style={{ color: '#006D37' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}