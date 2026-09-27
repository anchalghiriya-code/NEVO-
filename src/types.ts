/**
 * Shared types for Circular Fashion Suite
 */

export interface Garment {
  id: string;
  name: string;
  fabricType: string;
  blendPercentage: string;
  garmentCategory: string;
  brand: string;
  condition: 'Very Good' | 'Good' | 'Damaged' | 'Unusable';
  wearLevel: string;
  suggestedPathway: 'Donate' | 'Sell' | 'Upcycle' | 'Recycle' | 'Dispose';
  recyclingProcess: string;
  machinesUsed: string[];
  diyIdeas: string[];
  nearbyNgos: string[];
  nearbyRecyclers: string[];
  secondHandBuyers: string[];
  carbonSavings: number; // in kg CO2
  rewardPoints: number;
  description: string;
  imageUrl?: string;

  // Backward compatibility fields
  fabric: string;
  category: 'Natural Plant Fibres' | 'Natural Animal Fibres' | 'Synthetic Fibres' | 'Blended Fabrics' | 'Leather & Composite Materials' | 'Technical / Specialty Textiles';
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Worn out';
  remainingLife: string;
}

export interface NGO {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  location: [number, number]; // [lat, lng]
  needs: string[];
}

export interface CollectionSchedule {
  name: string;
  contact: string;
  address: string;
  date: string;
  timeSlot: string;
  driverName?: string;
  driverPhone?: string;
  status: 'Scheduled' | 'Assigned' | 'Arrived' | 'Completed';
}

export interface BuyerOrder {
  id: string;
  orderNumber: string;
  itemTitle: string;
  itemCategory: string;
  itemFabric: string;
  price: number;
  imageUrl?: string;
  sellerName: string;
  sellerCity: string;
  buyerName: string;
  buyerContact: string;
  buyerAddress: string;
  status: 'Order Placed' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  dispatchedDate: string;
  estimatedArrival: string;
  receiverPreferredDate: string;
  receiverPreferredSlot: string;
  specialInstructions?: string;
  deliveryPartner: {
    company: string;
    trackingId: string;
    executiveName: string;
    executivePhone: string;
    vehicleNumber: string;
    currentHub: string;
  };
}

export interface UserSession {
  isAuthenticated: boolean;
  user: {
     name: string;
     email: string;
     contact?: string;
     address?: string;
     authProvider?: 'google' | 'otp' | 'password' | 'express';
     isVerified?: boolean;
     verifiedAt?: string;
  } | null;
}

