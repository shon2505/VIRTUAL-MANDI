import { FarmerProfile } from '../types';
import { MOCK_FARMER, MOCK_EARNINGS_STATS } from './mockData';

export const farmerService = {
  async getProfile(): Promise<FarmerProfile> {
    return { ...MOCK_FARMER };
  },

  async updateProfile(updates: Partial<FarmerProfile>): Promise<FarmerProfile> {
    Object.assign(MOCK_FARMER, updates);
    return { ...MOCK_FARMER };
  },

  async getEarningsStats() {
    return { ...MOCK_EARNINGS_STATS };
  },
};
