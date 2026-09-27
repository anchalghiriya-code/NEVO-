import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ShieldCheck, Volume2, AlertCircle } from 'lucide-react';

interface SecurityCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export default function SecurityCaptcha({ onVerify, className = '' }: SecurityCaptchaProps) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random 5-character alphanumeric string (excluding ambiguous characters like 0, O, I, 1)
  const generateCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise lines to prevent OCR bot scraping
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.25)`;
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width, Math.random() * canvas.height,
        Math.random() * canvas.width, Math.random() * canvas.height,
        Math.random() * canvas.width, Math.random() * canvas.height
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, 0.3)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render distorted characters
    const charSpacing = canvas.width / (code.length + 1);
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      ctx.save();
      const x = charSpacing * (i + 1);
      const y = canvas.height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `bold ${Math.floor(20 + Math.random() * 4)}px monospace`;
      
      const colors = ['#1e293b', '#0f172a', '#334155', '#475569', '#881337', '#065f46'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateCode();
    setCaptchaCode(newCode);
    setUserInput('');
    setIsVerified(false);
    setHasError(false);
    onVerify(false);
    setTimeout(() => drawCaptcha(newCode), 50);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);
    setHasError(false);

    // Check match (case-insensitive for smooth user experience, or strict)
    if (val.trim().toLowerCase() === captchaCode.toLowerCase()) {
      setIsVerified(true);
      setHasError(false);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
      if (val.length >= captchaCode.length) {
        setHasError(true);
      }
    }
  };

  const speakCaptcha = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(captchaCode.split('').join(' '));
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`space-y-2 p-3 bg-stone-50 border border-stone-200 rounded-2xl ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-stone-700 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
          <span>Anti-Bot Verification Challenge</span>
        </label>
        <span className="text-[10px] text-stone-400 font-mono">Prevents automated spam</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Canvas Display */}
        <div className="relative border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs shrink-0">
          <canvas
            ref={canvasRef}
            width={130}
            height={42}
            className="block select-none"
            title="Security Captcha Visual Challenge"
          />
        </div>

        {/* Refresh & Speak Controls */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={refreshCaptcha}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            title="Generate new Captcha"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={speakCaptcha}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            title="Read Captcha code aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type code"
            maxLength={6}
            disabled={isVerified}
            className={`w-full px-3 py-2 text-xs font-mono font-bold tracking-wider rounded-xl border transition-all ${
              isVerified
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-not-allowed'
                : hasError
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900'
            }`}
          />
        </div>
      </div>

      {/* Verification status feedback */}
      <div className="flex items-center justify-between text-[10px]">
        {isVerified ? (
          <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
            ✓ Human Contributor Confirmed
          </span>
        ) : hasError ? (
          <span className="text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Code does not match. Try again or refresh.
          </span>
        ) : (
          <span className="text-stone-400">
            Case-insensitive code verification
          </span>
        )}
      </div>
    </div>
  );
}
