import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, FarmerProfile, BuyerProfile } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  role: UserRole | null;
  farmerProfile: FarmerProfile;
  buyerProfile: BuyerProfile;
  isLoading: boolean;
  setRole: (role: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  login: (phoneOrEmail: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole | null>('buyer'); // default to buyer for instant discovery
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>({} as FarmerProfile);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>({} as BuyerProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedRole = await authService.getStoredRole();
        if (storedRole) {
          setRoleState(storedRole);
        }
        const [farmer, buyer] = await Promise.all([
          authService.getFarmerProfile(),
          authService.getBuyerProfile(),
        ]);
        setFarmerProfile(farmer);
        setBuyerProfile(buyer);
      } catch (err) {
        console.warn('Auth init failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const setRole = async (newRole: UserRole) => {
    setRoleState(newRole);
    await authService.setStoredRole(newRole);
  };

  const switchRole = async (newRole: UserRole) => {
    setRoleState(newRole);
    await authService.setStoredRole(newRole);
  };

  const login = async (phoneOrEmail: string, newRole: UserRole) => {
    setIsLoading(true);
    try {
      await authService.login(phoneOrEmail, newRole);
      setRoleState(newRole);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setRoleState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        farmerProfile,
        buyerProfile,
        isLoading,
        setRole,
        switchRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
