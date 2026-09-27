import React, { useState } from 'react';
import { Garment } from '../types';
import { Sparkles, Scissors, Leaf, ShieldCheck, Shirt } from 'lucide-react';

interface GarmentImagePreviewProps {
  garment?: Partial<Garment> | null;
  itemTitle?: string;
  itemCategory?: string;
  itemFabric?: string;
  imageUrl?: string;
  className?: string;
  large?: boolean;
}

export default function GarmentImagePreview({ 
  garment, 
  itemTitle,
  itemCategory,
  itemFabric,
  imageUrl,
  className = "w-16 h-16 rounded-xl", 
  large = false 
}: GarmentImagePreviewProps) {
  const [imgError, setImgError] = useState(false);

  const title = itemTitle || garment?.name || "Textile Apparel";
  const fabric = itemFabric || garment?.fabric || garment?.fabricType || "Natural Fabric";
  const category = itemCategory || garment?.suggestedPathway || "Ethnic Wear";
  const actualImgUrl = imageUrl || garment?.imageUrl;

  const nameLower = title.toLowerCase();
  const fabricLower = fabric.toLowerCase();
  const catLower = category.toLowerCase();

  // If there's an image URL and no error has occurred, try displaying the image first
  if (actualImgUrl && !imgError) {
    return (
      <div 
        className={`${className} shrink-0 relative overflow-hidden bg-stone-100 border border-stone-200 shadow-xs flex items-center justify-center`}
        style={{ minWidth: large ? '100%' : 'auto' }}
      >
        <img
          src={actualImgUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback / Rich Native Vector Graphic
  // Determine color palette based on garment type & fabric
  let bgClass = "bg-stone-50";
  let textColor = "text-stone-700";
  let strokeColor = "#334155";
  let detailColor = "#94a3b8";
  let badgeLabel = fabric.split(' ')[0] || "TEXTILE";

  // 1. Ethnic Wear / Silk Dupatta / Saree (Festive Rich Gold & Crimson / Plum)
  if (nameLower.includes("dupatta") || nameLower.includes("sari") || nameLower.includes("saree") || nameLower.includes("silk") || catLower.includes("ethnic")) {
    bgClass = "bg-gradient-to-br from-[#FDF2F4] via-[#FCE7EB] to-[#F8D7DA]"; // Soft Royal Rose & Silk Gold
    textColor = "text-rose-900";
    strokeColor = "#9F1239";
    detailColor = "#D97706"; // Rich Gold Threading
    badgeLabel = "RAW SILK";
  }
  // 2. Khadi / Linen / Casual Shirts (Natural Warm Ivory & Indigo)
  else if (nameLower.includes("khadi") || nameLower.includes("linen") || nameLower.includes("mandarin") || nameLower.includes("shirt")) {
    bgClass = "bg-gradient-to-br from-[#F4F7FB] via-[#EBF2FA] to-[#E2EDF8]"; // Crisp Linen Sky Blue
    textColor = "text-blue-900";
    strokeColor = "#1E3A8A";
    detailColor = "#3B82F6";
    badgeLabel = "KHADI LINEN";
  }
  // 3. Pastel Mint Green for Cotton T-Shirts
  else if (nameLower.includes("tee") || nameLower.includes("t-shirt") || fabricLower.includes("cotton")) {
    bgClass = "bg-gradient-to-br from-[#EDF7ED] to-[#E2F0D9]"; // Soft Pastel Mint Green
    textColor = "text-emerald-900";
    strokeColor = "#065F46";
    detailColor = "#10B981";
    badgeLabel = "100% COTTON";
  } 
  // 4. Pastel Lilac for Denim / Jeans / Specialty
  else if (nameLower.includes("jeans") || nameLower.includes("denim") || nameLower.includes("trouser") || nameLower.includes("pants")) {
    bgClass = "bg-gradient-to-br from-[#F3F0FA] to-[#E8E2F5]"; // Soft Pastel Lilac Blue
    textColor = "text-indigo-950";
    strokeColor = "#312E81";
    detailColor = "#6366F1";
    badgeLabel = "DENIM";
  } 
  // 5. Pastel Apricot / Amber for Sweaters / Pullovers
  else if (nameLower.includes("pullover") || nameLower.includes("sweater") || nameLower.includes("cardigan") || nameLower.includes("jacket")) {
    bgClass = "bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]"; // Soft Pastel Amber
    textColor = "text-amber-950";
    strokeColor = "#78350F";
    detailColor = "#F59E0B";
    badgeLabel = "KNITWEAR";
  }

  // Draw the customized SVG garment outline
  const renderGarmentSVG = () => {
    // 1. Dupatta / Silk Shawl / Ethnic Scarf / Festive Drape
    if (nameLower.includes("dupatta") || nameLower.includes("sari") || nameLower.includes("saree") || nameLower.includes("silk") || catLower.includes("ethnic")) {
      return (
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gold zari embroidery sparkle motifs in background */}
          <circle cx="20" cy="22" r="1.5" fill={detailColor} />
          <circle cx="80" cy="78" r="1.5" fill={detailColor} />
          <path d="M 78,20 L 81,25 L 86,26 L 82,30 L 83,35 L 78,32 L 73,35 L 74,30 L 70,26 L 75,25 Z" fill={detailColor} opacity="0.4" />
          <path d="M 18,72 L 20,75 L 24,76 L 21,79 L 22,83 L 18,80 L 14,83 L 15,79 L 12,76 L 16,75 Z" fill={detailColor} opacity="0.35" />

          {/* Draped Silk Dupatta Curves */}
          <path 
            d="M 22,18 C 38,28 62,28 78,18 C 84,35 80,68 76,82 C 60,74 40,74 24,82 C 20,68 16,35 22,18 Z" 
            fill="white" 
            stroke={strokeColor} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          {/* Gold embroidered zari border trim on top and bottom */}
          <path d="M 23,22 C 38,32 62,32 77,22" stroke={detailColor} strokeWidth="2" strokeDasharray="3,1.5" />
          <path d="M 25,78 C 40,70 60,70 75,78" stroke={detailColor} strokeWidth="2" strokeDasharray="3,1.5" />
          
          {/* Flowing silk fold lines */}
          <path d="M 36,26 Q 42,50 35,76" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.4" />
          <path d="M 50,28 Q 50,52 50,74" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.5" />
          <path d="M 64,26 Q 58,50 65,76" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.4" />

          {/* Small tassel details on corners */}
          <line x1="24" y1="82" x2="22" y2="88" stroke={detailColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="76" y1="82" x2="78" y2="88" stroke={detailColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }

    // 2. Khadi Linen Shirt / Casual Mandarin Collar Shirt
    if (nameLower.includes("khadi") || nameLower.includes("linen") || nameLower.includes("mandarin") || nameLower.includes("shirt")) {
      return (
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle woven texture accents */}
          <circle cx="16" cy="24" r="1.5" fill={detailColor} opacity="0.6" />
          <circle cx="84" cy="74" r="1.5" fill={detailColor} opacity="0.6" />
          
          {/* Shirt Body */}
          <path 
            d="M 32,22 L 68,22 L 86,34 L 78,46 L 72,42 L 72,82 C 72,85 69,87 66,87 L 34,87 C 31,87 28,85 28,82 L 28,42 L 22,46 L 14,34 Z" 
            fill="white" 
            stroke={strokeColor} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          {/* Mandarin Band Collar */}
          <path d="M 38,22 C 40,16 60,16 62,22" stroke={strokeColor} strokeWidth="2" fill="white" strokeLinecap="round" />
          {/* Center Button Placket */}
          <line x1="50" y1="22" x2="50" y2="87" stroke={strokeColor} strokeWidth="1.5" />
          {/* Pearl / Wooden Buttons */}
          <circle cx="50" cy="30" r="1.5" fill={detailColor} />
          <circle cx="50" cy="42" r="1.5" fill={detailColor} />
          <circle cx="50" cy="54" r="1.5" fill={detailColor} />
          <circle cx="50" cy="66" r="1.5" fill={detailColor} />
          {/* Chest Pocket */}
          <rect x="33" y="36" width="10" height="12" rx="1.5" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="1.5,1" />
        </svg>
      );
    }

    // 3. Jeans / Denim Trousers
    if (nameLower.includes("jeans") || nameLower.includes("trousers") || nameLower.includes("denim") || nameLower.includes("pants")) {
      return (
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="78" cy="24" r="2" fill={detailColor} opacity="0.7" />
          <circle cx="16" cy="80" r="1.5" fill={detailColor} opacity="0.7" />
          {/* Pants Silhouette */}
          <path 
            d="M 32,18 L 68,18 C 71,18 73,20 72,23 L 64,82 C 64,84 61,85 59,85 L 52,85 C 50,85 49,83 49,81 L 50,45 L 47,81 C 47,83 46,85 44,85 L 37,85 C 35,85 32,84 32,82 L 24,23 C 23,20 25,18 28,18 Z" 
            fill="white" 
            stroke={strokeColor} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          {/* Belt loops & pockets */}
          <path d="M 32,25 C 38,28 62,28 68,25" stroke={strokeColor} strokeWidth="1.25" strokeDasharray="2,1.5" />
          <path d="M 35,18 L 35,25 M 61,18 L 61,25 M 48,18 L 48,25" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 27,24 Q 32,28 35,24" stroke={strokeColor} strokeWidth="1" />
          <path d="M 69,24 Q 64,28 61,24" stroke={strokeColor} strokeWidth="1" />
          <line x1="48" y1="25" x2="48" y2="42" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    }

    // 4. Jacket / Pullover / Sweater
    if (nameLower.includes("pullover") || nameLower.includes("sweater") || nameLower.includes("jacket") || nameLower.includes("cardigan")) {
      return (
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="85" cy="22" r="1.5" fill={detailColor} opacity="0.6" />
          <circle cx="18" cy="72" r="2.5" fill={detailColor} opacity="0.6" />
          <path 
            d="M 30,22 Q 48,25 66,22 L 84,33 L 74,48 L 69,45 L 69,76 C 69,80 66,82 62,82 L 34,82 C 30,82 27,80 27,76 L 27,45 L 22,48 L 12,33 Z" 
            fill="white" 
            stroke={strokeColor} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          <path d="M 30,22 L 38,34 L 48,24 L 58,34 L 66,22" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="48" y1="24" x2="48" y2="82" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4,1" />
          <line x1="12" y1="33" x2="16" y2="39" stroke={strokeColor} strokeWidth="1" />
          <line x1="84" y1="33" x2="80" y2="39" stroke={strokeColor} strokeWidth="1" />
          <path d="M 27,76 L 69,76" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    }

    // 5. Default Cotton T-Shirt / Top
    return (
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="25" r="1.5" fill={detailColor} opacity="0.6" />
        <circle cx="82" cy="75" r="2.5" fill={detailColor} opacity="0.6" />
        <path 
          d="M 30,22 C 38,26 62,26 70,22 L 85,32 L 77,44 L 71,41 L 71,78 C 71,81 68,84 64,84 L 36,84 C 32,84 29,81 29,78 L 29,41 L 23,44 L 15,32 Z" 
          fill="white" 
          stroke={strokeColor} 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
        <path d="M 40,23 C 45,28 55,28 60,23" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="41" x2="33" y2="34" stroke={strokeColor} strokeWidth="1" strokeDasharray="1.5,1.5" />
        <line x1="71" y1="41" x2="67" y2="34" stroke={strokeColor} strokeWidth="1" strokeDasharray="1.5,1.5" />
      </svg>
    );
  };

  return (
    <div 
      className={`${className} ${bgClass} shrink-0 flex items-center justify-center relative overflow-hidden transition-all duration-300 border border-black/10 shadow-xs group`}
      style={{ minWidth: large ? '100%' : 'auto' }}
    >
      {/* Decorative watermark elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.25] flex items-center justify-center">
        <div className="absolute top-1.5 left-1.5">
          <Sparkles className="w-2.5 h-2.5" style={{ color: strokeColor }} />
        </div>
        <div className="absolute bottom-2 right-2">
          <Scissors className="w-2 h-2" style={{ color: strokeColor }} />
        </div>
        {fabricLower.includes("cotton") && (
          <div className="absolute bottom-1.5 left-2">
            <Leaf className="w-2 h-2 text-emerald-700" />
          </div>
        )}
      </div>

      {/* Render the core beautiful clothing outline */}
      {renderGarmentSVG()}

      {/* Aesthetic mini corner tag */}
      <div 
        className="absolute bottom-1 left-1 px-1 py-[1px] rounded-xs text-[6px] font-mono font-bold tracking-widest uppercase border pointer-events-none shadow-2xs"
        style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: strokeColor, borderColor: strokeColor + '40' }}
      >
        {badgeLabel}
      </div>
    </div>
  );
}

