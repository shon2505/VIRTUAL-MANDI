import { BuyerProfile } from '../types';
import { MOCK_BUYER } from './mockData';

export const buyerService = {
  async getProfile(): Promise<BuyerProfile> {
    return { ...MOCK_BUYER };
  },

  async updateProfile(updates: Partial<BuyerProfile>): Promise<BuyerProfile> {
    Object.assign(MOCK_BUYER, updates);
    return { ...MOCK_BUYER };
  },

  async addWarehouse(warehouse: Omit<BuyerProfile['warehouses'][0], 'id'>): Promise<BuyerProfile> {
    const newWh = {
      ...warehouse,
      id: `wh_${Date.now()}`,
    };
    MOCK_BUYER.warehouses.push(newWh);
    return { ...MOCK_BUYER };
  },
};
