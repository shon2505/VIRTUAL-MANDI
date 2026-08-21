export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Produce', iconName: 'grid', description: 'Complete wholesale mandi catalog', itemCount: 38 },
  { id: 'vegetables', name: 'Vegetables', iconName: 'leaf', description: 'Tomatoes, Onions, Potatoes, Greens', itemCount: 14 },
  { id: 'fruits', name: 'Fruits', iconName: 'sun', description: 'Grapes, Pomegranates, Oranges, Mangoes', itemCount: 9 },
  { id: 'grains', name: 'Grains & Cereals', iconName: 'disc', description: 'Sharbati Wheat, Basmati Rice, Maize', itemCount: 6 },
  { id: 'pulses', name: 'Pulses & Legumes', iconName: 'layers', description: 'Tur Dal, Chana, Moong, Soybean', itemCount: 5 },
  { id: 'spices', name: 'Spices & Cash Crops', iconName: 'zap', description: 'Salem Turmeric, Guntur Chilli, Cotton', itemCount: 4 },
];

export const MANDI_HUBS = [
  { id: 'nashik', name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { id: 'lasalgaon', name: 'Lasalgaon Onion Mandi', district: 'Nashik', state: 'Maharashtra', lat: 20.1472, lng: 74.2304 },
  { id: 'pune', name: 'Pune Gultekdi Market Yard', district: 'Pune', state: 'Maharashtra', lat: 18.4975, lng: 73.8647 },
  { id: 'ahmednagar', name: 'Ahmednagar APMC', district: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lng: 74.7480 },
  { id: 'sangli', name: 'Sangli Turmeric Mandi', district: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815 },
  { id: 'nagpur', name: 'Nagpur Orange Mandi', district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { id: 'guntur', name: 'Guntur Mirchi Yard', district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
];

export const GRADES = [
  { id: 'Premium', label: 'Grade Premium', desc: 'Export / Top Tier' },
  { id: 'A', label: 'Grade A', desc: 'Commercial Wholesale' },
  { id: 'B', label: 'Grade B', desc: 'Processing / Value-Add' },
];

export const UNITS = [
  { id: 'kg', label: 'kg (Kilogram)', multiplier: 1 },
  { id: 'quintal', label: 'Quintal (100 kg)', multiplier: 100 },
  { id: 'tonne', label: 'Metric Tonne (1,000 kg)', multiplier: 1000 },
];
