import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProduceListing, FilterOptions } from '../types';
import { productService } from '../services/productService';

interface ListingsContextType {
  listings: ProduceListing[];
  farmerListings: ProduceListing[];
  isLoading: boolean;
  activeFilter: FilterOptions;
  setFilter: (filters: Partial<FilterOptions>) => void;
  resetFilter: () => void;
  refreshListings: () => Promise<void>;
  addProduce: (produce: Omit<ProduceListing, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ProduceListing>;
  updateProduce: (id: string, updates: Partial<ProduceListing>) => Promise<ProduceListing>;
  getProduceById: (id: string) => ProduceListing | undefined;
}

const defaultFilters: FilterOptions = {
  category: 'all',
  sortBy: 'price_asc',
};

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOptions>(defaultFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.filterListings(activeFilter);
      setListings(data);
    } catch (err) {
      console.warn('Failed to load listings', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const setFilter = (newFilters: Partial<FilterOptions>) => {
    setActiveFilter((prev: FilterOptions) => ({ ...prev, ...newFilters }));
  };

  const resetFilter = () => {
    setActiveFilter(defaultFilters);
  };

  const refreshListings = async () => {
    await fetchListings();
  };

  const addProduce = async (newProduce: Omit<ProduceListing, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await productService.addProduce(newProduce);
    await fetchListings();
    return created;
  };

  const updateProduce = async (id: string, updates: Partial<ProduceListing>) => {
    const updated = await productService.updateListing(id, updates);
    await fetchListings();
    return updated;
  };

  const getProduceById = (id: string) => {
    return listings.find(item => item.id === id);
  };

  const farmerListings = listings.filter(item => item.farmerId === 'farmer_ramesh_1');

  return (
    <ListingsContext.Provider
      value={{
        listings,
        farmerListings,
        isLoading,
        activeFilter,
        setFilter,
        resetFilter,
        refreshListings,
        addProduce,
        updateProduce,
        getProduceById,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = (): ListingsContextType => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};
