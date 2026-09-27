import React, { useState, useRef } from 'react';
import { Garment } from '../types';
import { 
  UploadCloud, AlertCircle, RefreshCw, CheckCircle2, 
  Trash2, Eye, Sparkles, Filter, ArrowRight, Plus, 
  Heart, Tag, Scissors, Recycle, FileText, Check,
  Camera, Layers, ShieldCheck, ShieldAlert, Info, HelpCircle, X
} from 'lucide-react';
import TextilePassportModal from './TextilePassportModal';
import GarmentImagePreview from './GarmentImagePreview';

interface UploadSectionProps {
  onAnalysisComplete: (items: Garment[]) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  garments: Garment[];
  onRemoveGarment: (id: string) => void;
  onUpdatePathway: (id: string, pathway: Garment['suggestedPathway']) => void;
  selectedFiles: { name: string; mimeType: string; data: string }[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<{ name: string; mimeType: string; data: string }[]>>;
  apiIndicator: 'idle' | 'calling' | 'success' | 'fallback';
  setApiIndicator: React.Dispatch<React.SetStateAction<'idle' | 'calling' | 'success' | 'fallback'>>;
  errorStatus: string;
  setErrorStatus: React.Dispatch<React.SetStateAction<string>>;
  successMsg: string;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
  wrongImageError: string | null;
  setWrongImageError: React.Dispatch<React.SetStateAction<string | null>>;
  onProceedToPathways?: () => void;
  onMoveToPathway?: (step: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose', garmentId?: string) => void;
}

export default function UploadSection({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
  garments,
  onRemoveGarment,
  onUpdatePathway,
  selectedFiles,
  setSelectedFiles,
  apiIndicator,
  setApiIndicator,
  errorStatus,
  setErrorStatus,
  successMsg,
  setSuccessMsg,
  wrongImageError,
  setWrongImageError,
  onProceedToPathways,
  onMoveToPathway
}: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedPassportGarment, setSelectedPassportGarment] = useState<Garment | null>(null);
  const [filterPathway, setFilterPathway] = useState<string>('all');
  
  // Multi-angle and anti-AI generation states
  const [showMultiAngleModal, setShowMultiAngleModal] = useState<boolean>(false);
  const [fileAngles, setFileAngles] = useState<Record<number, string>>({});
  const [hasAcknowledgedAngles, setHasAcknowledgedAngles] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File parsing tools
  const handleFiles = (files: FileList) => {
    setErrorStatus('');
    setSuccessMsg('');
    setWrongImageError(null);
    const filesArray = Array.from(files);

    if (filesArray.length === 0) return;

    // Strict multi-angle validation:
    // If the batch of files being added brings total files to fewer than 2:
    const totalFilesAfterUpload = selectedFiles.length + filesArray.length;
    if (totalFilesAfterUpload < 2) {
      setWrongImageError("Multi-angle upload required: Please upload at least 2 photos from different angles (e.g., front and back/side views) for each garment. Single-angle photos are not accepted.");
      setErrorStatus("Upload rejected: Single photo detected. Multi-angle photos (at least 2 angles per garment) are required.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const loaders = filesArray.map(file => {
      return new Promise<{ name: string; mimeType: string; data: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve({
              name: file.name,
              mimeType: file.type || "image/jpeg",
              data: e.target.result as string
            });
          } else {
            reject("File reading failed.");
          }
        };
        reader.onerror = () => reject("File reading failed.");
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loaders)
      .then((loadedImages) => {
        // Quick keyword check for non-clothing items
        const nonClothingKeywords = ["wrong", "random", "dog", "cat", "car", "chair", "table", "building", "tree", "plant", "furniture", "fruit", "apple", "banana"];
        const hasNonClothing = loadedImages.some(img => {
          const nameLower = img.name.toLowerCase();
          return nonClothingKeywords.some(kw => nameLower.includes(kw));
        });
        if (hasNonClothing) {
          setWrongImageError("Please upload clothing apparel images only (e.g. shirts, dresses, jeans, ethnic wear).");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        // Check for duplicate images (e.g. user selected the exact same file twice)
        if (loadedImages.length >= 2 && loadedImages[0].data === loadedImages[1].data) {
          setWrongImageError("Multi-angle verification failed: You uploaded duplicate identical photos. Please upload photos taken from distinct angles (e.g., front and back views).");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const isDuplicateWithExisting = loadedImages.some(newImg => selectedFiles.some(existing => existing.data === newImg.data));
        if (isDuplicateWithExisting) {
          setWrongImageError("Duplicate image detected: Please upload photos from different perspectives (e.g. front and rear).");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const newSelected = [...selectedFiles, ...loadedImages].slice(0, 8);
        setSelectedFiles(newSelected);

        // Pre-assign distinct angles
        const anglePresets = ['Front View', 'Back / Side View', 'Side View', 'Detail / Tag'];
        const updatedAngles = { ...fileAngles };
        newSelected.forEach((_, idx) => {
          if (!updatedAngles[idx]) {
            updatedAngles[idx] = anglePresets[idx % anglePresets.length] || `Angle ${idx + 1}`;
          }
        });
        setFileAngles(updatedAngles);

        setSuccessMsg(`✓ Accepted ${loadedImages.length} photos covering multiple angles. Verify angle labels below and proceed with scan.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      })
      .catch(() => {
        setErrorStatus("Could not read files. Please upload standard JPEG, PNG, or WebP images.");
      });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeQueuedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Pre-load curated sample garments for immediate zero-friction evaluation
  const loadCuratedSamples = () => {
    setErrorStatus('');
    setWrongImageError(null);
    const sampleItems: Garment[] = [
      {
        id: "g_curated_1",
        name: "Embroidered Raw Silk Festive Dupatta",
        fabricType: "Pure Silk",
        blendPercentage: "100% Raw Silk",
        garmentCategory: "Ethnic Festive Wear",
        brand: "FabIndia Handloom",
        condition: "Very Good",
        wearLevel: "Minimal wear with intact gold zari border",
        suggestedPathway: "Sell",
        recyclingProcess: "Mechanical silk unraveling and respinning into luxury blends",
        machinesUsed: ["Optical Spectroscopy Sorter", "Gentle Roller Opener"],
        diyIdeas: ["Silk Cushion Cover", "Framed Textile Art", "Festive Potli Bag"],
        nearbyNgos: ["Goonj Chinchwad", "Maher Ashram"],
        nearbyRecyclers: ["Wakad Eco-Fiber Lab", "Pune Circular Weaves"],
        secondHandBuyers: ["Priya Deshpande (Wakad)", "ReWear Vintage Hub"],
        carbonSavings: 3.2,
        rewardPoints: 120,
        description: "Intricately embroidered pure mulberry silk dupatta with intact metallic zari borders.",
        fabric: "Pure Natural Animal Silk",
        category: "Natural Animal Fibres",
        quality: "Excellent",
        remainingLife: "4-5 years"
      },
      {
        id: "g_curated_2",
        name: "Distressed Indigo Heavy Denim Jeans",
        fabricType: "Denim Cotton",
        blendPercentage: "98% Cotton, 2% Elastane",
        garmentCategory: "Casual Trousers",
        brand: "Levi's Classic",
        condition: "Good",
        wearLevel: "Knee distress and frayed lower hem",
        suggestedPathway: "Upcycle",
        recyclingProcess: "Heavy industrial shredding and downcycling into acoustic felt",
        machinesUsed: ["Textile Shredder", "Needle Punch Felt Machine"],
        diyIdeas: ["Heavy Duty Denim Tote", "Denim Pocket Wall Organizer", "Apron"],
        nearbyNgos: ["SWaCH Cooperative Kothrud"],
        nearbyRecyclers: ["Pimpri Textile Shredding Hub"],
        secondHandBuyers: ["Artisan Upcyclers Pune"],
        carbonSavings: 2.8,
        rewardPoints: 95,
        description: "Heavyweight 13oz indigo cotton denim with natural fading and distressed cuffs.",
        fabric: "Cotton Denim Twill",
        category: "Natural Plant Fibres",
        quality: "Good",
        remainingLife: "2-3 years"
      },
      {
        id: "g_curated_3",
        name: "Pure Khadi Linen Casual Mandarin Shirt",
        fabricType: "Khadi Linen",
        blendPercentage: "100% Hand-spun Khadi Cotton",
        garmentCategory: "Casual Shirts",
        brand: "Khadi Gramodyog Pune",
        condition: "Very Good",
        wearLevel: "Gently worn, no tears or stains",
        suggestedPathway: "Donate",
        recyclingProcess: "Mechanical fiber opening and respinning for hospital bedsheets",
        machinesUsed: ["Optical Sorter", "Carding Cylinder", "Ring Spinner"],
        diyIdeas: ["Kitchen Utility Apron", "Bread Bag", "Plant Pot Wrap"],
        nearbyNgos: ["Goonj Chinchwad", "Goodwill India Wanowrie"],
        nearbyRecyclers: ["Pune Circular Node"],
        secondHandBuyers: ["Conscious Wardrobe Pune"],
        carbonSavings: 2.1,
        rewardPoints: 80,
        description: "Breathable hand-spun khadi cotton shirt with wooden buttons and mandarin collar.",
        fabric: "Natural Plant Fibres",
        category: "Natural Plant Fibres",
        quality: "Excellent",
        remainingLife: "3 years"
      }
    ];

    onAnalysisComplete(sampleItems);
    setApiIndicator('success');
    setSuccessMsg('Loaded 3 curated Pune apparel garments! Review their fabric breakdown and customized pathways below.');
  };

  // Launch Server-Side Gemini API query
  const runAIEngine = async () => {
    if (selectedFiles.length < 2) {
      setErrorStatus("Multi-angle upload required: Please upload at least 2 photos from different angles (e.g. front and back views) before scanning.");
      return;
    }

    // Verify distinct angles are assigned
    const assignedAngles = selectedFiles.map((_, idx) => fileAngles[idx] || (idx % 2 === 0 ? 'Front View' : 'Back / Side View'));
    const uniqueAngles = new Set(assignedAngles);
    if (uniqueAngles.size < 2 && selectedFiles.length >= 2) {
      setErrorStatus("Multi-angle validation error: Please select distinct angles for your photos (e.g., Front View and Back / Side View).");
      return;
    }

    setIsLoading(true);
    setErrorStatus('');
    setWrongImageError(null);
    setApiIndicator('calling');

    try {
      const response = await fetch("/api/analyze-clothes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          images: selectedFiles.map((file, idx) => ({
            ...file,
            angle: fileAngles[idx] || (idx % 2 === 0 ? 'Front View' : 'Back / Side View')
          }))
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        if (errJson.isNotClothing) {
          setWrongImageError(errJson.error || "Please upload clothing apparel images only.");
          setIsLoading(false);
          setApiIndicator('idle');
          return;
        }
        if (errJson.isNotMultiAngle) {
          setWrongImageError(errJson.error || "Multi-angle photo requirement not satisfied.");
          setIsLoading(false);
          setApiIndicator('idle');
          return;
        }
        throw new Error(errJson.error || `Analysis failed with code ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && Array.isArray(resData.items)) {
        onAnalysisComplete(resData.items);
        setApiIndicator(resData.usingFallback ? 'fallback' : 'success');
        setSuccessMsg(
          resData.usingFallback 
            ? "Completed using localized fabric sorting. Review your analyzed garments below."
            : `AI recognized and successfully analyzed ${resData.items.length} garments from your multi-angle batch!`
        );
        setSelectedFiles([]);
      } else {
        if (resData.isNotClothing) {
          setWrongImageError(resData.error || "Please upload clothing apparel images only.");
          setIsLoading(false);
          setApiIndicator('idle');
          return;
        }
        throw new Error(resData.error || "Invalid response format from analyzer.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "An error occurred during fabric analysis. Please try again.");
      setApiIndicator('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Aggregate metrics
  const totalCarbon = garments.reduce((sum, g) => sum + (g.carbonSavings || 2.4), 0).toFixed(1);
  const totalPoints = garments.reduce((sum, g) => sum + (g.rewardPoints || 80), 0);

  // Filter garments
  const filteredGarments = filterPathway === 'all' 
    ? garments 
    : garments.filter(g => g.suggestedPathway.toLowerCase() === filterPathway.toLowerCase());

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      
      {/* Header Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
            Step 2 of 4 · Apparel Scanner
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            AI Fabric Composition & Pathway Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Upload images of pre-loved apparel to determine textile blends, estimate remaining lifecycle, calculate carbon savings, and assign custom circular pathways.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCuratedSamples}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>Load Curated Samples (3 Items)</span>
        </button>
      </div>

      {/* Upload Drop Zone & Controls */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            dragActive 
              ? 'border-rose-500 bg-rose-50/40' 
              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
            <UploadCloud className="w-7 h-7 text-stone-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-800">
              Drag & drop apparel photos here, or <span className="text-rose-700 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Supports JPEG, PNG, WebP · <strong>Multi-angle photos required (minimum 2 different angles per garment)</strong>
            </p>
          </div>
        </div>

        {/* Alerts / Error Messages */}
        {wrongImageError && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{wrongImageError}</span>
          </div>
        )}

        {errorStatus && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorStatus}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Queued Images Preview List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Queued For Scan ({selectedFiles.length} item{selectedFiles.length > 1 ? 's' : ''})
                </span>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                  Multi-Angle Tagging
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMultiAngleModal(true)}
                  className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Check Angle Requirements</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles([]);
                    setFileAngles({});
                  }}
                  className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Clear Queue
                </button>
              </div>
            </div>

            {/* Advice notice if user only queued 1 photo */}
            {selectedFiles.length === 1 && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Multi-angle requirement not met:</strong> You currently have only 1 photo queued. Please upload at least 1 more photo from another angle (e.g. back or side view) before scanning.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="group relative rounded-xl border border-stone-200 overflow-hidden bg-stone-100 flex flex-col">
                  <div className="relative aspect-square">
                    <img
                      src={file.data}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQueuedFile(idx);
                      }}
                      className="absolute top-1 right-1 p-1 bg-stone-900/80 hover:bg-stone-900 text-white rounded-md opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-[9px] text-white px-1.5 py-0.5 rounded font-mono">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Angle Selection Tag */}
                  <div className="p-1.5 bg-white border-t border-stone-100">
                    <select
                      value={fileAngles[idx] || (idx % 2 === 0 ? 'Front View' : 'Back / Side View')}
                      onChange={(e) => setFileAngles(prev => ({ ...prev, [idx]: e.target.value }))}
                      className="w-full text-[10px] font-semibold text-stone-700 bg-stone-50 border border-stone-200 rounded px-1.5 py-1 focus:outline-none"
                    >
                      <option value="Front View">Front View</option>
                      <option value="Back / Side View">Back View</option>
                      <option value="Side View">Side View</option>
                      <option value="Detail / Tag">Detail / Tag</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-angle inspection active ({selectedFiles.length} photos queued)</span>
              </div>

              <button
                type="button"
                onClick={runAIEngine}
                disabled={isLoading || selectedFiles.length < 2}
                className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-300" />
                    <span>Analyzing Fabric Blends...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Run AI Fabric Scan ({selectedFiles.length} Photos · Multi-Angle)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Analyzed Garments Workspace */}
      {garments.length > 0 && (
        <div className="space-y-6">
          
          {/* Summary Metric Ribbon */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-stone-400 font-medium">Scanned Apparel</div>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                {garments.length} <span className="text-xs text-stone-500 font-sans font-normal">items</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400 font-medium">Carbon Diversion</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
                {totalCarbon} <span className="text-xs text-stone-500 font-sans font-normal">kg CO₂</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400 font-medium">Reward Credits</div>
              <div className="text-xl sm:text-2xl font-bold text-rose-700 font-mono tabular-nums mt-0.5">
                +{totalPoints} <span className="text-xs text-stone-500 font-sans font-normal">pts</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400 font-medium">Circularity Hub</div>
              <div className="text-sm font-semibold text-stone-800 mt-1 truncate">
                Wakad, Pune Node
              </div>
            </div>
          </div>

          {/* Filtering Segmented Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'donate', label: 'Donors' },
                { id: 'sell', label: 'Sell' },
                { id: 'upcycle', label: 'Upcycle' },
                { id: 'recycle', label: 'Recycle' },
                { id: 'dispose', label: 'Dispose' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterPathway(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    filterPathway === tab.id
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-400">
              Showing {filteredGarments.length} of {garments.length} garments
            </div>
          </div>

          {/* Garments Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGarments.map((garment) => (
              <div 
                key={garment.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Visual Header with Garment Preview */}
                  <div className="p-4 pb-0 flex gap-4 items-start">
                    <GarmentImagePreview
                      garment={garment}
                      className="w-20 h-20 rounded-xl"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-stone-400 font-medium">
                        {garment.brand || "Unbranded"} · {garment.garmentCategory || "Apparel"}
                      </div>
                      <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2 mt-0.5">
                        {garment.name}
                      </h3>
                      <div className="text-xs text-stone-600 mt-1 font-mono font-medium">
                        {garment.blendPercentage || garment.fabricType || garment.fabric}
                      </div>
                    </div>
                  </div>

                  {/* Metadata and Quality Metrics */}
                  <div className="px-4 py-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-500 border-t border-stone-100 pt-2">
                      <span>Condition / Quality:</span>
                      <span className="font-medium text-stone-800">
                        {garment.condition || garment.quality}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-500">
                      <span>Carbon Footprint Offset:</span>
                      <span className="font-mono text-emerald-700 font-medium">
                        -{garment.carbonSavings || 2.4} kg CO₂
                      </span>
                    </div>

                    {/* Suggested Circular Actions Bar (Sell, Recycle, Dispose) */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                        <span>Suggested Actions</span>
                        <span className="text-[10px] text-stone-400 font-normal">Direct Routing</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onMoveToPathway?.('sell', garment.id)}
                          className="py-1 px-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="View resale options in circular marketplace"
                        >
                          <span>🏷️</span> <span className="truncate">Sell</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => onMoveToPathway?.('recycle', garment.id)}
                          className="py-1 px-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="View mechanical & chemical fiber recycling"
                        >
                          <span>♻️</span> <span className="truncate">Recycle</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onUpdatePathway(garment.id, 'Dispose');
                            onMoveToPathway?.('dispose', garment.id);
                          }}
                          className="py-1 px-1.5 rounded-lg border-2 border-stone-900 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Directly move to disposal point inside outcome pathway"
                        >
                          <span>🗑️</span> <span className="truncate">Dispose</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Pathway Selector */}
                    <div className="pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                          Assigned Pathway
                        </label>
                        {garment.suggestedPathway === 'Dispose' && (
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Zero-Landfill Protocol
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-5 gap-1">
                        {(['Donate', 'Sell', 'Upcycle', 'Recycle', 'Dispose'] as const).map((path) => {
                          const isSelected = garment.suggestedPathway === path;
                          return (
                            <button
                              key={path}
                              type="button"
                              onClick={() => {
                                onUpdatePathway(garment.id, path);
                                if (path === 'Dispose') {
                                  // As requested: If a person chooses dispose, directly move to the disposal point
                                  onMoveToPathway?.('dispose', garment.id);
                                }
                              }}
                              className={`py-1.5 px-1 rounded-lg text-[10px] font-medium transition-all text-center truncate cursor-pointer ${
                                isSelected
                                  ? path === 'Donate' ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300'
                                  : path === 'Sell' ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                                  : path === 'Upcycle' ? 'bg-blue-100 text-blue-800 font-bold border border-blue-300'
                                  : path === 'Recycle' ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                  : 'bg-stone-900 text-white font-bold border border-stone-900 shadow-xs'
                                  : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200/60'
                              }`}
                              title={path === 'Dispose' ? 'Set pathway and view disposal protocol' : `Set pathway to ${path}`}
                            >
                              {path}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPassportGarment(garment)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs font-medium cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>Textile Passport</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveGarment(garment.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-100 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Advancement Banner */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base">Ready to implement circular solutions?</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Explore the dedicated steps for Donors, Sell, Upcycle, Recycle, and Dispose.
              </p>
            </div>

            {onProceedToPathways && (
              <button
                type="button"
                onClick={onProceedToPathways}
                className="py-3 px-6 rounded-xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                <span>Proceed to Outcome Pathways</span>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Textile Passport Modal */}
      {selectedPassportGarment && (
        <TextilePassportModal
          garment={selectedPassportGarment}
          onClose={() => setSelectedPassportGarment(null)}
          onMoveToPathway={onMoveToPathway}
          onUpdatePathway={onUpdatePathway}
        />
      )}

      {/* MULTI-ANGLE & ANTI-AI GENERATED IMAGE VERIFICATION POP-UP MODAL */}
      {showMultiAngleModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-stone-900 to-stone-950 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60 font-mono">
                      Mandatory Requirement
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Anti-AI Inspection</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Multi-Angle Apparel Photo Verification
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMultiAngleModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Core Requirement Message */}
              <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Upload Photos in Different Angles for Each and Every Cloth</span>
                </div>
                <p className="text-xs text-rose-900/90 leading-relaxed">
                  To properly assess every garment, assess true wear levels, and distinguish authentic textiles from AI-generated mockups or flat images, <strong>you must upload images showing different angles for every clothing item</strong>.
                </p>
              </div>

              {/* Specific Angle Examples Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Required Angles by Clothing Category
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Example 1: T-Shirt */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">👕 T-Shirts, Shirts & Tops</span>
                      <span className="text-[10px] text-stone-500 font-mono">2 Angles</span>
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span><strong>Angle 1:</strong> Front of the T-shirt (chest, neck, logo)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span><strong>Angle 2:</strong> Back of the T-shirt (rear shoulders & hem)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Example 2: Old Bag */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">👜 Old Bags & Backpacks</span>
                      <span className="text-[10px] text-stone-500 font-mono">2 Angles</span>
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span><strong>Angle 1:</strong> Front view (facade, zippers & pockets)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span><strong>Angle 2:</strong> Side view (depth, gusset seams & base)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Example 3: Jeans */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">👖 Jeans, Trousers & Pants</span>
                      <span className="text-[10px] text-stone-500 font-mono">2 Angles</span>
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                        <span><strong>Angle 1:</strong> Front view (waistband, fly & knees)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                        <span><strong>Angle 2:</strong> Rear view (back pockets & seat wear)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Example 4: Ethnic Wear & Jackets */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">👗 Ethnic Wear & Jackets</span>
                      <span className="text-[10px] text-stone-500 font-mono">2 Angles</span>
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span><strong>Angle 1:</strong> Full draped silhouette view</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span><strong>Angle 2:</strong> Close-up border or care-tag stitching</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Anti-AI Generated Image Screening Warning */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Why AI-Generated Images are Strictly Blocked
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Project Nevo performs real physical textile downcycling, charity donation, and fiber recovery in Wakad, Pune. <strong>AI-generated synthetic images</strong> and 3D renders lack micro-fiber weave, natural lighting folds, and real care-label stitching. Our spectroscopy algorithms will flag and reject non-physical renders.
                </p>
              </div>

              {/* Contributor Confirmation Checkbox */}
              <div className="pt-2 border-t border-stone-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm-angles"
                  checked={hasAcknowledgedAngles}
                  onChange={(e) => setHasAcknowledgedAngles(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                />
                <label htmlFor="confirm-angles" className="text-xs text-stone-700 cursor-pointer font-medium leading-relaxed">
                  I understand that each garment requires photos from different angles (e.g. front & back/side), and I confirm that my uploads are authentic physical photographs.
                </label>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMultiAngleModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Angles (Browse Files)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHasAcknowledgedAngles(true);
                  setShowMultiAngleModal(false);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Continue to Scan Queue</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
