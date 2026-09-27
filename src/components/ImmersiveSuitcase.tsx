import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Gift, Package, Recycle, Scissors, HelpingHand, FileText } from 'lucide-react';

export const ImmersiveSuitcase: React.FC = () => {
  // Define items obtained after recycling of clothes & community donations
  const recyclingItems = [
    {
      id: 'yarn-spools',
      name: 'Spun Recycled Yarn',
      // High-quality spun thread spools from processed denim/cotton fibers
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80',
      style: { top: '6%', left: '10%', width: '33%', transform: 'rotate(-4deg)' },
      caption: 'SPUN YARN',
      tag: '100% Cotton Spool',
      delay: 0.1,
    },
    {
      id: 'patchwork-bag',
      name: 'Upcycled Utility Tote',
      // Hand-made tote bag crafted entirely from recycled scrap corduroy & canvas
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
      style: { top: '5%', right: '10%', width: '32%', transform: 'rotate(6deg)' },
      caption: 'UPCYCLED CRAFT',
      tag: 'Scrap Fabric Tote',
      delay: 0.2,
    },
    {
      id: 'donation-bale',
      name: 'Community Donation Pack',
      // Stack of freshly sanitized clothes ready for distribution in Pune
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80',
      style: { bottom: '8%', left: '12%', width: '34%', transform: 'rotate(4deg)' },
      caption: 'LOCAL AID BUNDLE',
      tag: 'Pune Community Distribution',
      delay: 0.3,
    },
    {
      id: 'fiber-felt',
      name: 'Recovered Fiber Felt',
      // Multi-layered shredded felt fabric ready to be made into insulation/mats
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=300&q=80',
      style: { bottom: '6%', right: '12%', width: '32%', transform: 'rotate(-6deg)' },
      caption: 'FIBER SWATCH',
      tag: 'Shredded Felt Pad',
      delay: 0.4,
    },
  ];

  const polaroids = [
    {
      id: 'p-donations',
      // Image depicting volunteer distribution or donation sorting
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=300&q=80',
      caption: 'WAKAD HANDOVER',
      tag: 'Pune Aid Active',
      style: { top: '38%', right: '-6%', width: '32%', transform: 'rotate(11deg)' },
      delay: 0.5,
    },
    {
      id: 'p-handloom',
      // Tailoring / weaving atelier
      image: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=300&q=80',
      caption: 'LOOM ARTISAN',
      tag: 'Upcycle Workshop',
      style: { bottom: '15%', left: '-8%', width: '32%', transform: 'rotate(-11deg)' },
      delay: 0.65,
    },
  ];

  return (
    <div 
      className="relative w-full max-w-md aspect-[4/5] mx-auto bg-stone-950 rounded-3xl p-4 md:p-6 flex items-center justify-center select-none"
      id="nevo-suitcase-showcase-container"
    >
      {/* Container soft glow */}
      <div className="absolute inset-2 bg-emerald-950/20 rounded-2xl blur-xl transform translate-y-3 pointer-events-none" />

      {/* Main Sorting Chest Frame */}
      <div 
        className="w-full h-full border-8 border-amber-900/90 bg-[#FAF4EB] rounded-2xl relative overflow-hidden flex flex-col p-4 shadow-2xl"
        id="retro-suitcase-shell"
      >
        {/* Fine background fabric structure lining */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#aa3871_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Metal hinges and leather straps representing recycling collection chest */}
        <div className="absolute top-0 left-5 w-5 h-3.5 bg-amber-700 rounded-b border-b border-amber-800" />
        <div className="absolute top-0 right-5 w-5 h-3.5 bg-amber-700 rounded-b border-b border-amber-800" />
        <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-yellow-600 rounded-full border border-yellow-700/30" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-yellow-600 rounded-full border border-yellow-700/30" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-yellow-600 rounded-full border border-yellow-700/30" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-yellow-600 rounded-full border border-yellow-700/30" />

        {/* Recycled Tag Hanging from the Top */}
        <motion.div 
          initial={{ y: -60, rotate: 12 }}
          animate={{ y: -10, rotate: 6 }}
          whileHover={{ rotate: 12, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 80, damping: 10, delay: 0.4 }}
          className="absolute top-0 left-12 z-30 bg-emerald-700 text-emerald-50 px-3.5 py-2 rounded-b-lg shadow-md border-x border-b border-emerald-800 flex flex-col items-center gap-1 cursor-pointer"
          id="recycled-dispatch-tag"
        >
          <div className="w-1.5 h-1.5 bg-[#FAF4EB] rounded-full shadow-inner" />
          <span className="text-[7px] font-mono tracking-widest font-black uppercase leading-none">NEVO LOOP</span>
          <span className="text-[9px] font-sans font-black tracking-wider uppercase leading-none flex items-center gap-0.5">
            <HelpingHand className="w-2.5 h-2.5 text-emerald-300" /> AID ACTIVE
          </span>
        </motion.div>

        {/* Dynamic Items Layer */}
        <div className="relative w-full h-full" id="recycling-flat-lay-grid">
          
          {/* 1. RECYCLED/DONATED PRODUCTS */}
          {recyclingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 12, 
                delay: item.delay 
              }}
              whileHover={{ 
                scale: 1.07, 
                zIndex: 20,
                rotate: item.style.transform.includes('-') ? -3 : 3,
                transition: { duration: 0.2 }
              }}
              style={{ ...item.style, position: 'absolute' }}
              className="group cursor-pointer select-none"
              title={item.name}
            >
              <div className="relative bg-white p-1.5 rounded-xl shadow-xs group-hover:shadow-lg border border-[#ECE2D5] transition-shadow">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3.2] object-cover rounded-lg"
                />
                
                {/* Micro info bar */}
                <div className="mt-1 flex items-center justify-between px-0.5">
                  <span className="text-[7px] font-mono font-black text-stone-700 uppercase tracking-tighter">
                    {item.caption}
                  </span>
                  <span className="text-[5.5px] font-sans font-semibold text-emerald-600 bg-emerald-50 px-1 rounded-sm leading-none py-0.5">
                    RE-MADE
                  </span>
                </div>

                {/* Hover overlay with detail */}
                <div className="absolute inset-0 bg-stone-900/95 rounded-xl flex flex-col justify-center items-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[7.5px] font-mono font-bold text-emerald-400 tracking-widest uppercase">CIRCULAR PRODUCT</span>
                  <p className="text-[10px] font-display font-black text-white uppercase text-center mt-1 leading-tight">{item.name}</p>
                  <p className="text-[7.5px] font-sans text-stone-400 text-center mt-1 leading-none">{item.tag}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* 2. CIRCULAR EMBLEMS & ACCENTS */}
          {/* Circular Recycle Emblem Sticker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              rotate: [0, -6, 6, 0],
              y: [0, -2, 2, 0]
            }}
            transition={{ 
              scale: { delay: 0.8 },
              rotate: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
              y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
            }}
            whileHover={{ scale: 1.2, rotate: -15 }}
            className="absolute top-[35%] left-[45%] w-10 h-10 z-20 cursor-pointer"
            id="suitcase-sticker-circular-loop"
          >
            <div className="w-full h-full rounded-full bg-[#AA3871] text-white flex items-center justify-center shadow-md border border-white">
              <Recycle className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Handcraft Weaving Scissors Sticker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              rotate: [15, -15, 15],
              x: [0, 1, -1, 0]
            }}
            transition={{ 
              scale: { delay: 0.9 },
              rotate: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.3 },
              x: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
            }}
            whileHover={{ scale: 1.25, rotate: 30 }}
            className="absolute bottom-[23%] right-[40%] w-9 h-9 z-20 cursor-pointer"
            id="suitcase-sticker-scissors"
          >
            <div className="w-full h-full rounded-full bg-white text-[#AA3871] flex items-center justify-center shadow-md border border-stone-100">
              <Scissors className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Golden Star / Sparkle Accents */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute top-[28%] left-[10%] text-amber-500 flex gap-1 z-20"
            id="sparkle-accessories"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          </motion.div>

          {/* Donation Parcel Kraft Box Sticker with actual image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.95 }}
            whileHover={{ scale: 1.08, rotate: -5, zIndex: 30 }}
            className="absolute top-[34%] left-[16%] w-[26%] bg-white p-1 rounded-lg border border-[#EDE5DA] shadow-md flex flex-col justify-between cursor-pointer z-10"
            id="suitcase-donation-box-item"
          >
            <div className="bg-stone-50 aspect-square overflow-hidden relative rounded-md">
              <img 
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=300&q=80" 
                alt="Recycled Kraft Box" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 left-1 bg-amber-600/90 text-white text-[5px] font-mono font-bold px-1 rounded-sm uppercase tracking-widest flex items-center gap-0.5">
                <Package className="w-1.5 h-1.5" /> RECYCLED
              </div>
            </div>
            
            <div className="mt-1 flex flex-col items-center justify-center text-center px-0.5">
              <span className="text-[6px] font-mono font-black text-stone-700 uppercase tracking-tighter">
                PUNE DONATION BOX
              </span>
              <span className="text-[5px] font-sans font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                KRAFT CONTAINER
              </span>
            </div>
          </motion.div>

          {/* 3. POLAROID REALISTIC WORKSHOP STICKERS */}
          {polaroids.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.5, rotate: p.style.transform.includes('-') ? -25 : 25 }}
              animate={{ opacity: 1, scale: 1, rotate: parseFloat(p.style.transform.replace(/[^\d.-]/g, '')) }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: p.delay }}
              whileHover={{ 
                scale: 1.1, 
                zIndex: 25, 
                rotate: 0,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)"
              }}
              style={{ ...p.style, position: 'absolute' }}
              className="bg-white p-1 pb-3 shadow-md rounded-sm border border-stone-200 cursor-pointer z-10"
              id={`suitcase-polaroid-${p.id}`}
            >
              <div className="bg-stone-50 aspect-square overflow-hidden relative rounded-xs">
                <img 
                  src={p.image} 
                  alt={p.caption} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-800/10 mix-blend-multiply" />
              </div>
              <div className="text-[5.5px] font-mono font-black text-stone-500 text-center mt-1.5 tracking-wider leading-none">
                {p.caption}
              </div>
              <div className="text-[4.5px] font-sans font-bold text-stone-400 text-center mt-0.5 uppercase tracking-tighter">
                {p.tag}
              </div>
            </motion.div>
          ))}

          {/* 4. DONATION LOVE HEARTS FLOATING */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute top-[18%] right-[42%] text-rose-500 pointer-events-none"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.7, 1.0, 0.7]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-[32%] left-[40%] text-rose-500 pointer-events-none"
          >
            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
          </motion.div>

        </div>
      </div>
    </div>
  );
};

