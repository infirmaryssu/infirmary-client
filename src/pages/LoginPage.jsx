import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addSystemLog } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await authService.login({ email, password });

      if (result?.token) {
        localStorage.setItem('authToken', result.token);
      }
      if (result?.user) {
        localStorage.setItem('authUser', JSON.stringify(result.user));
      }

      const userType = result?.user?.userType;
      const isAdmin = userType === 'admin' || userType === 'super_admin';

      addSystemLog({
        type: isAdmin ? 'admin_login' : 'client_login',
        message: isAdmin ? 'Admin signed in to admin portal' : 'User signed in to client portal',
        metadata: { email: email || '(not provided)', userType: userType || 'unknown' },
      });

      toast.success('Welcome back! You have signed in successfully.');
      navigate(isAdmin ? '/admin' : '/app');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err);
      const message = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12 min-h-0 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-slate-50 to-primary/10 -z-10" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 hidden sm:block" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 hidden sm:block" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 sm:bg-white/80 backdrop-blur-2xl p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white w-full max-w-md space-y-6 sm:space-y-8 relative my-auto"
      >
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="bg-gradient-to-br from-primary to-primary-hover w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white mx-auto mb-4 sm:mb-6 shadow-xl shadow-primary/30 transform -rotate-6">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Welcome Back</h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Sign in to your health portal</p>
        </div>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.1em] ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium min-h-[48px]"
                placeholder="name@school.edu"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.1em] ml-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium min-h-[48px]"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-xs font-black text-primary hover:underline py-2">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 sm:py-4 bg-primary text-white font-black rounded-xl sm:rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 text-base sm:text-lg mt-1 disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 sm:pt-4">
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            New to Infirmary Connect?{" "}
            <Link to="/signup" className="text-primary font-black hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
