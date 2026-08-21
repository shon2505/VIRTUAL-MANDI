export type UserRole = 'farmer' | 'buyer';

export type ProduceGrade = 'Premium' | 'A' | 'B';

export type ProduceCategory = 'vegetables' | 'fruits' | 'grains' | 'pulses' | 'spices' | 'all';

export type ListingStatus = 'active' | 'paused' | 'sold_out' | 'draft';

export interface FilterOptions {
  category?: ProduceCategory;
  grade?: ProduceGrade;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxDistanceKm?: number;
  verifiedOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'distance' | 'rating' | 'quantity_desc';
}

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type QuoteStatus = 'pending' | 'responded' | 'accepted' | 'rejected' | 'expired';

export interface BulkPriceTier {
  minQty: number; // in kg
  maxQty?: number; // in kg (null or undefined for max bracket)
  pricePerUnit: number; // in INR
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  farmName: string;
  avatarUrl: string;
  location: {
    village?: string;
    mandiHub: string;
    district: string;
    state: string;
    distanceKm?: number;
  };
  isVerified: boolean;
  kycStatus: 'verified' | 'pending' | 'not_submitted';
  rating: number;
  reviewCount: number;
  completedOrders: number;
  totalProduceListed: number;
  memberSince: string;
  landholdingAcres: number;
  certifications: string[]; // e.g. ['APMC Registered', 'Organic India Certified', 'FSSAI']
  bankDetails: {
    accountHolder: string;
    bankName: string;
    accountNumberMasked: string;
    ifscCode: string;
  };
}

export interface BuyerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: 'Wholesaler' | 'Retail Chain' | 'Food Processor' | 'Restaurant / HoReCa' | 'Exporter' | 'Distributor';
  gstin: string;
  isVerified: boolean;
  avatarUrl: string;
  warehouses: {
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isPrimary: boolean;
  }[];
  typicalMonthlyVolumeKg: number;
  completedProcurements: number;
  memberSince: string;
  preferredPaymentTerms: string;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmer: FarmerProfile;
  name: string;
  category: ProduceCategory;
  variety: string;
  grade: ProduceGrade;
  qualityDescription: string;
  images: string[];
  
  // Quantities in kg base
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  unit: 'kg' | 'quintal' | 'tonne';
  minOrderQuantity: number; // in kg

  // Pricing
  basePricePerUnit: number; // in INR / unit
  isNegotiable: boolean;
  priceTiers: BulkPriceTier[];

  // Harvest & Logistics
  harvestDate: string;
  availableFrom: string;
  availableUntil: string;
  location: {
    mandiHub: string;
    district: string;
    state: string;
    distanceKm: number;
  };

  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  tags?: string[];
}

export interface CartItem {
  listingId: string;
  produce: ProduceListing;
  quantity: number; // in kg
  selectedTierPrice: number;
  notes?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  listingId: string;
  produceName: string;
  variety: string;
  grade: ProduceGrade;
  quantity: number; // in kg
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerId: string;
  buyerName: string;
  businessName: string;
  buyerGstin: string;
  deliveryWarehouse: {
    label: string;
    address: string;
    city: string;
    state: string;
  };
  dispatchType: 'mandi_pickup' | 'farm_direct' | 'ondc_logistics';
  paymentMethod: 'ondc_escrow' | 'rtgs_neft' | 'pay_on_delivery_inspection';
  paymentStatus: 'paid_escrow' | 'pending' | 'released_to_farmer' | 'refunded';
  items: OrderItem[];
  produceSubtotal: number;
  logisticsFee: number;
  mandiCessPlatformFee: number;
  gstAmount: number;
  grandTotal: number;
  timeline: OrderTimelineEvent[];
  eWayBillNumber?: string;
  truckVehicleNumber?: string;
  driverPhone?: string;
}

export interface BulkQuoteRequest {
  id: string;
  rfqNumber: string;
  buyerId: string;
  buyerName: string;
  businessName: string;
  buyerLocation: string;
  produceName: string;
  category: ProduceCategory;
  variety?: string;
  gradeRequired: ProduceGrade;
  targetQuantityKg: number;
  targetPricePerKg?: number;
  deliveryWarehouse: string;
  targetDeliveryDate: string;
  specialRequirements?: string;
  status: QuoteStatus;
  createdAt: string;
  responses: {
    id: string;
    farmerId: string;
    farmerName: string;
    farmerLocation: string;
    offeredPricePerKg: number;
    offeredQuantityKg: number;
    availableFromDate: string;
    notes?: string;
    status: 'offered' | 'accepted' | 'declined';
    createdAt: string;
  }[];
}

export interface NotificationItem {
  id: string;
  targetRole: 'farmer' | 'buyer' | 'all';
  type: 'order' | 'quote' | 'payment' | 'delivery' | 'market_rate';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionRoute?: string;
  meta?: Record<string, any>;
}

export interface MandiRateTickerItem {
  id: string;
  commodity: string;
  mandi: string;
  state: string;
  modalPrice: number; // in INR / Quintal
  priceChange: number; // percentage (+2.4% or -1.1%)
  trend: 'up' | 'down' | 'stable';
  arrivalTonnes: number;
}
