import { ProduceListing, MandiRate, QuoteRequest, Order, FarmerProfile } from '../types';

export const CURRENT_FARMER: FarmerProfile = {
  id: 'farmer_ramesh_1',
  name: 'Ramesh Patil',
  phone: '+91 98220 45123',
  farmName: 'Patil Agro Fresh Farms',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  location: {
    village: 'Niphad',
    mandiHub: 'Lasalgaon Mandi Hub',
    district: 'Nashik',
    state: 'Maharashtra',
    distanceKm: 28,
  },
  isVerified: true,
  rating: 4.9,
  completedOrders: 94,
  landholdingAcres: 18.5,
  certifications: ['APMC Registered Seller', 'Organic Grade Verified', 'ONDC Agri-Network Certified'],
};

export const MOCK_MANDI_RATES: MandiRate[] = [
  { id: 'mr-1', crop: 'Red Onion (Garwa)', mandi: 'Lasalgaon APMC', state: 'MH', minPrice: 2100, maxPrice: 2850, modalPrice: 2550, changePct: 4.2, trend: 'up', lastUpdated: 'Today 09:30 AM' },
  { id: 'mr-2', crop: 'Turmeric (Rajapuri)', mandi: 'Sangli APMC', state: 'MH', minPrice: 13500, maxPrice: 15200, modalPrice: 14400, changePct: -1.5, trend: 'down', lastUpdated: 'Today 10:15 AM' },
  { id: 'mr-3', crop: 'Tomato (Hybrid)', mandi: 'P Narayangaon APMC', state: 'MH', minPrice: 1200, maxPrice: 1800, modalPrice: 1550, changePct: 6.8, trend: 'up', lastUpdated: 'Today 11:00 AM' },
  { id: 'mr-4', crop: 'Sugarcane Jaggery', mandi: 'Kolhapur APMC', state: 'MH', minPrice: 3800, maxPrice: 4400, modalPrice: 4150, changePct: 0.5, trend: 'stable', lastUpdated: 'Today 08:45 AM' },
  { id: 'mr-5', crop: 'Grand Naine Banana', mandi: 'Jalgaon Mandi', state: 'MH', minPrice: 1400, maxPrice: 1950, modalPrice: 1720, changePct: 2.1, trend: 'up', lastUpdated: 'Today 10:00 AM' },
  { id: 'mr-6', crop: 'Bhagwa Pomegranate', mandi: 'Solapur APMC', state: 'MH', minPrice: 8500, maxPrice: 11000, modalPrice: 9800, changePct: 3.4, trend: 'up', lastUpdated: 'Today 09:50 AM' }
];

export const INITIAL_PRODUCE_LISTINGS: ProduceListing[] = [
  {
    id: 'prod-101',
    title: 'Grade-A Export Quality Nashik Red Onions',
    cropName: 'Red Onion (Garwa)',
    category: 'Vegetables',
    farmer: CURRENT_FARMER,
    quantityAvailable: 150, // Quintals
    minOrderQuantity: 20,
    pricePerUnit: 26, // ₹/kg
    pricePerQuintal: 2600, // ₹/quintal
    apmcBenchmarkPrice: 2550,
    qualityGrade: 'Grade A (Export)',
    harvestDate: '18 Aug 2026',
    imageUrl: '/onions.jpg',
    location: 'Niphad, Nashik (MH)',
    ondcVerified: true,
    organic: false,
    description: 'Freshly harvested Garwa variety onions with high shelf-life, dry outer skin, perfect for long-distance transport and export.'
  },
  {
    id: 'prod-102',
    title: 'GI Tagged Pure Sangli Finger Turmeric',
    cropName: 'Turmeric (Rajapuri)',
    category: 'Spices',
    farmer: {
      id: 'farmer_deshmukh_3',
      name: 'Sunita Deshmukh',
      phone: '+91 97654 11220',
      farmName: 'Deshmukh Golden Grain Farms',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      location: { village: 'Walwa', mandiHub: 'Sangli Mandi', district: 'Sangli', state: 'MH', distanceKm: 18 },
      isVerified: true,
      rating: 4.95,
      completedOrders: 128,
      landholdingAcres: 32,
      certifications: ['GI-Tagged Sangli Producer', 'FSSAI Certified']
    },
    quantityAvailable: 85,
    minOrderQuantity: 10,
    pricePerUnit: 145,
    pricePerQuintal: 14500,
    apmcBenchmarkPrice: 14400,
    qualityGrade: 'Organic Certified',
    harvestDate: '10 Aug 2026',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    location: 'Walwa, Sangli (MH)',
    ondcVerified: true,
    organic: true,
    description: 'High Curcumin (>4.5%) organic turmeric fingers. Directly harvested and sun-dried in Sangli.'
  },
  {
    id: 'prod-103',
    title: 'Fresh Farm Polyhouse Hybrid Tomatoes',
    cropName: 'Tomato (Hybrid)',
    category: 'Vegetables',
    farmer: {
      id: 'farmer_shinde_2',
      name: 'Anand Shinde',
      phone: '+91 94223 88190',
      farmName: 'Shinde Organic Orchards',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      location: { village: 'Pimpalgaon', mandiHub: 'Nashik APMC', district: 'Nashik', state: 'MH', distanceKm: 42 },
      isVerified: true,
      rating: 4.8,
      completedOrders: 65,
      landholdingAcres: 24,
      certifications: ['GlobalGAP Compliant', 'APMC Registered Seller']
    },
    quantityAvailable: 200,
    minOrderQuantity: 30,
    pricePerUnit: 16,
    pricePerQuintal: 1600,
    apmcBenchmarkPrice: 1550,
    qualityGrade: 'Grade A',
    harvestDate: '20 Aug 2026',
    imageUrl: '/tomatoes.jpg',
    location: 'Pimpalgaon, Nashik (MH)',
    ondcVerified: true,
    organic: false,
    description: 'Firm, uniform size red tomatoes packed in standard 25kg crates. Ideal for retail chains & sauce processing.'
  },
  {
    id: 'prod-104',
    title: 'Organic Chemical-Free Kolhapur Sugarcane Jaggery Blocks',
    cropName: 'Sugarcane Jaggery',
    category: 'Sugar & Jaggery',
    farmer: CURRENT_FARMER,
    quantityAvailable: 120,
    minOrderQuantity: 15,
    pricePerUnit: 42,
    pricePerQuintal: 4200,
    apmcBenchmarkPrice: 4150,
    qualityGrade: 'Organic Certified',
    harvestDate: '15 Aug 2026',
    imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
    location: 'Karveer, Kolhapur (MH)',
    ondcVerified: true,
    organic: true,
    description: 'Traditional bucket jaggery processed without clarification chemicals. Rich natural aroma and high purity.'
  },
  {
    id: 'prod-105',
    title: 'Bhagwa Premium Deep Red Pomegranates',
    cropName: 'Bhagwa Pomegranate',
    category: 'Fruits',
    farmer: CURRENT_FARMER,
    quantityAvailable: 60,
    minOrderQuantity: 10,
    pricePerUnit: 98,
    pricePerQuintal: 9800,
    apmcBenchmarkPrice: 9800,
    qualityGrade: 'Grade A (Export)',
    harvestDate: '12 Aug 2026',
    imageUrl: '/pomegranates.jpg',
    location: 'Pandharpur, Solapur (MH)',
    ondcVerified: true,
    organic: false,
    description: 'Uniform 250g+ fruit weight, glossy skin, soft seeds, high juice content. Packed in corrugated export boxes.'
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'q-201',
    listingId: 'prod-101',
    cropTitle: 'Grade-A Export Quality Nashik Red Onions',
    farmerName: 'Ramesh Patil',
    buyerName: 'Vikram Mehta',
    buyerCompany: 'Metro Agro Foods Pvt Ltd',
    requestedQty: 50,
    offeredPricePerQuintal: 2500,
    targetDeliveryDate: '24 Aug 2026',
    status: 'Pending',
    notes: 'We need doorstep delivery at Pune APMC terminal. Payment via ONDC Escrow.',
    createdAt: '21 Aug 2026'
  },
  {
    id: 'q-202',
    listingId: 'prod-102',
    cropTitle: 'GI Tagged Pure Sangli Finger Turmeric',
    farmerName: 'Sunita Deshmukh',
    buyerName: 'Amit Shah',
    buyerCompany: 'Mahalaxmi Spices Exporters',
    requestedQty: 40,
    offeredPricePerQuintal: 14200,
    targetDeliveryDate: '26 Aug 2026',
    status: 'Accepted',
    notes: 'Moisture content tested below 8%. Agreed on FOB Sangli Mandi.',
    createdAt: '20 Aug 2026'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-501',
    orderNumber: 'VM-2026-8812',
    cropTitle: 'Grade-A Export Quality Nashik Red Onions',
    farmerName: 'Ramesh Patil',
    farmerId: 'farmer_ramesh_1',
    buyerCompany: 'Reliance Fresh Procurement Ltd',
    quantity: 100, // Quintals
    totalAmount: 260000, // INR
    orderDate: '19 Aug 2026',
    status: 'In Logistics Transit',
    logisticsPartner: 'AgriExpress Reefer Logistics',
    truckDetails: 'MH-15-EG-4412 (10-Ton Multi-Axle)',
    estimatedDelivery: '22 Aug 2026',
    escrowStatus: 'Held in Escrow'
  },
  {
    id: 'ord-502',
    orderNumber: 'VM-2026-8790',
    cropTitle: 'Organic Sugarcane Jaggery Blocks',
    farmerName: 'Ramesh Patil',
    farmerId: 'farmer_ramesh_1',
    buyerCompany: 'BigBasket Wholesale Hub',
    quantity: 30,
    totalAmount: 126000,
    orderDate: '16 Aug 2026',
    status: 'Delivered',
    logisticsPartner: 'APMC Direct Freight',
    truckDetails: 'MH-09-CV-9011',
    estimatedDelivery: '18 Aug 2026',
    escrowStatus: 'Released to Farmer'
  }
];
