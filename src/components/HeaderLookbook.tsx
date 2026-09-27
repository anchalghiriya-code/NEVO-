import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Scissors, Sparkles, RefreshCw, Layers, ArrowRight } from 'lucide-react';

export const HeaderLookbook: React.FC = () => {
  return (
    <div 
      className="hidden lg:flex items-center justify-between gap-4 px-6 py-2 bg-gradient-to-r from-[#FAF6F0] via-[#FDFBF7] to-[#FAF6F0] border border-[#EAE5DF] rounded-2xl h-20 flex-1 mx-8 relative overflow-hidden shadow-xs"
      id="nevo-header-recycling-loop"
    >
      {/* Background organic design elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#aa3871_1px,transparent_1px)] [background-size:14px_14px]" />
      
      {/* Subtle organic light flare */}
      <div className="absolute -left-10 -top-10 w-24 h-24 bg-[#AA3871]/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-emerald-600/5 rounded-full blur-xl pointer-events-none" />

      {/* 1. SOURCE: Old Garment Section */}
      <div className="flex items-center gap-3 relative z-10" id="recycling-step-1">
        <div className="relative">
          {/* Pulsing outer boundary */}
          <motion.div 
            animate={{ scale: [0.95, 1.1, 0.95] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -inset-1.5 bg-rose-100/60 rounded-xl blur-xs"
          />
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="relative w-12 h-12 bg-white border border-rose-200 rounded-xl flex items-center justify-center shadow-xs cursor-pointer"
            id="source-clothing-icon"
          >
            <Shirt className="w-6 h-6 text-rose-500" />
            
            {/* Thread loop coming out of clothing */}
            <span className="absolute -top-1 -right-1 bg-rose-500 text-[7px] text-white font-mono px-1 rounded font-bold uppercase leading-none">
              OLD
            </span>
          </motion.div>
        </div>

        <div className="text-left">
          <h5 className="text-[10px] font-mono font-black text-rose-700 tracking-wider uppercase leading-none">
            01 / POST-CONSUMER
          </h5>
          <h4 className="text-xs font-display font-black text-stone-900 uppercase tracking-tight mt-1">
            Discarded Wardrobe
          </h4>
          <span className="text-[9px] font-sans font-semibold text-stone-400 block mt-0.5">
            Pre-sorted Wakad Haul
          </span>
        </div>
      </div>

      {/* Connecting Flow Arrow 1 */}
      <div className="flex items-center relative z-10" id="connecting-flow-1">
        <svg className="w-16 h-8" viewBox="0 0 80 40" fill="none">
          {/* Animated Thread line */}
          <motion.path 
            d="M 5,20 C 25,5 55,35 75,20" 
            stroke="#AA3871" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeDasharray="6,4"
            animate={{ strokeDashoffset: [-20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          {/* Flow Arrowhead */}
          <path d="M 72,16 L 77,20 L 72,24" stroke="#AA3871" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 2. THE RECYCLING ENGINE: Spinning Circular Loop */}
      <div className="flex items-center gap-3 relative z-10" id="recycling-step-2">
        <div className="relative">
          {/* Spinning recycle arrows background */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute -inset-2.5 flex items-center justify-center opacity-30"
          >
            <RefreshCw className="w-16 h-16 text-[#AA3871]" />
          </motion.div>

          {/* Central action icon */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }}
            className="relative w-12 h-12 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10"
            id="engine-action-icon"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Scissors className="w-5 h-5 text-[#AA3871]" />
            </motion.div>
          </motion.div>

          {/* Small particles orbiting */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 0.8, 1]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"
          />
        </div>

        <div className="text-left">
          <h5 className="text-[10px] font-mono font-black text-[#AA3871] tracking-wider uppercase leading-none">
            02 / SEGREGATION
          </h5>
          <h4 className="text-xs font-display font-black text-stone-900 uppercase tracking-tight mt-1 flex items-center gap-1">
            Fiber Decoded Loop
          </h4>
          <span className="text-[9px] font-sans font-semibold text-emerald-700 block mt-0.5 font-mono">
            ● 98% Circularity Target
          </span>
        </div>
      </div>

      {/* Connecting Flow Arrow 2 */}
      <div className="flex items-center relative z-10" id="connecting-flow-2">
        <svg className="w-16 h-8" viewBox="0 0 80 40" fill="none">
          {/* Animated Thread line */}
          <motion.path 
            d="M 5,20 C 25,35 55,5 75,20" 
            stroke="#10B981" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeDasharray="6,4"
            animate={{ strokeDashoffset: [-20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          {/* Flow Arrowhead */}
          <path d="M 72,16 L 77,20 L 72,24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 3. OUTCOME: New Upcycled Garment */}
      <div className="flex items-center gap-3 relative z-10" id="recycling-step-3">
        <div className="relative">
          {/* Golden glow emitter */}
          <motion.div 
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -inset-1.5 bg-emerald-100 rounded-xl blur-xs"
          />
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-12 h-12 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-xs cursor-pointer"
            id="outcome-clothing-icon"
          >
            <Layers className="w-5 h-5 text-emerald-600" />
            
            {/* Sparkle sticker */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 90, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-1.5 -right-1.5 text-amber-500"
            >
              <Sparkles className="w-4.5 h-4.5 fill-amber-400 text-amber-500" />
            </motion.div>
          </motion.div>
        </div>

        <div className="text-left">
          <h5 className="text-[10px] font-mono font-black text-emerald-700 tracking-wider uppercase leading-none">
            03 / RE-DESIGN
          </h5>
          <h4 className="text-xs font-display font-black text-stone-900 uppercase tracking-tight mt-1">
            New Chapter Thread
          </h4>
          <span className="text-[9px] font-sans font-semibold text-stone-400 block mt-0.5">
            Aesthetic Upcycled Art
          </span>
        </div>
      </div>
    </div>
  );
};
