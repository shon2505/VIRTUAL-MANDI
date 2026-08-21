import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, FarmerProfile, BuyerProfile } from '../types';
import { MOCK_FARMER, MOCK_BUYER } from './mockData';

const ROLE_STORAGE_KEY = '@virtual_mandi_user_role';
const USER_STORAGE_KEY = '@virtual_mandi_current_user';

export const authService = {
  async getStoredRole(): Promise<UserRole | null> {
    try {
      const role = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
      return (role as UserRole) || null;
    } catch {
      return null;
    }
  },

  async setStoredRole(role: UserRole): Promise<void> {
    try {
      await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch (e) {
      console.warn('Failed to save role', e);
    }
  },

  async getFarmerProfile(): Promise<FarmerProfile> {
    return MOCK_FARMER;
  },

  async getBuyerProfile(): Promise<BuyerProfile> {
    return MOCK_BUYER;
  },

  async login(phoneOrEmail: string, role: UserRole): Promise<{ role: UserRole; profile: FarmerProfile | BuyerProfile }> {
    await this.setStoredRole(role);
    const profile = role === 'farmer' ? MOCK_FARMER : MOCK_BUYER;
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    return { role, profile };
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  },
};
