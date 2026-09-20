import React, { useState } from 'react';
import { authService, UserSession } from '../../services/authService';
import { Lock, ArrowLeft, KeyRound, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (session: UserSession) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [passkey, setPasskey] = useState('');
  const [email, setEmail] = useState('anubamam7@gmail.com');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authService.login(passkey, email);
      if (result.success && result.session) {
        onLoginSuccess(result.session);
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0a14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#24132b] via-[#100b17] to-[#07050a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Sakura glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Japanese character watermark */}
      <div className="absolute right-12 top-20 text-[10rem] font-serif font-black text-pink-500/[0.03] select-none pointer-events-none">
        桜
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm text-pink-300/80 hover:text-pink-200 mb-6 transition-colors px-3 py-1.5 rounded-lg bg-pink-950/30 border border-pink-500/20 hover:border-pink-500/40 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portfolio</span>
        </button>

        {/* Login Card */}
        <div className="bg-[#140e1f]/90 border border-pink-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-pink-950/40 relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300" />

          {/* Icon Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-lg shadow-pink-500/10 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-medium text-pink-300 mb-2">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Admin Authentication</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Admin Console</h1>
            <p className="text-sm text-slate-400 mt-1">
              Authorized access to manage projects, inquiries & comments
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-sm text-red-200 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-2">
                Admin Email / Account
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0d0a14] border border-pink-500/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                placeholder="anubamam7@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                  placeholder="Enter your admin password"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#0d0a14] border border-pink-500/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                />
                <KeyRound className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:via-rose-400 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-pink-500/10 text-center text-xs text-slate-400">
            Protected endpoint with secure token validation &amp; audit logging
          </div>
        </div>
      </div>
    </div>
  );
};
