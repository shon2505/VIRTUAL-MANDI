import { BulkQuoteRequest } from '../types';
import { MOCK_BULK_QUOTES } from './mockData';

export const quoteService = {
  privateQuotes: [...MOCK_BULK_QUOTES],

  async getAllQuotes(): Promise<BulkQuoteRequest[]> {
    return [...this.privateQuotes];
  },

  async getBuyerQuotes(buyerId?: string): Promise<BulkQuoteRequest[]> {
    if (!buyerId) return [...this.privateQuotes];
    return this.privateQuotes.filter(q => q.buyerId === buyerId);
  },

  async getQuoteById(id: string): Promise<BulkQuoteRequest | null> {
    const q = this.privateQuotes.find(item => item.id === id || item.rfqNumber === id);
    return q ? { ...q } : null;
  },

  async submitRFQ(rfqData: Omit<BulkQuoteRequest, 'id' | 'rfqNumber' | 'createdAt' | 'status' | 'responses'>): Promise<BulkQuoteRequest> {
    const randomSuffix = Math.floor(500 + Math.random() * 499);
    const newRFQ: BulkQuoteRequest = {
      ...rfqData,
      id: `rfq_vm_${randomSuffix}`,
      rfqNumber: `RFQ-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      responses: [],
    };
    this.privateQuotes.unshift(newRFQ);
    return newRFQ;
  },

  async addFarmerOffer(
    quoteId: string,
    offer: {
      farmerId: string;
      farmerName: string;
      farmerLocation: string;
      offeredPricePerKg: number;
      offeredQuantityKg: number;
      availableFromDate: string;
      notes?: string;
    }
  ): Promise<BulkQuoteRequest> {
    const idx = this.privateQuotes.findIndex(q => q.id === quoteId || q.rfqNumber === quoteId);
    if (idx === -1) throw new Error('RFQ not found');

    const newOffer = {
      ...offer,
      id: `resp_${Date.now()}`,
      status: 'offered' as const,
      createdAt: new Date().toISOString(),
    };

    this.privateQuotes[idx].responses.push(newOffer);
    this.privateQuotes[idx].status = 'responded';
    return this.privateQuotes[idx];
  },

  async acceptOffer(quoteId: string, responseId: string): Promise<BulkQuoteRequest> {
    const idx = this.privateQuotes.findIndex(q => q.id === quoteId || q.rfqNumber === quoteId);
    if (idx === -1) throw new Error('RFQ not found');

    this.privateQuotes[idx].responses = this.privateQuotes[idx].responses.map(resp => ({
      ...resp,
      status: resp.id === responseId ? ('accepted' as const) : ('declined' as const),
    }));
    this.privateQuotes[idx].status = 'accepted';
    return this.privateQuotes[idx];
  },
};
