import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, User, LogOut, 
  MapPin, Sparkles, ShieldCheck, Heart, Tag, Scissors, 
  Recycle, Trash2, Truck, UploadCloud, Layers, Lock, X
} from 'lucide-react';
import { Garment, NGO, UserSession } from './types';
import RegistrationPage from './components/RegistrationPage';
import UploadSection from './components/UploadSection';
import PathwaysDashboard from './components/PathwaysDashboard';
import DeliveryScheduler from './components/DeliveryScheduler';
import { NevoLogo } from './components/NevoLogo';

export default function App() {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4>(1);
  const [navBlockedNotice, setNavBlockedNotice] = useState<string>('');

  // Core application state
  const [garments, setGarments] = useState<Garment[]>([]);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [userSession, setUserSession] = useState<UserSession>({
    isAuthenticated: false,
    user: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // UploadSection states
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; mimeType: string; data: string }[]>([]);
  const [apiIndicator, setApiIndicator] = useState<'idle' | 'calling' | 'success' | 'fallback'>('idle');
  const [errorStatus, setErrorStatus] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [wrongImageError, setWrongImageError] = useState<string | null>(null);

  // Logistics mode pass-through
  const [logisticsMode, setLogisticsMode] = useState<'pickup' | 'buyer'>('pickup');

  // Outcome Pathway targeted step & active garment pass-through
  const [outcomePathwayStep, setOutcomePathwayStep] = useState<'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose'>('donate');
  const [selectedGarmentForPathway, setSelectedGarmentForPathway] = useState<string | null>(null);

  // Directly navigate to an outcome pathway step for a specific garment
  const handleMoveToPathway = (
    step: 'donate' | 'sell' | 'upcycle' | 'recycle' | 'dispose',
    garmentId?: string
  ) => {
    if (garmentId) {
      const pathwayMap: Record<string, Garment['suggestedPathway']> = {
        dispose: 'Dispose',
        recycle: 'Recycle',
        sell: 'Sell',
        donate: 'Donate',
        upcycle: 'Upcycle',
      };
      if (pathwayMap[step]) {
        handleUpdatePathway(garmentId, pathwayMap[step]);
      }
      setSelectedGarmentForPathway(garmentId);
    }
    setOutcomePathwayStep(step);
    setCurrentPage(3);
  };

  // Clear any stale pre-handled session so user is always prompted to Sign In or Sign Up first
  useEffect(() => {
    localStorage.removeItem('circular_fashion_user');
    setUserSession({
      isAuthenticated: false,
      user: null
    });
  }, []);

  // Fetch registered NGOs in Pune
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await fetch("/api/ngos");
        if (res.ok) {
          const list = await res.json();
          setNgos(list);
        }
      } catch (err) {
        console.error("Could not fetch NGO list:", err);
      }
    };
    fetchNGOs();
  }, []);

  // Update a single garment's pathway
  const handleUpdatePathway = (id: string, pathway: Garment['suggestedPathway']) => {
    setGarments(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, suggestedPathway: pathway };
      }
      return item;
    }));
  };

  // Remove a garment
  const handleRemoveGarment = (id: string) => {
    setGarments(prev => prev.filter(item => item.id !== id));
  };

  // Append newly analyzed garments
  const handleAnalysisComplete = (newItems: Garment[]) => {
    setGarments(prev => [...newItems, ...prev]);
  };

  // Intercept navigation to prevent moving to steps 2, 3, or 4 without registration
  const handleNavigateToStep = (targetStep: 1 | 2 | 3 | 4) => {
    if (targetStep === 1) {
      setCurrentPage(1);
      setNavBlockedNotice('');
      return;
    }

    if (!userSession.isAuthenticated) {
      setNavBlockedNotice("Registration required: Please register or sign in with your email & OTP before accessing the Apparel Scanner, Outcome Pathways, or Logistics.");
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setNavBlockedNotice('');
    setCurrentPage(targetStep);
  };

  // Enforce authentication guard: user cannot access steps 2-4 without registration
  useEffect(() => {
    if (!userSession.isAuthenticated && currentPage !== 1) {
      setCurrentPage(1);
      setNavBlockedNotice("Registration required: Please complete registration or sign in to access the Apparel Scanner and circular pathways.");
    }
  }, [userSession.isAuthenticated, currentPage]);

  const navItems = [
    { step: 1, label: "01. Registration" },
    { step: 2, label: "02. Apparel Scanner" },
    { step: 3, label: "03. Outcome Pathway" },
    { step: 4, label: "04. Logistics & Delivery" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Bar Contract (Strict 3-zone architecture) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Identity Logo */}
          <div className="flex items-center">
            <NevoLogo 
              variant="full" 
              size="md" 
              onClick={() => handleNavigateToStep(1)} 
            />
          </div>

          {/* Zone 2: Clean 4 Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            {navItems.map((item) => {
              const isActive = currentPage === item.step;
              const isLocked = item.step > 1 && !userSession.isAuthenticated;
              return (
                <button
                  key={item.step}
                  onClick={() => handleNavigateToStep(item.step)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : isLocked 
                        ? 'text-stone-400 hover:text-stone-600' 
                        : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title={isLocked ? "Complete registration to unlock" : item.label}
                >
                  {isLocked && <Lock className="w-3 h-3 text-stone-400 shrink-0" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Wakad, Pune</span>
            </div>

            {userSession.isAuthenticated && userSession.user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => handleNavigateToStep(1)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer text-xs font-medium text-stone-800"
                  title="View Profile"
                >
                  <User className="w-3.5 h-3.5 text-stone-600" />
                  <span className="max-w-[120px] truncate">{userSession.user.name}</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('circular_fashion_user');
                    setUserSession({ isAuthenticated: false, user: null });
                  }}
                  className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors rounded-lg hover:bg-stone-100"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigateToStep(1)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b border-stone-200 bg-white px-2 py-1.5 overflow-x-auto gap-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.step;
          const isLocked = item.step > 1 && !userSession.isAuthenticated;
          return (
            <button
              key={item.step}
              onClick={() => handleNavigateToStep(item.step)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-stone-900 text-white' 
                  : isLocked 
                    ? 'text-stone-400' 
                    : 'text-stone-600'
              }`}
              title={isLocked ? "Complete registration to unlock" : item.label}
            >
              {isLocked && <Lock className="w-3 h-3 text-stone-400 shrink-0" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
        
        {/* Navigation Blocked Alert Banner */}
        {navBlockedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-900">Registration Required: </span>
                <span className="text-amber-800">{navBlockedNotice}</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setNavBlockedNotice('')}
              className="p-1 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* PAGE 1: REGISTRATION */}
        {currentPage === 1 && (
          <RegistrationPage
            userSession={userSession}
            onSessionChange={setUserSession}
            onProceedToScanner={() => setCurrentPage(2)}
          />
        )}

        {/* PAGE 2: APPAREL SCANNER */}
        {currentPage === 2 && (
          <UploadSection
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            garments={garments}
            onRemoveGarment={handleRemoveGarment}
            onUpdatePathway={handleUpdatePathway}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            apiIndicator={apiIndicator}
            setApiIndicator={setApiIndicator}
            errorStatus={errorStatus}
            setErrorStatus={setErrorStatus}
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
            wrongImageError={wrongImageError}
            setWrongImageError={setWrongImageError}
            onProceedToPathways={() => {
              setOutcomePathwayStep('donate');
              setCurrentPage(3);
            }}
            onMoveToPathway={handleMoveToPathway}
          />
        )}

        {/* PAGE 3: OUTCOME PATHWAY */}
        {currentPage === 3 && (
          <PathwaysDashboard
            garments={garments}
            ngos={ngos}
            userSession={userSession}
            activeStep={outcomePathwayStep}
            onStepChange={setOutcomePathwayStep}
            selectedGarmentId={selectedGarmentForPathway}
            onSelectGarmentId={setSelectedGarmentForPathway}
            onUpdatePathway={handleUpdatePathway}
            onNavigateToDelivery={(mode) => {
              if (mode) setLogisticsMode(mode);
              setCurrentPage(4);
            }}
          />
        )}

        {/* PAGE 4: LOGISTIC AND DELIVERY */}
        {currentPage === 4 && (
          <DeliveryScheduler
            userSession={userSession}
            totalGarmentsCount={garments.length}
            initialMode={logisticsMode}
          />
        )}

        {/* Bottom Page Navigation Controls */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="text-xs text-stone-500 font-mono">
            {currentPage === 1 && "Step 1 of 4 · Account & Contributor Profile"}
            {currentPage === 2 && "Step 2 of 4 · Multi-Apparel Fabric Spectroscopy"}
            {currentPage === 3 && "Step 3 of 4 · Dedicated Circular Solutions & Resale"}
            {currentPage === 4 && "Step 4 of 4 · Seller/Donor Pickup & Buyer Delivery"}
          </div>

          <div className="flex items-center gap-3">
            {currentPage > 1 && (
              <button
                onClick={() => handleNavigateToStep((currentPage - 1) as any)}
                className="px-4 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            )}

            {currentPage < 4 && (
              <button
                onClick={() => handleNavigateToStep((currentPage + 1) as any)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </main>

      {/* Quiet Minimal Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-left">
          <div className="flex items-center gap-2.5">
            <NevoLogo variant="mark" size="sm" />
            <span className="font-bold text-stone-900 tracking-tight">Nevo</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Circular Fashion & Material Diversion Ecosystem</span>
          </div>
          <div className="text-stone-400 font-mono text-[11px]">
            Wakad, Pune Node · 100% Traceable Circular Lifecycle
          </div>
        </div>
      </footer>

    </div>
  );
}
