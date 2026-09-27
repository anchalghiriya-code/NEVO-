import React, { useState } from 'react';
import { NGO } from '../types';
import { MapPin, Building, Phone, Mail, Navigation, Info, ExternalLink } from 'lucide-react';

interface NGOMapProps {
  ngos: NGO[];
  selectedNgo: NGO | null;
  onSelectNgo: (ngo: NGO) => void;
}

export default function NGOMap({ ngos, selectedNgo, onSelectNgo }: NGOMapProps) {
  // Wakad, Pune center query
  const defaultMapQuery = "Wakad, Pune, Maharashtra, India";

  // Build the Google Maps Embed URL dynamically
  const getMapUrl = () => {
    if (selectedNgo) {
      // Use both name and address to get high accuracy pin on the real Google Map
      const query = `${selectedNgo.name}, ${selectedNgo.address}`;
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(defaultMapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="NGO-tracking-workspace">
      {/* NGO List panel */}
      <div className="lg:col-span-2 space-y-3 max-h-[450px] overflow-y-auto pr-1">
        <div className="flex items-center justify-between mb-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Verified Recycling Partners (Pune)</span>
          </div>
          {selectedNgo && (
            <button 
              onClick={() => {
                // Clear selection by passing back first NGO or handling reset
                if (ngos.length > 0) {
                  // Simply clear
                  (onSelectNgo as any)(null);
                }
              }}
              className="text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg bg-white cursor-pointer transition"
            >
              Reset view
            </button>
          )}
        </div>

        {ngos.map((ngo) => {
          const isSelected = selectedNgo && selectedNgo.id === ngo.id;
          return (
            <div
              key={ngo.id}
              onClick={() => onSelectNgo(ngo)}
              className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                isSelected 
                  ? 'bg-slate-900 border-slate-950 text-white shadow-md shadow-slate-900/10' 
                  : 'bg-white hover:bg-slate-50/55 text-slate-800 border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 border ${isSelected ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                  <Building className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0 flex-grow">
                  <h4 className={`font-display font-extrabold text-sm uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {ngo.name}
                  </h4>
                  <p className={`text-xs font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'} leading-relaxed`}>
                    <MapPin className="w-3.5 h-3.5 inline mr-1 shrink-0 -mt-0.5 text-emerald-500" />
                    {ngo.address}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {ngo.needs.map((need, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[9px] px-2 py-0.5 rounded-lg font-mono font-bold border uppercase ${
                          isSelected ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
                        {need}
                      </span>
                    ))}
                  </div>

                  {/* Representative & Contact Details */}
                  <div className={`mt-3 pt-3 border-t text-[11px] space-y-1 ${isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-650 font-semibold'}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold shrink-0 uppercase tracking-tight text-[10px] text-slate-400">Representative:</span>
                      <span className={isSelected ? 'text-emerald-300 font-bold' : 'text-slate-800'}>{ngo.contact}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="font-mono">{ngo.phone}</span>
                    </div>
                    {ngo.email && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate font-mono">{ngo.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Google Map Canvas */}
      <div className="lg:col-span-3 flex flex-col h-[400px] lg:h-[450px] relative">
        <div className="w-full h-full rounded-2xl bg-slate-50 border border-slate-150 shadow-md overflow-hidden relative">
          <iframe
            title="Google Map"
            src={getMapUrl()}
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
          ></iframe>
        </div>

        {selectedNgo && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-xl z-10 flex flex-col gap-1 text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-grow font-semibold">
                <div className="w-1.5 h-8 bg-emerald-600 rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-xs text-slate-900 font-display uppercase tracking-tight truncate">{selectedNgo.name}</h5>
                  <p className="text-[10px] text-slate-500 truncate">{selectedNgo.address}</p>
                </div>
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&origin=Wakad,Pune&destination=${encodeURIComponent(selectedNgo.name + ", " + selectedNgo.address)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-1 hover:scale-102 cursor-pointer shrink-0"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            </div>
          </div>
        )}

        {!selectedNgo && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-100 shadow-lg z-10 flex items-center gap-2 text-left">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[10px] text-slate-650 font-semibold leading-normal">
              Select any verified NGO from the list to center the Google Map and get direct collection details.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
