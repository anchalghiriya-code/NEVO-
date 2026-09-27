import React, { useState, useEffect } from "react";
import { 
  Mail, Key, ShieldCheck, CheckCircle2, AlertTriangle, 
  ExternalLink, X, RefreshCw, Send, Lock, Eye, EyeOff, Sparkles, HelpCircle 
} from "lucide-react";

interface SmtpConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (email: string) => void;
  initialEmail?: string;
}

export const SmtpConfigModal: React.FC<SmtpConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
  initialEmail = "anchal.ghiriya@gmail.com"
}) => {
  const [gmailUser, setGmailUser] = useState(initialEmail);
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string; tip?: string } | null>(null);
  const [showHelpGuide, setShowHelpGuide] = useState(true);
  const [currentConfig, setCurrentConfig] = useState<{ configured: boolean; email?: string | null; maskedUser?: string | null } | null>(null);

  // Fetch current server SMTP status when modal opens
  useEffect(() => {
    if (isOpen) {
      checkStatus();
      if (initialEmail && initialEmail.includes('@') && !gmailUser) {
        setGmailUser(initialEmail);
      }
    }
  }, [isOpen, initialEmail]);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/smtp/status");
      if (res.ok) {
        const data = await res.json();
        setCurrentConfig(data);
        if (data.email && !gmailUser) {
          setGmailUser(data.email);
        }
      }
    } catch {
      // Ignore background check errors
    }
  };

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const cleanUser = gmailUser.trim().toLowerCase();
    const cleanPass = gmailAppPassword.trim().replace(/\s+/g, '');

    if (!cleanUser || !cleanUser.includes('@')) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter a valid Gmail address (e.g. yourname@gmail.com).'
      });
      return;
    }

    if (!cleanPass) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter your 16-character Google App Password.'
      });
      return;
    }

    if (cleanPass.length < 12) {
      setStatusMsg({
        type: 'error',
        text: 'Google App Passwords are 16 characters long.',
        tip: 'Regular Gmail login passwords do not work. Generate an App Password at https://myaccount.google.com/apppasswords'
      });
      return;
    }

    setIsTesting(true);
    try {
      const res = await fetch("/api/smtp/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmailUser: cleanUser,
          gmailAppPassword: cleanPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect to Gmail SMTP.");
      }

      setStatusMsg({
        type: 'success',
        text: `Successfully connected to Gmail SMTP! Live OTP verification emails will now be delivered directly to external inboxes.`
      });
      setCurrentConfig({
        configured: true,
        email: cleanUser,
        maskedUser: cleanUser
      });
      onConfigSaved(cleanUser);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to authenticate with Gmail SMTP.',
        tip: 'Make sure 2-Step Verification is active on your Google Account, and use a dedicated 16-letter App Password (not your primary password).'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendTestEmail = async () => {
    const targetEmail = gmailUser.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter your recipient email address first.' });
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await fetch("/api/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: targetEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch test email.");
      }
      setStatusMsg({
        type: 'success',
        text: `✓ Test email successfully delivered to ${targetEmail}! Please check your Gmail inbox (and Spam folder).`
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to send test email.'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch("/api/smtp/disconnect", { method: "POST" });
      setCurrentConfig({ configured: false, email: null, maskedUser: null });
      setGmailAppPassword("");
      setStatusMsg({
        type: 'info',
        text: 'SMTP credentials cleared. The system has returned to sandbox mode.'
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                Live Gmail SMTP Activation
              </h3>
              <p className="text-xs text-stone-500">
                Receive authentic OTPs directly in your external Gmail inbox
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          
          {/* Active Status Banner */}
          {currentConfig?.configured ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Active Live Delivery connected via <strong>{currentConfig.email || currentConfig.maskedUser}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-[11px] text-stone-500 hover:text-rose-600 underline font-medium cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Currently running in Sandbox Mode</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Passcodes are displayed on-screen. To receive real emails in your personal inbox, connect your Gmail App Password below. No bash commands required!
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveAndTest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5 uppercase tracking-wider">
                Your Gmail Address (Sender / Relayer)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  placeholder="e.g. anchal.ghiriya@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 focus:bg-white border border-stone-300 focus:border-stone-900 rounded-xl text-sm font-medium text-stone-900 outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Google App Password (16 characters)
                </label>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Generate on Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full pl-9 pr-10 py-2.5 bg-stone-50 focus:bg-white border border-stone-300 focus:border-stone-900 rounded-xl text-sm font-mono text-stone-900 outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick 3-step guide */}
            <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50 text-xs text-stone-700 space-y-2">
              <button
                type="button"
                onClick={() => setShowHelpGuide(!showHelpGuide)}
                className="w-full flex items-center justify-between font-semibold text-stone-900 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>How to generate a Google App Password (30 seconds)</span>
                </span>
                <span className="text-[11px] text-stone-500 font-normal underline">
                  {showHelpGuide ? "Hide" : "Show"}
                </span>
              </button>

              {showHelpGuide && (
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-stone-600 pt-1 leading-relaxed">
                  <li>
                    Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline font-semibold">myaccount.google.com/apppasswords</a>.
                  </li>
                  <li>
                    Make sure <strong>2-Step Verification</strong> is enabled on your Google account.
                  </li>
                  <li>
                    Type <strong>Project Nevo</strong> as the app name and click <strong>Create</strong>.
                  </li>
                  <li>
                    Copy the 16-character passcode (e.g. <code>abcd efgh ijkl mnop</code>) and paste it above!
                  </li>
                </ol>
              )}
            </div>

            {/* Status alerts */}
            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs space-y-1 ${
                statusMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : statusMsg.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200'
                  : 'bg-stone-100 text-stone-800 border border-stone-200'
              }`}>
                <div className="flex items-start gap-2">
                  {statusMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  {statusMsg.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span className="font-medium">{statusMsg.text}</span>
                </div>
                {statusMsg.tip && (
                  <p className="text-[11px] opacity-90 pl-6 leading-relaxed">
                    💡 {statusMsg.tip}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                disabled={isTesting}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying with Google SMTP...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Connect & Activate Gmail</span>
                  </>
                )}
              </button>

              {currentConfig?.configured && (
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>Send Test Email</span>
                </button>
              )}
            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100/70 border-t border-stone-200 text-center text-[11px] text-stone-500">
          Credentials are kept secure on your private cloud instance and used solely for OTP delivery.
        </div>
      </div>
    </div>
  );
};
