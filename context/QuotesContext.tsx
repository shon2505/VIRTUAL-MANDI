import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BulkQuoteRequest } from '../types';
import { quoteService } from '../services/quoteService';

interface QuotesContextType {
  quotes: BulkQuoteRequest[];
  isLoading: boolean;
  loadQuotes: () => Promise<void>;
  submitRFQ: (data: Omit<BulkQuoteRequest, 'id' | 'rfqNumber' | 'createdAt' | 'status' | 'responses'>) => Promise<BulkQuoteRequest>;
  acceptOffer: (quoteId: string, responseId: string) => Promise<BulkQuoteRequest>;
  getQuoteById: (id: string) => Promise<BulkQuoteRequest | null>;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<BulkQuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await quoteService.getAllQuotes();
      setQuotes(data);
    } catch (err) {
      console.warn('Failed to load RFQs', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const submitRFQ = async (data: Omit<BulkQuoteRequest, 'id' | 'rfqNumber' | 'createdAt' | 'status' | 'responses'>) => {
    const created = await quoteService.submitRFQ(data);
    await loadQuotes();
    return created;
  };

  const acceptOffer = async (quoteId: string, responseId: string) => {
    const updated = await quoteService.acceptOffer(quoteId, responseId);
    await loadQuotes();
    return updated;
  };

  const getQuoteById = async (id: string) => {
    return await quoteService.getQuoteById(id);
  };

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        isLoading,
        loadQuotes,
        submitRFQ,
        acceptOffer,
        getQuoteById,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
};

export const useQuotes = (): QuotesContextType => {
  const context = useContext(QuotesContext);
  if (!context) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
};
