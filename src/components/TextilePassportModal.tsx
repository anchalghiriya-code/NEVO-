import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Garment } from '../types';
import { 
  X, ShieldCheck, Tag, Sparkles, Award, Leaf, Settings, HelpCircle, 
  MapPin, RefreshCw, Layers, Compass, Heart, DollarSign, AlertCircle, HardHat,
  Trash2, ArrowRight
} from 'lucide-react';
import GarmentImagePreview from './GarmentImagePreview';

interface TextilePassportModalProps {
  garment: Garment | null;
  onClose: () => void;
  onMoveToPathway?: (step: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose', garmentId?: string) => void;
  onUpdatePathway?: (id: string, pathway: Garment['suggestedPathway']) => void;
}

export default function TextilePassportModal({ 
  garment, 
  onClose,
  onMoveToPathway,
  onUpdatePathway
}: TextilePassportModalProps) {
  if (!garment) return null;

  // Map pathways to badges
  const getPathwayBadge = (pathway: string) => {
    switch (pathway) {
      case 'Donate':
        return {
          label: 'Redistribute (Donate)',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          desc: 'Redirecting to verified Pune charity organizations.'
        };
      case 'Sell':
        return {
          label: 'Resale (Sell)',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          desc: 'Listing on secondhand circular market.'
        };
      case 'Upcycle':
        return {
          label: 'Remake (Upcycle)',
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          desc: 'Refashioning with creative DIY instructions.'
        };
      case 'Recycle':
        return {
          label: 'Fibre Reclamation (Recycle)',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          desc: 'Mechanical shredding and yarn spinning lines.'
        };
      case 'Dispose':
        return {
          label: 'Safe Downcycling (Dispose)',
          color: 'bg-stone-100 text-stone-800 border-stone-300',
          desc: '100% zero-landfill diversion. Hardware stripping, sanitization, and compression into industrial soundproofing & thermal panels.'
        };
      default:
        return {
          label: 'Alternative Route',
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          desc: 'Optimized routing for minimum landfill waste.'
        };
    }
  };

  const handleSelectPathway = (step: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose', pathway: Garment['suggestedPathway']) => {
    onUpdatePathway?.(garment.id, pathway);
    onClose();
    if (onMoveToPathway) {
      onMoveToPathway(step, garment.id);
    }
  };

  const pathwayInfo = getPathwayBadge(garment.suggestedPathway);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
          id="nevo-passport-modal"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Side: Garment Image & Eco metrics */}
          <div className="w-full md:w-1/3 bg-slate-900 text-white p-6 flex flex-col justify-between border-r border-slate-800 shrink-0">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs text-white shadow-md shadow-emerald-500/20">
                  🌱
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-[10px] tracking-widest text-[#AA3871] uppercase leading-none">NEVO VISION AI</h3>
                  <span className="text-[8px] font-mono font-bold text-slate-400">DIGITAL TEXTILE PASSPORT</span>
                </div>
              </div>

              {/* Garment Visual */}
              <div className="relative aspect-square w-full rounded-2xl bg-slate-800/80 border border-slate-700/50 overflow-hidden flex items-center justify-center shadow-inner group">
                <GarmentImagePreview garment={garment} imageUrl={garment.imageUrl} className="w-full h-full" large />
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-3 pt-8">
                  <span className="bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                    AI VERIFIED BLEND
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">GARMENT ASSIGNMENT</span>
                <h4 className="font-display font-bold text-sm text-white tracking-tight leading-snug">{garment.name}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">{garment.description}</p>
              </div>
            </div>

            {/* Eco badges */}
            <div className="pt-6 border-t border-slate-800 mt-6 space-y-2.5">
              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/30 p-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block leading-none uppercase">CARBON SAVINGS</span>
                  <span className="text-xs font-display font-black text-emerald-400">{garment.carbonSavings || 3.8} kg CO₂</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/30 p-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block leading-none uppercase">REWARD POINTS</span>
                  <span className="text-xs font-display font-black text-amber-400">+{garment.rewardPoints || 150} Nevo Points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Detailed analysis ledger & pathways specifications */}
          <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto text-left space-y-6">
            
            {/* Pathway decision block */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <h4 className="font-display font-extrabold text-xs uppercase tracking-tight text-slate-950">
                  NEVO DECISION ROUTING ENGINE
                </h4>
              </div>

              <div className={`p-4 border rounded-2xl ${pathwayInfo.color} flex items-start gap-3`}>
                <div className="w-8 h-8 rounded-full bg-white/80 border border-current/20 flex items-center justify-center text-sm shrink-0">
                  {garment.suggestedPathway === 'Donate' ? '❤️' :
                   garment.suggestedPathway === 'Sell' ? '🏷️' :
                   garment.suggestedPathway === 'Upcycle' ? '✨' : '♻️'}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold uppercase tracking-wide">{pathwayInfo.label}</span>
                    <span className="text-[9px] font-mono font-bold bg-white/70 px-2 py-0.5 rounded border border-current/15 uppercase">
                      Condition Match: {garment.condition}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium leading-normal opacity-90">{pathwayInfo.desc}</p>
                </div>
              </div>
            </div>

            {/* Vision AI Audit Spec list */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
                Nevo Vision AI Identified Characteristics
              </span>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Fabric Type</span>
                  <span className="text-xs font-bold text-slate-800">{garment.fabricType}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Blend Composition</span>
                  <span className="text-xs font-bold text-slate-800">{garment.blendPercentage}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Garment Category</span>
                  <span className="text-xs font-bold text-slate-800">{garment.garmentCategory}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Condition Level</span>
                  <span className="text-xs font-bold text-slate-800">{garment.condition}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl col-span-2">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Estimated Wear Level</span>
                  <span className="text-xs font-bold text-slate-800">{garment.wearLevel || 'Moderate'}</span>
                </div>
              </div>
            </div>

            {/* Recycling Process Description */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs">
              <div className="flex items-center gap-1.5 font-bold font-display uppercase tracking-wider text-slate-800 text-[10px]">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Industrial Circular Recycling Process
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">{garment.recyclingProcess}</p>
              
              <div className="pt-2">
                <span className="text-[8px] font-mono font-extrabold text-slate-400 block mb-1 uppercase tracking-wide">
                  Circular Line Machinery Used
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {garment.machinesUsed && garment.machinesUsed.map((machine, i) => (
                    <span key={i} className="bg-white border border-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded-lg font-mono font-bold">
                      ⚙️ {machine}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Matchups of NGOs / Recyclers / Second-hand buyers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DIY Ideas for upcycling */}
              {garment.diyIdeas && garment.diyIdeas.length > 0 && (
                <div className="p-4 border border-indigo-100 rounded-2xl bg-indigo-50/15 space-y-2">
                  <span className="text-[9px] font-mono font-extrabold text-indigo-700 uppercase tracking-widest block">
                    ✂️ Creative DIY Upcycle Ideas
                  </span>
                  <ul className="space-y-1.5">
                    {garment.diyIdeas.map((idea, i) => (
                      <li key={i} className="text-[10px] text-slate-600 font-medium leading-snug flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nearby Ecosystem Entities */}
              <div className="p-4 border border-slate-150 rounded-2xl space-y-3 bg-slate-50/40">
                <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
                  📍 Verified Pune Ecosystem Node Matchups
                </span>
                
                <div className="space-y-2 text-[10px]">
                  {garment.suggestedPathway === 'Donate' && garment.nearbyNgos && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 font-mono uppercase text-[8px]">Matched NGOs</span>
                      {garment.nearbyNgos.map((ngo, idx) => (
                        <div key={idx} className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          {ngo}
                        </div>
                      ))}
                    </div>
                  )}

                  {garment.suggestedPathway === 'Recycle' && garment.nearbyRecyclers && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 font-mono uppercase text-[8px]">Recycling Plants</span>
                      {garment.nearbyRecyclers.map((rec, idx) => (
                        <div key={idx} className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}

                  {garment.suggestedPathway === 'Sell' && garment.secondHandBuyers && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 font-mono uppercase text-[8px]">Second-hand Buyers</span>
                      {garment.secondHandBuyers.map((buyer, idx) => (
                        <div key={idx} className="font-bold text-slate-800 flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-amber-500 shrink-0" />
                          {buyer}
                        </div>
                      ))}
                    </div>
                  )}

                  {garment.suggestedPathway === 'Upcycle' && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 font-mono uppercase text-[8px]">Matchedup Craft Hubs</span>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                        Pune Crafts Guild, Wakad Center
                      </div>
                    </div>
                  )}

                  {garment.suggestedPathway === 'Dispose' && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 font-mono uppercase text-[8px]">Downcycling Facility</span>
                      <div className="font-bold text-stone-800 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-stone-600 shrink-0" />
                        Chakan Industrial Shredding Hub, Pune
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Suggested Circular Pathway Actions */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-wider">
                  Recommended Circular Actions for this Cloth
                </span>
                <span className="text-[10px] text-stone-400">Click any option to proceed directly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Option 1: Sell */}
                <button
                  type="button"
                  onClick={() => handleSelectPathway('sell', 'Sell')}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-left transition-colors cursor-pointer group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <span>🏷️</span> Resell Cloth
                    </span>
                    <ArrowRight className="w-3 h-3 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[10px] text-amber-800/80 leading-tight">
                    Secondhand circular marketplace for wearable pre-loved garments.
                  </span>
                </button>

                {/* Option 2: Recycle */}
                <button
                  type="button"
                  onClick={() => handleSelectPathway('recycle', 'Recycle')}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-colors cursor-pointer group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <span>♻️</span> Recycle Fiber
                    </span>
                    <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[10px] text-emerald-800/80 leading-tight">
                    Industrial carding & ring spinning into fresh recycled yarn spools.
                  </span>
                </button>

                {/* Option 3: Dispose (HIGHLIGHTED DIRECT ROUTING) */}
                <button
                  type="button"
                  onClick={() => handleSelectPathway('dispose', 'Dispose')}
                  className="p-2.5 rounded-xl border-2 border-stone-800 bg-stone-900 hover:bg-stone-800 text-left transition-all cursor-pointer group flex flex-col justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>🗑️</span> Choose Dispose
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[10px] text-stone-300 leading-tight">
                    Directly moves to Zero-Landfill Disposal Protocol for this garment.
                  </span>
                </button>
              </div>

              {/* Secondary Actions: Donate & Upcycle */}
              <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                <span className="text-[10px] text-stone-500">Other options:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPathway('donate', 'Donate')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    ❤️ Donate to Pune NGOs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPathway('upcycle', 'Upcycle')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    ✨ DIY Upcycle Guide
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
