export type UserRole = 'farmer' | 'buyer';

export type QualityGrade = 'Grade A (Export)' | 'Grade A' | 'Grade B' | 'Organic Certified';

export type OrderStatus = 'Pending Approval' | 'Confirmed' | 'Dispatched' | 'In Transit' | 'Delivered';

export interface Location {
  village: string;
  mandiHub: string;
  district: string;
  state: string;
  distanceKm: number;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  farmName: string;
  avatarUrl: string;
  location: Location;
  isVerified: boolean;
  rating: number;
  completedOrders: number;
  landholdingAcres: number;
  certifications: string[];
}

export interface BuyerProfile {
  id: string;
  companyName: string;
  contactName: string;
  businessType: string;
  gstin: string;
  city: string;
  state: string;
  verifiedGst: boolean;
}

export interface ProduceListing {
  id: string;
  title: string;
  cropName: string;
  category: 'Vegetables' | 'Spices' | 'Grains & Pulses' | 'Fruits' | 'Sugar & Jaggery';
  farmer: FarmerProfile;
  quantityAvailable: number; // Quintals
  minOrderQuantity: number; // Quintals
  pricePerUnit: number; // INR per Kg
  pricePerQuintal: number; // INR per Quintal
  apmcBenchmarkPrice: number; // Benchmark APMC price
  qualityGrade: QualityGrade;
  harvestDate: string;
  imageUrl: string;
  location: string;
  ondcVerified: boolean;
  organic: boolean;
  description: string;
}

export interface MandiRate {
  id: string;
  crop: string;
  mandi: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  changePct: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface QuoteRequest {
  id: string;
  listingId: string;
  cropTitle: string;
  farmerName: string;
  buyerName: string;
  buyerCompany: string;
  requestedQty: number;
  offeredPricePerQuintal: number;
  targetDeliveryDate: string;
  status: 'Pending' | 'Accepted' | 'Countered' | 'Rejected';
  notes: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  cropTitle: string;
  farmerName: string;
  farmerId: string;
  buyerCompany: string;
  quantity: number;
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  logisticsPartner: string;
  truckDetails: string;
  estimatedDelivery: string;
  escrowStatus: 'Held in Escrow' | 'Released to Farmer';
  updatedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}
