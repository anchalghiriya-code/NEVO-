import React, { useState, useEffect } from 'react';
import { CollectionSchedule, UserSession, BuyerOrder } from '../types';
import { 
  Truck, Calendar, Clock, MapPin, Phone, User, CheckCircle2, 
  Package, ShoppingBag, ShieldCheck, ArrowRight, Copy, Check, 
  Send, AlertCircle, RefreshCw, ChevronRight, Navigation
} from 'lucide-react';
import GarmentImagePreview from './GarmentImagePreview';

interface DeliveryProps {
  userSession: UserSession;
  totalGarmentsCount: number;
  initialMode?: 'pickup' | 'buyer';
  onScheduleCreated?: () => void;
}

export default function DeliveryScheduler({
  userSession,
  totalGarmentsCount,
  initialMode = 'pickup',
  onScheduleCreated
}: DeliveryProps) {
  // Mode switcher: Part 1 (Seller/Donor Pickup) vs Part 2 (Buyer Doorstep Delivery)
  const [activeMode, setActiveMode] = useState<'pickup' | 'buyer'>(initialMode);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
    }
  }, [initialMode]);

  // ==========================================
  // PART 1: SELLER / DONOR PICKUP STATE
  // ==========================================
  const [name, setName] = useState(userSession.user?.name || 'Anchal Ghiriya');
  const [contact, setContact] = useState(userSession.user?.contact || '+91 91580 98765');
  const [address, setAddress] = useState(userSession.user?.address || 'Apartment 402, Kaspate Wasti, Wakad, Pune, 411057');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  
  const [localSchedules, setLocalSchedules] = useState<CollectionSchedule[]>([]);
  const [isSubmittingPickup, setIsSubmittingPickup] = useState(false);
  const [pickupErrorText, setPickupErrorText] = useState('');
  const [pickupSuccessText, setPickupSuccessText] = useState('');

  // ==========================================
  // PART 2: BUYER DOORSTEP DELIVERY STATE
  // ==========================================
  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  
  // Receiver customized delivery slot state
  const [receiverName, setReceiverName] = useState('');
  const [receiverContact, setReceiverContact] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverDate, setReceiverDate] = useState('');
  const [receiverSlot, setReceiverSlot] = useState('Evening (06:00 PM - 09:00 PM)');
  const [receiverInstructions, setReceiverInstructions] = useState('');
  
  const [isUpdatingSlot, setIsUpdatingSlot] = useState(false);
  const [buyerSlotSuccessMsg, setBuyerSlotSuccessMsg] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Auto-populate user details when session updates
  useEffect(() => {
    if (userSession.isAuthenticated && userSession.user) {
      setName(userSession.user.name || '');
      setContact(userSession.user.contact || '');
      setAddress(userSession.user.address || '');

      if (!receiverName) setReceiverName(userSession.user.name || 'Priya Deshpande');
      if (!receiverContact) setReceiverContact(userSession.user.contact || '+91 98220 44512');
      if (!receiverAddress) setReceiverAddress(userSession.user.address || 'Flat 502, Blue Ridge Tower B, Hinjawadi Phase 1, Pune, 411057');
    }
  }, [userSession]);

  // Fetch Pickup Schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      if (response.ok) {
        const data = await response.json();
        setLocalSchedules(data);
      }
    } catch (e) {
      console.error("Could not fetch schedules:", e);
    }
  };

  // Fetch Buyer Orders
  const fetchBuyerOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch("/api/buyer-orders");
      if (response.ok) {
        const data: BuyerOrder[] = await response.json();
        setBuyerOrders(data);
        if (data.length > 0 && !selectedOrderId) {
          setSelectedOrderId(data[0].id);
          syncSelectedOrderForm(data[0]);
        }
      }
    } catch (e) {
      console.error("Could not fetch buyer orders:", e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchBuyerOrders();
  }, []);

  const syncSelectedOrderForm = (order: BuyerOrder) => {
    setReceiverName(order.buyerName || userSession.user?.name || 'Receiver');
    setReceiverContact(order.buyerContact || userSession.user?.contact || '+91 98220 44512');
    setReceiverAddress(order.buyerAddress || userSession.user?.address || 'Wakad, Pune');
    setReceiverDate(order.receiverPreferredDate || order.estimatedArrival || new Date().toISOString().split('T')[0]);
    setReceiverSlot(order.receiverPreferredSlot || 'Evening (06:00 PM - 09:00 PM)');
    setReceiverInstructions(order.specialInstructions || 'Please ring bell upon arrival.');
    setBuyerSlotSuccessMsg('');
  };

  const handleSelectOrder = (order: BuyerOrder) => {
    setSelectedOrderId(order.id);
    syncSelectedOrderForm(order);
  };

  const selectedOrder = buyerOrders.find(o => o.id === selectedOrderId) || buyerOrders[0] || null;

  // Handle Pickup Form Submit
  const handlePickupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPickupErrorText('');
    setPickupSuccessText('');

    if (!name || !contact || !address) {
      setPickupErrorText("Please fill in your name, contact phone, and pickup address.");
      return;
    }

    setIsSubmittingPickup(true);

    try {
      const response = await fetch("/api/schedule-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          address,
          date,
          timeSlot
        }),
      });

      if (response.ok) {
        const newSched = await response.json();
        setLocalSchedules(prev => [newSched, ...prev]);
        setPickupSuccessText(`Pickup scheduled successfully! Driver ${newSched.driverName || 'Rahul Kumar'} has been assigned.`);
        if (onScheduleCreated) onScheduleCreated();
      } else {
        const err = await response.json().catch(() => ({}));
        setPickupErrorText(err.error || "Failed to schedule collection.");
      }
    } catch (e: any) {
      setPickupErrorText("Network error scheduling pickup. Please retry.");
    } finally {
      setIsSubmittingPickup(false);
    }
  };

  // Handle Receiver Slot Update
  const handleUpdateReceiverSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdatingSlot(true);
    setBuyerSlotSuccessMsg('');

    try {
      const response = await fetch(`/api/buyer-orders/${selectedOrder.id}/update-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverPreferredDate: receiverDate,
          receiverPreferredSlot: receiverSlot,
          buyerAddress: receiverAddress,
          buyerContact: receiverContact,
          specialInstructions: receiverInstructions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBuyerOrders(prev => prev.map(o => o.id === selectedOrder.id ? data.order : o));
        setBuyerSlotSuccessMsg("Receiver delivery preferences updated! Delivery partner notified of your convenient time slot.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingSlot(false);
    }
  };

  const copyTrackingId = (tid: string) => {
    navigator.clipboard?.writeText(tid);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      
      {/* Header and Two-Part Switcher */}
      <div className="space-y-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
            Step 4 of 4 · Logistics & Delivery
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Wakad Circular Logistics Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Two-part dedicated logistics system: schedule seller & donor pickups, or track buyer orders and customize delivery slots.
          </p>
        </div>

        {/* 2-Part Mode Switcher */}
        <div className="flex p-1 bg-stone-100 rounded-2xl w-full sm:w-fit">
          <button
            onClick={() => setActiveMode('pickup')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'pickup'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Part 1: Seller & Donor Pickup</span>
          </button>

          <button
            onClick={() => setActiveMode('buyer')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'buyer'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-rose-600" />
            <span>Part 2: Buyer Doorstep Delivery</span>
            {buyerOrders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono">
                {buyerOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PART 1: SELLER AND DONOR PICKUP SCHEDULER */}
      {/* ======================================================== */}
      {activeMode === 'pickup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Pickup Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Doorstep Collection Booking</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                Schedule Seller & Donor Pickup
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Our clean electric collection vans collect pre-loved clothes directly from your door in Wakad and Hinjawadi.
              </p>
            </div>

            {pickupErrorText && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{pickupErrorText}</span>
              </div>
            )}

            {pickupSuccessText && (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{pickupSuccessText}</span>
              </div>
            )}

            <form onSubmit={handlePickupSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Donor / Seller Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+91 91580 98765"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Pickup Address (Wakad / Pune)</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, building, landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Preferred Pickup Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Convenient Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 bg-white"
                  >
                    <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                    <option value="06:00 PM - 08:30 PM">Evening (06:00 PM - 08:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Garment summary badge */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-500">Clothing Batch Size:</span>
                <span className="font-semibold text-stone-800">
                  {totalGarmentsCount > 0 ? `${totalGarmentsCount} Scanned Garment(s)` : 'Standard Bag (3-5 items)'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingPickup}
                className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>{isSubmittingPickup ? 'Assigning Courier...' : 'Confirm Doorstep Collection'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Active Driver & Pickup Telemetry */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Driver Card */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 space-y-5 border border-stone-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Assigned Wakad Courier
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active En Route
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-white">
                  RK
                </div>
                <div>
                  <div className="text-base font-bold text-white">Rahul Kumar</div>
                  <div className="text-xs text-stone-400 font-mono">+91 98881 22334</div>
                  <div className="text-xs text-emerald-400 mt-0.5">Electric Van · MH 14 EV 4402</div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Pickup Status Journey
                </span>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[
                    { label: 'Booked', done: true },
                    { label: 'Assigned', done: true },
                    { label: 'En Route', done: true },
                    { label: 'Collected', done: false }
                  ].map((st, i) => (
                    <div key={i} className="space-y-1">
                      <div className={`h-1.5 rounded-full ${st.done ? 'bg-emerald-400' : 'bg-stone-700'}`} />
                      <span className={`text-[10px] ${st.done ? 'text-white font-medium' : 'text-stone-500'}`}>
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduled History */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Recent Scheduled Pickups ({localSchedules.length})
              </h3>

              {localSchedules.length === 0 ? (
                <p className="text-xs text-stone-500">
                  No pickups scheduled yet. Book your first collection on the left!
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {localSchedules.map((s, i) => (
                    <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">{s.date}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-stone-600 font-mono text-[11px]">{s.timeSlot}</div>
                      <div className="text-stone-500 truncate">{s.address}</div>
                      {s.driverName && (
                        <div className="text-[11px] text-stone-700 pt-1 border-t border-stone-200/50">
                          Driver: {s.driverName} ({s.driverPhone})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* PART 2: BUYER DOORSTEP DELIVERY & RECEIVER SLOT SCHEDULER */}
      {/* ======================================================== */}
      {activeMode === 'buyer' && (
        <div className="space-y-8">
          
          {/* Order Selection Tabs */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Select Dispatched Buyer Order to Track & Set Preferred Delivery Time:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {buyerOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedOrderId === order.id
                      ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-700'
                  }`}
                >
                  <GarmentImagePreview
                    itemTitle={order.itemTitle}
                    itemCategory={order.itemCategory}
                    itemFabric={order.itemFabric}
                    imageUrl={order.imageUrl}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">{order.itemTitle}</div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      {order.orderNumber} · ₹{order.price}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Order Confirmation & Delivery Partner Telemetry */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Order Confirmation Card */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-wider">
                        Verified Order Confirmation
                      </span>
                      <h2 className="text-lg font-bold text-stone-900 mt-0.5">
                        {selectedOrder.itemTitle}
                      </h2>
                      <div className="text-xs text-stone-500 font-mono mt-0.5">
                        Order #{selectedOrder.orderNumber}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-stone-900 font-mono">
                        ₹{selectedOrder.price}
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-4">
                    <GarmentImagePreview
                      itemTitle={selectedOrder.itemTitle}
                      itemCategory={selectedOrder.itemCategory}
                      itemFabric={selectedOrder.itemFabric}
                      imageUrl={selectedOrder.imageUrl}
                      className="w-16 h-16 rounded-xl"
                    />
                    <div className="text-xs space-y-1">
                      <div><strong className="text-stone-800">Fabric Blend:</strong> {selectedOrder.itemFabric}</div>
                      <div><strong className="text-stone-800">Seller Origin:</strong> {selectedOrder.sellerName} ({selectedOrder.sellerCity})</div>
                      <div><strong className="text-stone-800">Estimated Arrival:</strong> {selectedOrder.estimatedArrival}</div>
                    </div>
                  </div>

                  {/* Delivery Journey Stepper */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Live Delivery Progress
                    </span>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {[
                        { label: 'Placed', done: true },
                        { label: 'Dispatched', done: true },
                        { label: 'In Transit', done: selectedOrder.status !== 'Order Placed' },
                        { label: 'Out for Delivery', done: selectedOrder.status === 'Out for Delivery' || selectedOrder.status === 'Delivered' },
                        { label: 'Delivered', done: selectedOrder.status === 'Delivered' }
                      ].map((s, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className={`h-1.5 rounded-full ${s.done ? 'bg-emerald-500' : 'bg-stone-200'}`} />
                          <span className={`text-[10px] ${s.done ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Partner Details */}
                <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 space-y-5 border border-stone-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                      Assigned Courier Partner
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-400 font-mono">
                        {selectedOrder.deliveryPartner.trackingId}
                      </span>
                      <button
                        onClick={() => copyTrackingId(selectedOrder.deliveryPartner.trackingId)}
                        className="p-1 text-stone-400 hover:text-white transition-colors"
                        title="Copy tracking code"
                      >
                        {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-bold text-white">
                      {selectedOrder.deliveryPartner.company}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {selectedOrder.deliveryPartner.currentHub}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <div className="text-stone-400">Delivery Executive:</div>
                      <div className="font-semibold text-white mt-0.5">
                        {selectedOrder.deliveryPartner.executiveName}
                      </div>
                      <div className="text-stone-400 font-mono text-[11px]">
                        {selectedOrder.deliveryPartner.executivePhone}
                      </div>
                    </div>

                    <div>
                      <div className="text-stone-400">Green Delivery Vehicle:</div>
                      <div className="font-semibold text-emerald-400 font-mono mt-0.5">
                        {selectedOrder.deliveryPartner.vehicleNumber}
                      </div>
                      <div className="text-[11px] text-stone-400">Zero-Emission Electric</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Receiver Preferred Delivery Slot Selection Form */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    <span>Receiver Delivery Convenience</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    Choose Your Delivery Slot
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Since you are receiving the dispatched order, select a convenient delivery date and time window that suits your schedule.
                  </p>
                </div>

                {buyerSlotSuccessMsg && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{buyerSlotSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateReceiverSlot} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Receiver Name</label>
                      <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="Receiver Full Name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Receiver Contact</label>
                      <input
                        type="tel"
                        value={receiverContact}
                        onChange={(e) => setReceiverContact(e.target.value)}
                        placeholder="+91 98220 44512"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Delivery Destination Address</label>
                    <textarea
                      rows={2}
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      placeholder="Receiver Address in Pune"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Preferred Delivery Date</label>
                      <input
                        type="date"
                        value={receiverDate}
                        onChange={(e) => setReceiverDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Receiver Preferred Slot</label>
                      <select
                        value={receiverSlot}
                        onChange={(e) => setReceiverSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 bg-white"
                      >
                        <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                        <option value="Evening (06:00 PM - 09:00 PM)">Evening (06:00 PM - 09:00 PM)</option>
                        <option value="Weekend Preferred (10:00 AM - 02:00 PM)">Weekend Preferred (10:00 AM - 02:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Special Delivery Instructions for Driver
                    </label>
                    <input
                      type="text"
                      value={receiverInstructions}
                      onChange={(e) => setReceiverInstructions(e.target.value)}
                      placeholder="e.g. Leave with building security, call when outside gate"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingSlot}
                    className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-rose-400" />
                    <span>{isUpdatingSlot ? 'Saving Preferences...' : 'Save Receiver Delivery Slot'}</span>
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
