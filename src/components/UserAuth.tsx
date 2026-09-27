import React, { useState, useEffect } from 'react';
import { User, LogIn, UserPlus, MapPin, Phone, Mail, CheckCircle, LogOut, ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import { UserSession } from '../types';

interface UserAuthProps {
  onSessionChange: (session: UserSession) => void;
  currentSession: UserSession;
}

export default function UserAuth({ onSessionChange, currentSession }: UserAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto load existing session if present
  useEffect(() => {
    const saved = localStorage.getItem('circular_fashion_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        onSessionChange({
          isAuthenticated: true,
          user: parsed
        });
      } catch (e) {
        // Clear corrupt state
        localStorage.removeItem('circular_fashion_user');
      }
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter your email and password to continue.');
      return;
    }

    if (!isLogin && (!name || !contact || !address)) {
      setError('Please complete all fields to establish your Nevo account.');
      return;
    }

    if (isLogin) {
      const stored = localStorage.getItem('circular_fashion_user');
      let userData = {
        name: "Anchal Ghiriya",
        email: email,
        contact: "+91 98765 43210",
        address: "Apartment 402, Kaspate Wasti, Wakad, Pune, 411057"
      };

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.email === email) {
            userData = parsed;
          }
        } catch (e) {}
      }

      localStorage.setItem('circular_fashion_user', JSON.stringify(userData));
      onSessionChange({
        isAuthenticated: true,
        user: userData
      });
      setSuccess('Access granted. Welcome back.');
    } else {
      const userData = { name, email, contact, address };
      localStorage.setItem('circular_fashion_user', JSON.stringify(userData));
      onSessionChange({
        isAuthenticated: true,
        user: userData
      });
      setSuccess('Account registered. Welcome to Nevo.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('circular_fashion_user');
    onSessionChange({
      isAuthenticated: false,
      user: null
    });
    setSuccess('');
    setError('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ECE5DE] shadow-xl shadow-stone-100/30 overflow-hidden text-stone-850 text-left transition-all duration-300" id="user-auth-card">
      {!currentSession.isAuthenticated ? (
        <div>
          {/* Top Tabs */}
          <div className="flex border-b border-[#ECE5DE] bg-stone-50/50">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-4.5 text-center font-display font-black uppercase text-[11px] tracking-[0.18em] transition-all relative ${
                isLogin 
                  ? 'text-[#AA3871]' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              id="btn-switch-login"
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </span>
              {isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#AA3871] rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-4.5 text-center font-display font-black uppercase text-[11px] tracking-[0.18em] transition-all relative ${
                !isLogin 
                  ? 'text-[#AA3871]' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              id="btn-switch-signup"
            >
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </span>
              {!isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#AA3871] rounded-t-full" />
              )}
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xl font-display font-black text-stone-900 tracking-tight leading-none uppercase">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 font-medium">
                {isLogin ? 'Access your sustainable apparel profile & rewards' : 'Join our circular slow fashion ecosystem'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50/60 text-rose-800 text-xs rounded-2xl border border-rose-100 font-medium flex items-start gap-2.5">
                <span className="shrink-0 text-rose-500 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Anchal Ghiriya"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/85 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#AA3871]/10 focus:border-[#AA3871] focus:bg-white focus:outline-none transition-all duration-200"
                      id="signup-name-input"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="e.g. anchal.ghiriya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/85 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#AA3871]/10 focus:border-[#AA3871] focus:bg-white focus:outline-none transition-all duration-200"
                    id="auth-email-input"
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Contact Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. +91 98765 43210"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/85 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#AA3871]/10 focus:border-[#AA3871] focus:bg-white focus:outline-none transition-all duration-200"
                        id="signup-contact-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Default Collection Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <textarea
                        placeholder="Enter your street, flat number & colony in Wakad, Pune"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/85 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#AA3871]/10 focus:border-[#AA3871] focus:bg-white focus:outline-none transition-all duration-200 resize-none"
                        id="signup-address-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Secure Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200/85 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#AA3871]/10 focus:border-[#AA3871] focus:bg-white focus:outline-none transition-all duration-200"
                  id="auth-password-input"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-850 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                id="submit-auth-btn"
              >
                <span>{isLogin ? 'Access Member Portal' : 'Establish Membership'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 border-t border-[#ECE5DE] text-center">
              <p className="text-[11px] text-stone-400 font-medium">
                {isLogin ? (
                  <>
                    First time utilizing Nevo?{' '}
                    <button 
                      onClick={() => setIsLogin(false)} 
                      className="text-[#AA3871] hover:text-[#80254F] font-bold underline decoration-dotted transition cursor-pointer"
                    >
                      Establish Membership
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsLogin(true)} 
                      className="text-[#AA3871] hover:text-[#80254F] font-bold underline decoration-dotted transition cursor-pointer"
                    >
                      Access Member Portal
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-[#ECE5DE]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-[#FCECF0] rounded-2xl flex items-center justify-center font-bold border border-[#FAD0DC]">
                <User className="w-5.5 h-5.5 text-[#AA3871]" />
              </div>
              <div>
                <span className="text-[8px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Active Member
                </span>
                <h4 className="font-display font-black text-base text-stone-900 mt-1 leading-none">
                  {currentSession.user?.name}
                </h4>
                <p className="text-[10px] font-mono font-bold text-stone-400 mt-1">{currentSession.user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="border border-[#ECE5DE] hover:bg-stone-50 p-2.5 rounded-xl text-stone-400 hover:text-stone-900 transition-all cursor-pointer"
              title="Logout session"
              id="btn-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs font-semibold text-stone-600">
            <div className="flex gap-3">
              <Phone className="w-4.5 h-4.5 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black block text-[8px] text-stone-400 uppercase tracking-widest mb-0.5">Contact Number</span>
                <span className="font-mono text-stone-800 text-[13px]">{currentSession.user?.contact || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-4.5 h-4.5 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black block text-[8px] text-stone-400 uppercase tracking-widest mb-0.5">Pickup Address</span>
                <span className="leading-relaxed text-stone-800 text-[12px]">{currentSession.user?.address || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs text-emerald-800 font-semibold leading-relaxed">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>Profile and address saved for multi-fabric collections & logistics schedules.</span>
          </div>
        </div>
      )}
    </div>
  );
}
