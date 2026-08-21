import { ProduceListing, ProduceCategory, ProduceGrade } from '../types';
import { MOCK_PRODUCE_LISTINGS } from './mockData';

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

export const productService = {
  privateListings: [...MOCK_PRODUCE_LISTINGS],

  async getAllListings(): Promise<ProduceListing[]> {
    return [...this.privateListings];
  },

  async getListingById(id: string): Promise<ProduceListing | null> {
    const listing = this.privateListings.find(item => item.id === id);
    return listing ? { ...listing } : null;
  },

  async getFarmerListings(farmerId: string): Promise<ProduceListing[]> {
    return this.privateListings.filter(item => item.farmerId === farmerId);
  },

  async filterListings(filters: FilterOptions): Promise<ProduceListing[]> {
    let result = [...this.privateListings];

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.location.district.toLowerCase().includes(q) ||
        item.farmer.name.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }

    if (filters.grade) {
      result = result.filter(item => item.grade === filters.grade);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(item => item.basePricePerUnit >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(item => item.basePricePerUnit <= filters.maxPrice!);
    }

    if (filters.minQuantity !== undefined) {
      result = result.filter(item => item.availableQuantity >= filters.minQuantity!);
    }

    if (filters.maxDistanceKm !== undefined) {
      result = result.filter(item => item.location.distanceKm <= filters.maxDistanceKm!);
    }

    if (filters.verifiedOnly) {
      result = result.filter(item => item.farmer.isVerified);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.basePricePerUnit - b.basePricePerUnit);
          break;
        case 'price_desc':
          result.sort((a, b) => b.basePricePerUnit - a.basePricePerUnit);
          break;
        case 'distance':
          result.sort((a, b) => a.location.distanceKm - b.location.distanceKm);
          break;
        case 'rating':
          result.sort((a, b) => b.farmer.rating - a.farmer.rating);
          break;
        case 'quantity_desc':
          result.sort((a, b) => b.availableQuantity - a.availableQuantity);
          break;
      }
    }

    return result;
  },

  async addProduce(newListing: Omit<ProduceListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProduceListing> {
    const created: ProduceListing = {
      ...newListing,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.privateListings.unshift(created);
    return created;
  },

  async updateListing(id: string, updates: Partial<ProduceListing>): Promise<ProduceListing> {
    const idx = this.privateListings.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Listing not found');
    this.privateListings[idx] = {
      ...this.privateListings[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.privateListings[idx];
  },
};
