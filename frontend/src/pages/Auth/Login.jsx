import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      // tokenResponse.access_token is an OAuth2 access token
      // We exchange it for user info then authenticate
      setIsLoading(true);
      setAuthError('');
      try {
        // Fetch user info from Google using access token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        // Send sub (google id), email and name to our backend
        const result = await loginWithGoogle({
          email: userInfo.email,
          fullName: userInfo.name,
          googleId: userInfo.sub,
        });

        if (!result.success) {
          setAuthError(result.error || 'Google login failed. Please try again.');
          return;
        }

        navigate(result.hasCompletedOnboarding ? '/dashboard' : '/onboarding', { replace: true });
      } catch (err) {
        setAuthError('Google login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setAuthError('Google sign-in was cancelled or failed. Please try again.');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await authLogin(email, password);
    setIsLoading(false);

    if (!result.success) {
      setAuthError(result.error);
      return;
    }

    navigate(result.hasCompletedOnboarding ? '/dashboard' : '/onboarding', { replace: true });
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1E293B', fontFamily: 'Manrope' }}>
          Welcome Back
        </h2>
        <p className="text-sm sm:text-base mb-8" style={{ color: '#64748B', fontFamily: 'Inter' }}>
          Sign in to continue to your account
        </p>

        {authError && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm"
            style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#64748B', fontFamily: 'Inter' }}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#64748B' }} />
              </div>
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                  if (authError) setAuthError('');
                }}
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4 text-sm sm:text-base rounded-full placeholder-slate-400 focus:outline-none transition-all"
                style={{ backgroundColor: '#F8FAFC', border: errors.email ? '2px solid #DC2626' : 'none', fontFamily: 'Inter' }}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 sm:mt-2 text-xs" style={{ color: '#DC2626', fontFamily: 'Inter' }}>{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#64748B', fontFamily: 'Inter' }}>
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#64748B' }} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                  if (authError) setAuthError('');
                }}
                className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3.5 sm:py-4 text-sm sm:text-base rounded-full placeholder-slate-400 focus:outline-none transition-all"
                style={{ backgroundColor: '#F8FAFC', border: errors.password ? '2px solid #DC2626' : 'none', fontFamily: 'Inter' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2"
                style={{ color: '#64748B' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 sm:mt-2 text-xs" style={{ color: '#DC2626', fontFamily: 'Inter' }}>{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs sm:text-sm" style={{ color: '#64748B', fontFamily: 'Inter' }}>Remember me</span>
            </label>
            <a href="/forgot-password" className="text-xs sm:text-sm font-medium" style={{ color: '#006D37', fontFamily: 'Inter' }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-semibold rounded-full text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'linear-gradient(to right, #005A2C, #006D37)',
              boxShadow: '0 4px 14px rgba(0, 109, 55, 0.25)',
              fontFamily: 'Inter'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative py-4 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#E2E8F0' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 sm:px-5 bg-white text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B', fontFamily: 'Inter' }}>Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-medium rounded-full transition-all flex items-center justify-center gap-2 sm:gap-3 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter', border: '1px solid #E2E8F0' }}
          >
            {isLoading ? (
              <span>Connecting to Google...</span>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm mt-6 sm:mt-8" style={{ color: '#64748B', fontFamily: 'Inter' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold" style={{ color: '#006D37' }}>
            Sign up now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}