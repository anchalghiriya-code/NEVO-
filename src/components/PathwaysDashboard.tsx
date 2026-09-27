import React, { useState, useEffect } from 'react';
import { Garment, NGO } from '../types';
import { 
  Heart, Tag, Scissors, Recycle, Trash2, ArrowRight, 
  MapPin, Phone, Mail, CheckCircle2, ChevronRight, 
  ShoppingBag, Sparkles, Sliders, ExternalLink, RefreshCw, 
  Layers, Info, ShieldCheck, Check, Clock, ChevronLeft,
  AlertCircle, ShieldAlert, Cpu, Wrench, Droplets, Wind, Leaf, Truck
} from 'lucide-react';
import NGOMap from './NGOMap';
import GarmentImagePreview from './GarmentImagePreview';
import TextilePassportModal from './TextilePassportModal';

interface PathwaysProps {
  garments: Garment[];
  ngos: NGO[];
  userSession: any;
  onNavigateToDelivery?: (mode?: 'pickup' | 'buyer') => void;
  activeStep?: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose';
  onStepChange?: (step: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose') => void;
  selectedGarmentId?: string | null;
  onSelectGarmentId?: (id: string) => void;
  onUpdatePathway?: (id: string, pathway: Garment['suggestedPathway']) => void;
}

export default function PathwaysDashboard({
  garments,
  ngos,
  userSession,
  onNavigateToDelivery,
  activeStep: propActiveStep,
  onStepChange,
  selectedGarmentId: propSelectedGarmentId,
  onSelectGarmentId,
  onUpdatePathway
}: PathwaysProps) {
  // Step Page navigation: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose' (default: 'donate')
  const [internalStep, setInternalStep] = useState<'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose'>(
    propActiveStep && propActiveStep !== ('overview' as any) ? propActiveStep : 'donate'
  );
  
  // Sync if prop activeStep changes
  useEffect(() => {
    if (propActiveStep && propActiveStep !== ('overview' as any)) {
      setInternalStep(propActiveStep);
    }
  }, [propActiveStep]);

  const activeStep = (propActiveStep && propActiveStep !== ('overview' as any)) ? propActiveStep : internalStep;

  const handleStepChange = (step: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose') => {
    setInternalStep(step);
    onStepChange?.(step);
    setUpcycleStepIndex(0);
  };

  // Garment selected for targeted pathway inspection (e.g. Disposal)
  const [internalSelectedGarmentId, setInternalSelectedGarmentId] = useState<string | null>(null);

  useEffect(() => {
    if (propSelectedGarmentId) {
      setInternalSelectedGarmentId(propSelectedGarmentId);
    }
  }, [propSelectedGarmentId]);

  const activeGarmentId = propSelectedGarmentId || internalSelectedGarmentId;

  const handleSelectActiveGarment = (id: string) => {
    setInternalSelectedGarmentId(id);
    onSelectGarmentId?.(id);
  };

  // Universal cloth material guide tab selection
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>('cotton');

  // Selected NGO for Donors view
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(ngos[0] || null);
  
  // Sell section states
  const [sellFilter, setSellFilter] = useState<'all' | 'ethnic' | 'casuals' | 'athleisure' | 'accessories'>('all');
  const [sellSubView, setSellSubView] = useState<'buy' | 'sell_mine'>('buy');
  const [purchasingItemId, setPurchasingItemId] = useState<string | null>(null);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState<string | null>(null);

  // Upcycle section states
  const [activeUpcycleProject, setActiveUpcycleProject] = useState<string>('jeans_tote');
  const [upcycleStepIndex, setUpcycleStepIndex] = useState<number>(0);

  // Textile Passport Modal preview state
  const [selectedPassportGarment, setSelectedPassportGarment] = useState<Garment | null>(null);

  // Products catalog for conscious sale
  const saleProducts = [
    {
      id: "sale_1",
      name: "Revived Indigo Denim Tote",
      category: "accessories",
      price: 450,
      origin: "Upcycled from 100% thick Cotton Jeans",
      fabric: "Denim & Cotton mix",
      stock: 4,
      details: "Features double-stitched reinforcements, a front phone pocket salvaged from trouser cuffs, and adjustable canvas handles."
    },
    {
      id: "sale_2",
      name: "Floral Block-Print Cotton Kurti",
      category: "ethnic",
      price: 1200,
      origin: "Remade from premium salvaged Jaipur cotton saris",
      fabric: "100% Natural Plant Cotton",
      stock: 2,
      details: "Soft, breathable, relaxed fit with hand block-printed motifs using eco-friendly natural plant dyes."
    },
    {
      id: "sale_3",
      name: "Recycled Polyester Sport Pullover",
      category: "athleisure",
      price: 850,
      origin: "Extruded and respun from synthetic dry-fit garments",
      fabric: "90% Recycled Polyester, 10% Spandex",
      stock: 6,
      details: "Moisture-wicking sportswear panels. Highly stretchable, helps conserve ocean plastic."
    },
    {
      id: "sale_4",
      name: "Upcycled Casual Khaki Jacket",
      category: "casuals",
      price: 1500,
      origin: "Restitched from military canvas surplus and flannel lining",
      fabric: "Technical Heavy Canvas Blends",
      stock: 1,
      details: "Chic design with internal thermal pockets, custom coconut shell buttons, and vintage collar lapels."
    },
    {
      id: "sale_5",
      name: "Handmade Patchwork Wool Scarf",
      category: "accessories",
      price: 650,
      origin: "Knit recovery from distressed cashmere & merino garments",
      fabric: "100% Natural Animal Wool",
      stock: 3,
      details: "Lovingly joined using premium crochet piping. Guaranteed scratch-free maximum comfort."
    },
    {
      id: "sale_6",
      name: "Re-dyed Ikat Casual Mandarin Shirt",
      category: "casuals",
      price: 950,
      origin: "Renewed from faded casual mens shirts",
      fabric: "Natural Plant Fibres",
      stock: 5,
      details: "Features indigo resist-dyeing patterns that give new luster to slightly faded linen cotton shirts."
    },
    {
      id: "sale_7",
      name: "Kora Silk Recycled Dupatta",
      category: "ethnic",
      price: 1100,
      origin: "Recovered from discarded silk wedding dresses",
      fabric: "Pure Natural Animal Silk",
      stock: 3,
      details: "Semi-translucent gold zari border dupatta ideal for pairing with ethnic fusion sets."
    }
  ];

  // Upcycling projects guides
  const upcycleProjects = [
    {
      id: "jeans_tote",
      title: "Denim Utility Tote from Old Jeans",
      sourceGarmentType: "Denim Jeans & Heavy Trousers",
      estimatedTime: "45 mins",
      difficulty: "Beginner Friendly",
      materials: ["Distressed heavy denim pants", "Fabric scissors", "Heavy denim thread", "Pins", "Sewing machine or hand needle"],
      flowSteps: [
        { step: 1, title: "Cut Trouser Legs", desc: "Cut trouser legs straight across, approximately 14-16 inches below the rear pockets to form the bag body." },
        { step: 2, title: "Invert & Pin", desc: "Turn the cut segment inside out. Pin the bottom edge straight across where you completed the cut." },
        { step: 3, title: "Double Stitch Bottom", desc: "Stitch the bottom shut using heavy denim thread. Apply a zig-zag stitch along raw edges to prevent fraying." },
        { step: 4, title: "Prepare Straps", desc: "Cut two strips (2 x 24 inches) from the remaining trouser leg fabric. Fold edges inwards by 0.5 inches and stitch down both sides." },
        { step: 5, title: "Attach Handles", desc: "Turn the bag right side out. Pin strap ends inside the waistband (2 inches deep) and stitch firmly in reinforced box patterns." }
      ]
    },
    {
      id: "tshirt_pajamas",
      title: "Comfy Pajama Shorts from Cotton Tee",
      sourceGarmentType: "Oversized Cotton T-Shirt",
      estimatedTime: "60 mins",
      difficulty: "Moderate Complexity",
      materials: ["Large or oversized cotton shirt", "1-inch wide elastic band", "Tailor chalk", "Pins", "Sewing machine"],
      flowSteps: [
        { step: 1, title: "Pattern Positioning", desc: "Place an existing well-fitting pair of pajama shorts flat over the folded cotton T-shirt to act as your trace pattern." },
        { step: 2, title: "Cut Out Panels", desc: "Draw a chalk line 1 inch outside the pattern for seam allowance, then carefully cut the two mirror fabric pieces." },
        { step: 3, title: "Stitch Crotch Curve", desc: "Place the two pieces with right sides facing. Sew the front and back curved rise seams together securely." },
        { step: 4, title: "Form Inseam", desc: "Re-align so leg openings form. Pin the inner thigh inseam from left ankle up through crotch and down to right ankle. Stitch." },
        { step: 5, title: "Insert Elastic Waist", desc: "Fold over top waistband edge (1.5 inch cuff), sew leaving a 2-inch gap. Thread elastic through, stitch elastic ends, close gap." }
      ]
    },
    {
      id: "shirt_apron",
      title: "Gourmet Kitchen Apron from Button-down",
      sourceGarmentType: "Linen or Cotton Formal Shirt",
      estimatedTime: "30 mins",
      difficulty: "Beginner Friendly",
      materials: ["Old button-up shirt", "Bias tape (2 meters)", "Tailor scissors", "Pins"],
      flowSteps: [
        { step: 1, title: "Deconstruct Collar & Back", desc: "Cut collar off completely. Slice straight up the side seams and across shoulders to remove arm sleeves and back panel." },
        { step: 2, title: "Cut Diagonal Bib", desc: "Fold the front panel in half lengthwise. Cut a smooth diagonal sweep from under the armpits up to the collar band to fashion the bib." },
        { step: 3, title: "Sew Bias Trim", desc: "Hem all raw cut edges or fold under and stitch securely to form clean, fray-resistant borders." },
        { step: 4, title: "Build Bib Straps", desc: "Cut 4 identical strips from the discarded back panel to construct side ties (waist) and head strap (neck)." },
        { step: 5, title: "Top-stitch Front Pockets", desc: "Convert leftover sleeves into patch pockets. Top-stitch to center front of the apron for storing utensils." }
      ]
    }
  ];

  // Machinery specifications for recycling
  const machinerySpecs = [
    {
      category: "Natural Plant Fibres",
      examples: "Cotton, Linen, Hemp, Jute",
      method: "Mechanical Recycling (fiber opening, carding, respinning)",
      machinery: [
        "Optical Spectroscopy Sorter (checks cotton purity)",
        "Textile Shredder (heavy high-speed blades)",
        "Fiber Opening Machine (de-aggregates woven cloths)",
        "Carding Cylinder (aligns recovered fibers)",
        "Ring Spinning Machine (creates fresh high-strength yarn)"
      ],
      outputs: "Recycled yarn, Eco shopping bags, T-shirts, premium thermal insulation."
    },
    {
      category: "Natural Animal Fibres",
      examples: "Wool, Silk, Cashmere",
      method: "Fiber Recovery & Felt Production",
      machinery: [
        "Textile Shredder (fine needle tooth roller)",
        "Gentle Wool Carding Machine",
        "Low-twist Loop Spinner",
        "Felt Press Machine (thermal hydraulic consolidation)"
      ],
      outputs: "Comfort blanketing, acoustic thermal sheets, industrial felt slips, winter upholstery."
    },
    {
      category: "Synthetic Fibres",
      examples: "Polyester, Nylon, Spandex",
      method: "Mechanical & Chemical Remelting / Extrusion",
      machinery: [
        "Textile Shear Pulverizer",
        "Washing Line (removes sizing & adhesives)",
        "Granulator (slices synthetic threads into flakes)",
        "Extruder + Pelletizer (heats and shapes polymer pearls)",
        "Filament Extrusion Machine"
      ],
      outputs: "Polyester pellets, synthetic dry-fit fibers, technical backpacks, engineered plastics."
    },
    {
      category: "Blended Fabrics",
      examples: "Cotton-Polyester, Wool-Polyester",
      method: "Combined Chemical/Mechanical Separation",
      machinery: [
        "AI Optical Near-Infrared Sorter",
        "Fluidized Fiber Separation Unit",
        "Chemical Dissolution Reactor (solubilizes cellulose)",
        "Fiber Recovery Extraction Line"
      ],
      outputs: "Mixed utility fibers, dense soundboards, industrial utility wipes, nonwoven geo-textiles."
    }
  ];

  // Filter products by category
  const filteredProducts = sellFilter === 'all' 
    ? saleProducts 
    : saleProducts.filter(p => p.category === sellFilter);

  // Group user garments by pathway
  const garmentsInPathway = (path: string) => {
    return garments.filter(g => g.suggestedPathway.toLowerCase() === path.toLowerCase());
  };

  const currentProject = upcycleProjects.find(p => p.id === activeUpcycleProject) || upcycleProjects[0];

  // Handle Buy Product action (places order and connects to Delivery Part 2)
  const handleBuyProduct = async (product: typeof saleProducts[0]) => {
    setPurchasingItemId(product.id);
    setPurchaseSuccessMsg(null);

    try {
      const response = await fetch("/api/buyer-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemTitle: product.name,
          itemCategory: product.category,
          itemFabric: product.fabric,
          price: product.price,
          sellerName: "Project Nevo Atelier",
          sellerCity: "Wakad, Pune",
          buyerName: userSession.user?.name || "Anchal Ghiriya",
          buyerContact: userSession.user?.contact || "+91 91580 98765",
          buyerAddress: userSession.user?.address || "Apartment 402, Kaspate Wasti, Wakad, Pune, 411057"
        })
      });

      if (response.ok) {
        setPurchaseSuccessMsg(`Order placed for ${product.name}! Redirecting to Doorstep Delivery Scheduler...`);
        setTimeout(() => {
          if (onNavigateToDelivery) {
            onNavigateToDelivery('buyer');
          }
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasingItemId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      
      {/* Header & Page Sub-Navigation */}
      <div className="space-y-4 pb-4 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Step 3 of 4 · Outcome Pathway
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
              Circularity Pathways Studio
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
              Dedicated workflows for all 5 circular pathways: Donors, Sell, Upcycle, Recycle, and Dispose.
            </p>
          </div>

          {/* Quick jump to logistics */}
          {onNavigateToDelivery && (
            <button
              onClick={() => onNavigateToDelivery('pickup')}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Logistics & Delivery Hub</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          )}
        </div>

        {/* Dedicated Steps Switcher Tabs (Directly starting with 1. Donors) */}
        <div className="flex p-1 bg-stone-100 rounded-2xl overflow-x-auto gap-1">
          {[
            { id: 'donate', label: '1. Donors', icon: Heart, count: garmentsInPathway('donate').length },
            { id: 'sell', label: '2. Sell', icon: Tag, count: garmentsInPathway('sell').length },
            { id: 'upcycle', label: '3. Upcycle', icon: Scissors, count: garmentsInPathway('upcycle').length },
            { id: 'recycle', label: '4. Recycle', icon: Recycle, count: garmentsInPathway('recycle').length },
            { id: 'dispose', label: '5. Dispose', icon: Trash2, count: garmentsInPathway('dispose').length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  handleStepChange(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive 
                    ? tab.id === 'donate' ? 'text-rose-600'
                    : tab.id === 'sell' ? 'text-amber-600'
                    : tab.id === 'upcycle' ? 'text-blue-600'
                    : tab.id === 'recycle' ? 'text-emerald-600'
                    : 'text-stone-800'
                    : 'text-stone-400'
                }`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: DONORS (CHARITABLE GIVING & PUNE NGOS) */}
      {/* ======================================================== */}
      {activeStep === 'donate' && (
        <div className="space-y-6">
          <div className="bg-rose-50/50 rounded-3xl border border-rose-200/70 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  Step 1 · Donors & Direct Giving
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                  Verified Pune NGO Redistribution Network
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                  Clothes in good wearable condition are disinfected using eco-safe steam technology and delivered to trusted community shelters and welfare centers across Wakad and Pune.
                </p>
              </div>

              {onNavigateToDelivery && (
                <button
                  onClick={() => onNavigateToDelivery('pickup')}
                  className="shrink-0 py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Schedule Donor Pickup</span>
                </button>
              )}
            </div>
          </div>

          {/* User's Donated Garments Queue */}
          {garmentsInPathway('donate').length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Your Clothes Assigned for Donation ({garmentsInPathway('donate').length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {garmentsInPathway('donate').map(g => (
                  <div key={g.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-3">
                    <GarmentImagePreview garment={g} className="w-12 h-12 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-stone-900 truncate">{g.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{g.fabric}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">Ready for Steam Disinfection</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive NGO Directory & Real Map */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Local Verified NGO Partners</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Select any NGO to view their collection guidelines, contact person, and real Google Maps location in Pune.
              </p>
            </div>

            <NGOMap
              ngos={ngos}
              selectedNgo={selectedNgo}
              onSelectNgo={setSelectedNgo}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: SELL (CONSCIOUS RESALE & MARKETPLACE) */}
      {/* ======================================================== */}
      {activeStep === 'sell' && (
        <div className="space-y-6">
          <div className="bg-amber-50/50 rounded-3xl border border-amber-200/70 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Step 2 · Sell & Resale Marketplace
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                  Conscious Circular Fashion Store
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                  Shop handcrafted upcycled accessories and vetted vintage apparel, or list your scanned garments for secondhand sale with verified doorstep delivery to buyers.
                </p>
              </div>

              {/* Sub-view toggle */}
              <div className="flex p-1 bg-white rounded-xl border border-amber-200 shrink-0">
                <button
                  onClick={() => setSellSubView('buy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    sellSubView === 'buy' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Browse Catalog
                </button>
                <button
                  onClick={() => setSellSubView('sell_mine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    sellSubView === 'sell_mine' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  My Items for Sale ({garmentsInPathway('sell').length})
                </button>
              </div>
            </div>
          </div>

          {purchaseSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{purchaseSuccessMsg}</span>
            </div>
          )}

          {sellSubView === 'buy' ? (
            /* Buyer Catalog */
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto w-fit">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'ethnic', label: 'Ethnic & Festive' },
                  { id: 'casuals', label: 'Casual Shirts & Tops' },
                  { id: 'athleisure', label: 'Sportswear' },
                  { id: 'accessories', label: 'Bags & Accessories' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSellFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      sellFilter === cat.id
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Preview */}
                      <div className="p-4 pb-0 flex gap-4 items-start">
                        <GarmentImagePreview
                          itemTitle={product.name}
                          itemCategory={product.category}
                          itemFabric={product.fabric}
                          className="w-20 h-20 rounded-xl"
                        />

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2 mt-0.5">
                            {product.name}
                          </h3>
                          <div className="text-base font-bold text-stone-900 font-mono mt-1">
                            ₹{product.price}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-3 space-y-2 text-xs text-stone-600">
                        <p className="line-clamp-2 text-stone-500 leading-relaxed">
                          {product.details}
                        </p>
                        <div className="text-[11px] text-stone-400 border-t border-stone-100 pt-2 font-mono">
                          {product.origin}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleBuyProduct(product)}
                        disabled={purchasingItemId === product.id}
                        className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <span>{purchasingItemId === product.id ? 'Placing Order...' : 'Buy & Ship Doorstep'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* My Items For Sale */
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                Your Scanned Items Listed for Sale ({garmentsInPathway('sell').length})
              </h3>

              {garmentsInPathway('sell').length === 0 ? (
                <p className="text-xs text-stone-500">
                  You don't have any garments marked for sale yet. In the Apparel Scanner, select "Sell" on any item in good condition to list it here!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {garmentsInPathway('sell').map((garment) => (
                    <div key={garment.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex gap-4 items-center">
                      <GarmentImagePreview garment={garment} className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-stone-900 truncate">{garment.name}</div>
                        <div className="text-xs text-stone-500 font-mono">{garment.fabric} · {garment.condition}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-emerald-700 font-mono">
                            Est. Payout: ₹450 - ₹750
                          </span>
                          <span className="text-[10px] text-stone-400">· Active Listing</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: UPCYCLE (ARTISANAL CRAFT & STEP-BY-STEP DIY) */}
      {/* ======================================================== */}
      {activeStep === 'upcycle' && (
        <div className="space-y-6">
          <div className="bg-blue-50/50 rounded-3xl border border-blue-200/70 p-6 md:p-8">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Step 3 · Upcycle & Atelier Craft
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Step-by-Step Upcycling DIY Studio
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Turn discarded denims, worn cotton tees, and surplus shirts into beautiful, high-utility lifestyle accessories with step-by-step guidance.
            </p>
          </div>

          {/* Project Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upcycleProjects.map((proj) => {
              const isSelected = activeUpcycleProject === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveUpcycleProject(proj.id);
                    setUpcycleStepIndex(0);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-blue-300' : 'text-stone-400'}`}>
                    {proj.difficulty} · {proj.estimatedTime}
                  </div>
                  <div className="font-semibold text-sm mt-1">{proj.title}</div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    From: {proj.sourceGarmentType}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Project Step-by-Step Viewer */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{currentProject.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                  <span>Estimated Time: <strong className="text-stone-800">{currentProject.estimatedTime}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Difficulty: <strong className="text-stone-800">{currentProject.difficulty}</strong></span>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setUpcycleStepIndex(prev => Math.max(0, prev - 1))}
                  disabled={upcycleStepIndex === 0}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-semibold px-2">
                  Step {upcycleStepIndex + 1} of {currentProject.flowSteps.length}
                </span>
                <button
                  onClick={() => setUpcycleStepIndex(prev => Math.min(currentProject.flowSteps.length - 1, prev + 1))}
                  disabled={upcycleStepIndex === currentProject.flowSteps.length - 1}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Materials checklist */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Materials & Tools Required
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentProject.materials.map((mat, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700">
                    ✓ {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Active Step Highlight */}
            <div className="p-6 bg-gradient-to-r from-blue-50/50 to-stone-50 rounded-2xl border border-blue-200/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {currentProject.flowSteps[upcycleStepIndex].step}
                </span>
                <h4 className="font-bold text-stone-900 text-base">
                  {currentProject.flowSteps[upcycleStepIndex].title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {currentProject.flowSteps[upcycleStepIndex].desc}
              </p>
            </div>

            {/* All Steps Stepper Progress */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                All Project Steps
              </span>
              <div className="space-y-2">
                {currentProject.flowSteps.map((step, idx) => (
                  <div
                    key={step.step}
                    onClick={() => setUpcycleStepIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      upcycleStepIndex === idx
                        ? 'bg-blue-50/60 border-blue-200 shadow-2xs'
                        : 'bg-white hover:bg-stone-50 border-stone-200/80'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5 ${
                      upcycleStepIndex === idx ? 'bg-blue-600 text-white' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {step.step}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">{step.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: RECYCLE (INDUSTRIAL FIBER REGENERATION) */}
      {/* ======================================================== */}
      {activeStep === 'recycle' && (
        <div className="space-y-6">
          <div className="bg-emerald-50/50 rounded-3xl border border-emerald-200/70 p-6 md:p-8">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Step 4 · Industrial Fiber Regeneration
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Mechanical & Chemical Textile Recycling
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Post-consumer textiles that cannot be reworn are mechanically shredded, opened, carded, and respun into fresh yarn spools, acoustic padding, and mattress insulation.
            </p>
          </div>

          {/* Machinery Specs Table */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Fabric Family Recycling Processing Matrix
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Breakdown of processing stages, machinery utilized, and final circular outputs by fabric category.
              </p>
            </div>

            <div className="space-y-4">
              {machinerySpecs.map((spec, i) => (
                <div key={i} className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200/60 pb-2.5">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{spec.category}</span>
                      <span className="text-xs text-stone-500 ml-2 font-mono">({spec.examples})</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 font-mono">
                      {spec.method}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                      Machinery Utilized:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.machinery.map((m, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700">
                          ⚙️ {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                      Regenerated Circular Outputs:
                    </span>
                    <p className="text-xs text-stone-600 font-medium">
                      {spec.outputs}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recycler hubs */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
              <div>
                <span className="font-bold">Active Industrial Hub:</span> Pimpri & Chakan Mechanical Recovery Nodes (Pune).
              </div>
              {onNavigateToDelivery && (
                <button
                  onClick={() => onNavigateToDelivery('pickup')}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors shrink-0"
                >
                  Schedule Recycler Batch Pickup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 5: DISPOSE (ITEMS QUEUED FOR OWNER TEAM DISPOSAL) */}
      {/* ======================================================== */}
      {activeStep === 'dispose' && (() => {
        // Collect items that the user/owner chose to dispose
        const explicitlyDisposed = garments.filter(g => g.suggestedPathway === 'Dispose');
        
        // If a specific garment was just routed into this view, ensure it is in the list
        const activeTargetGarment = activeGarmentId ? garments.find(g => g.id === activeGarmentId) : null;
        
        let disposalList: Garment[] = [...explicitlyDisposed];
        if (activeTargetGarment && !disposalList.some(item => item.id === activeTargetGarment.id)) {
          disposalList = [activeTargetGarment, ...disposalList];
        }

        // Remaining uploaded garments that are not in the disposal list
        const otherUploadedGarments = garments.filter(g => !disposalList.some(d => d.id === g.id));

        // Quick rough process helper for owner & team deconstruction
        const getTeamDisposalProcess = (g: Garment) => {
          const text = `${g.fabricType} ${g.blendPercentage} ${g.garmentCategory} ${g.fabric}`.toLowerCase();
          
          if (text.includes('denim') || text.includes('jeans')) {
            return {
              categoryLabel: "Heavy Twill Denim",
              hardware: "Unpick brass zipper teeth, steel button rivets, and copper pocket studs for scrap metal foundry.",
              treatment: "85°C organic enzyme bio-wash to decontaminate heavy cotton fibers.",
              shredding: "Dual-shaft knife milling into 12mm denim flock.",
              outputProduct: "High-density acoustic soundproofing panels for Pune automotive corridor."
            };
          } else if (text.includes('polyester') || text.includes('synthetic') || text.includes('nylon')) {
            return {
              categoryLabel: "Synthetic Petrochemical Polymer",
              hardware: "Strip polyester zipper coils, elastic bands, and care labels.",
              treatment: "Cold-water surfactant rinse to remove surface dust and sizing.",
              shredding: "Rotary granulation into uniform polymer flakes.",
              outputProduct: "Extruded & needle-punched into highway roadbed geotextile stabilization mats."
            };
          } else if (text.includes('silk') || text.includes('wool') || text.includes('cashmere')) {
            return {
              categoryLabel: "Natural Protein Fiber",
              hardware: "Detach synthetic borders, lace embroidery, and plastic buttons.",
              treatment: "Gentle carding drum wash with mild bio-enzyme.",
              shredding: "Microfiber opening into soft nitrogen-rich fleece.",
              outputProduct: "Compressed into biodegradable agricultural mulch mats & seedling blankets."
            };
          } else if (text.includes('cotton') || text.includes('linen') || text.includes('khadi')) {
            return {
              categoryLabel: "Natural Plant Cellulose",
              hardware: "Snip resin/plastic buttons and extract collar stays.",
              treatment: "85°C bio-sanitization wash (100% zero chlorine bleach).",
              shredding: "Rotary rag cutter slicing into 15mm opened cotton fluff.",
              outputProduct: "Hydraulically felted into industrial workshop wipes & heavy rag paper."
            };
          } else {
            return {
              categoryLabel: "Composite Blended Apparel",
              hardware: "Mechanically extract all non-textile zippers, buttons, and eyelets.",
              treatment: "Sanitizing thermal wash.",
              shredding: "High-speed shredding into mixed composite flock.",
              outputProduct: "Bonded with eco-polyol resin into vehicle trunk underlay and acoustic dampening."
            };
          }
        };

        const totalWeightKg = (disposalList.length * 0.55).toFixed(1);
        const totalLandfillLiters = (disposalList.length * 12.5).toFixed(0);

        return (
          <div className="space-y-6 text-left">
            
            {/* Header & Pipeline Metrics */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
                    Step 5 · Disposal Pipeline
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    Owner & Team Execution Ledger
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Items Designated for Zero-Landfill Disposal
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Here is the active operational list of unwearable clothing items chosen for disposal. The owner and operations team will collect these garments, strip hardware, sanitize fibers, and shred them into industrial downcycled materials.
                </p>
              </div>

              {/* Quick stats and action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 text-left min-w-[140px]">
                  <span className="text-[10px] text-stone-400 font-mono uppercase block">Queued Items</span>
                  <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
                    {disposalList.length} <span className="text-xs font-normal text-stone-400">clothes</span>
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    ~{totalWeightKg} kg mass
                  </span>
                </div>

                {onNavigateToDelivery && disposalList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onNavigateToDelivery('pickup')}
                    className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <Truck className="w-4 h-4 text-rose-700" />
                    <span>Schedule Pickup ({disposalList.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Brief Rough Idea: Owner & Team Disposal Protocol */}
            <div className="p-4 bg-stone-100 border border-stone-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900 uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-stone-700" />
                  Rough Idea: How the Owner & Team Handle Your Disposed Items
                </span>
                <span className="text-[11px] text-stone-500 font-mono font-normal">Wakad & Pimpri Operations</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200/70 space-y-1">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] font-mono flex items-center justify-center">1</span>
                    Doorstep Pickup
                  </span>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Owner team dispatches electric collection van to contributor in Wakad to pick up the designated clothing bag.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200/70 space-y-1">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] font-mono flex items-center justify-center">2</span>
                    Hardware & Wash
                  </span>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Team unpicks zippers, rivets, and buttons for metal scrap, then runs an 85°C plant-enzyme sanitization wash.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200/70 space-y-1">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] font-mono flex items-center justify-center">3</span>
                    Shredding & Downcycling
                  </span>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Clean cloth is fed through rotary rag cutters into 12–15mm flock and compressed into acoustic boards, geotextiles, or shop rags.
                  </p>
                </div>
              </div>
            </div>

            {/* EMPTY STATE: If no items are queued for disposal yet */}
            {disposalList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-5 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-600">
                  <Trash2 className="w-8 h-8 text-stone-500" />
                </div>

                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="text-lg font-bold text-stone-900">
                    No Clothes Currently Chosen for Disposal
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    When you upload clothing in the Apparel Scanner and select <span className="font-semibold text-stone-800">Dispose</span>, those items will be listed here with the owner team's deconstruction steps.
                  </p>
                </div>

                {/* If other uploaded garments exist, allow selecting them directly */}
                {otherUploadedGarments.length > 0 ? (
                  <div className="max-w-2xl mx-auto pt-4 border-t border-stone-100 space-y-3 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800">
                        Choose from your uploaded clothes ({otherUploadedGarments.length} available):
                      </span>
                      <span className="text-stone-400 text-[11px]">Click to add to disposal</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {otherUploadedGarments.map(g => (
                        <div 
                          key={g.id}
                          className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <GarmentImagePreview garment={g} className="w-12 h-12 rounded-lg shrink-0" />
                            <div className="min-w-0">
                              <h5 className="text-xs font-semibold text-stone-900 truncate">{g.name}</h5>
                              <span className="text-[10px] text-stone-500 block truncate">{g.blendPercentage || g.fabricType}</span>
                              <span className="text-[9px] font-mono text-stone-400">Current: {g.suggestedPathway}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onUpdatePathway?.(g.id, 'Dispose')}
                            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                          >
                            + Dispose
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Switch to scanner
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      Go to Apparel Scanner to Upload Clothes
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* THE LIST OF ITEMS TO DISPOSE */
              <div className="space-y-4">
                
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Listed Garments for Disposal ({disposalList.length})
                  </span>
                  <span className="text-xs text-stone-500">
                    Diverting ~{totalLandfillLiters} Liters of municipal landfill space
                  </span>
                </div>

                <div className="space-y-3.5">
                  {disposalList.map((item, idx) => {
                    const process = getTeamDisposalProcess(item);
                    return (
                      <div 
                        key={item.id}
                        className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                      >
                        {/* Left: Garment Image & Identification */}
                        <div className="flex items-start gap-4 min-w-[240px] max-w-sm">
                          <GarmentImagePreview 
                            garment={item} 
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0" 
                          />

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 uppercase">
                                Item #{idx + 1}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                                {item.condition || "Damaged"}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-stone-900 leading-snug">
                              {item.name}
                            </h4>

                            <div className="text-xs text-stone-600 font-mono font-medium">
                              {item.blendPercentage || item.fabricType || item.fabric}
                            </div>

                            <div className="text-[11px] text-stone-400">
                              {item.brand || "Apparel"} · {item.garmentCategory || "Garment"}
                            </div>
                          </div>
                        </div>

                        {/* Middle: Brief Information on What Owner & Team Will Do */}
                        <div className="flex-1 bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 space-y-2 text-xs w-full lg:w-auto">
                          <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                            <span className="text-[10px] font-mono font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                              <span>⚙️</span> Owner Team Disposal Process (Rough Idea)
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {process.categoryLabel}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[11px] leading-relaxed">
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-stone-700 shrink-0">1. Hardware:</span>
                              <span className="text-stone-600">{process.hardware}</span>
                            </div>

                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-stone-700 shrink-0">2. Sanitization:</span>
                              <span className="text-stone-600">{process.treatment}</span>
                            </div>

                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-stone-700 shrink-0">3. Downcycling:</span>
                              <span className="text-stone-800 font-medium">
                                {process.shredding} → <strong className="text-rose-900">{process.outputProduct}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] text-stone-400 font-mono block">Estimated Mass</span>
                            <span className="text-xs font-mono font-bold text-stone-700">~0.55 kg</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPassportGarment(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                              title="View full textile passport"
                            >
                              Textile Passport
                            </button>

                            {onUpdatePathway && (
                              <button
                                type="button"
                                onClick={() => onUpdatePathway(item.id, 'Recycle')}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 hover:border-rose-200 text-xs font-medium transition-colors cursor-pointer"
                                title="Remove from disposal and move back to Recycle"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Additional selector for remaining uploaded clothes */}
                {otherUploadedGarments.length > 0 && (
                  <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-800">
                          Other Uploaded Clothes in this Batch ({otherUploadedGarments.length})
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Want to dispose more items? Click "+ Add to Disposal" to include them into this pipeline.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {otherUploadedGarments.map(g => (
                        <div 
                          key={g.id}
                          className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <GarmentImagePreview garment={g} className="w-10 h-10 rounded-lg shrink-0" />
                            <div className="min-w-0">
                              <h5 className="text-xs font-semibold text-stone-900 truncate">{g.name}</h5>
                              <span className="text-[10px] text-stone-500 block truncate">{g.blendPercentage || g.fabricType}</span>
                              <span className="text-[9px] font-mono text-stone-400">Path: {g.suggestedPathway}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onUpdatePathway?.(g.id, 'Dispose')}
                            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                          >
                            + Add to Disposal
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="p-6 bg-stone-100 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Ready for the Owner & Operations Team to Collect?
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Schedule a doorstep pickup for these {disposalList.length} items. Our electric van in Wakad will collect them directly.
                    </p>
                  </div>

                  {onNavigateToDelivery && (
                    <button
                      type="button"
                      onClick={() => onNavigateToDelivery('pickup')}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-xs cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-stone-300" />
                      <span>Proceed to Doorstep Pickup</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        );
      })()}

      {/* Textile Passport Modal */}
      {selectedPassportGarment && (
        <TextilePassportModal
          garment={selectedPassportGarment}
          onClose={() => setSelectedPassportGarment(null)}
          onMoveToPathway={(step, id) => {
            handleStepChange(step);
            if (id && onSelectGarmentId) onSelectGarmentId(id);
          }}
          onUpdatePathway={onUpdatePathway}
        />
      )}

    </div>
  );
}
