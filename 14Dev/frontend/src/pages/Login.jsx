import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from "../authSlice";
import { useEffect, useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Sparkles, Zap } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const apiBase = axiosClient?.defaults?.baseURL || 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Container - Desktop Grid, Mobile Stack */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* LEFT HERO SECTION */}
        <div className="hidden lg:flex flex-col justify-center space-y-4">
          {/* Brand */}
          <NavLink to="/" className="inline-flex items-center gap-2 group w-fit">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 p-2 rounded-2xl shadow-2xl">
                <span className="text-xl font-black text-white">H₂C</span>
              </div>
            </div>
            <div className="text-xl font-bold text-white">Head-2-Code</div>
          </NavLink>

          {/* Hero Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white leading-tight">
              Welcome back to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Head-2-Code
              </span>
            </h1>
            <p className="text-base text-slate-400 font-medium">
              Continue your coding journey and master algorithms with our platform.
            </p>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:scale-105">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">Secure</div>
                <div className="text-[10px] text-slate-500">256-bit SSL</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-purple-500/50 transition-all hover:scale-105">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">Fast</div>
                <div className="text-[10px] text-slate-500">Instant Access</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-pink-500/50 transition-all hover:scale-105">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">Smart</div>
                <div className="text-[10px] text-slate-500">AI-Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
            <NavLink to="/" className="inline-flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 p-2 rounded-2xl shadow-2xl">
                  <span className="text-xl font-black text-white">H₂C</span>
                </div>
              </div>
              <div className="text-xl font-bold text-white">Head-2-Code</div>
            </NavLink>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            
            {/* Card */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-2xl">
              
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
                <p className="text-sm text-slate-400">Access your account</p>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => { window.location.href = `${apiBase}/oauth/google`; }}
                className="w-full bg-white hover:bg-slate-50 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 mb-4 shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-slate-900 text-slate-500 text-sm">or</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <p className="text-rose-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register('emailId')}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800/50 border ${
                        errors.emailId ? 'border-rose-500/50' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                  </div>
                  {errors.emailId && (
                    <p className="mt-1 text-rose-400 text-xs">{errors.emailId.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-800/50 border ${
                        errors.password ? 'border-rose-500/50' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-rose-400 text-xs">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group mt-2"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-70 group-hover:opacity-100 blur transition-all duration-300"></div>
                  <div className={`relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 text-sm">
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </div>
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="mt-3 text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <NavLink to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;