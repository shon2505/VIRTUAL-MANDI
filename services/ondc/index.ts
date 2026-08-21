/**
 * ONDC (Open Network for Digital Commerce) Protocol Service Stub
 * Implements standard Beckn protocol BAP/BPP lifecycle methods:
 * - search
 * - select (quote generation)
 * - init (order drafting & billing)
 * - confirm (order placement)
 * - status (polling fulfillment status)
 * - track (live logistics tracking)
 */

export interface OndcSearchRequest {
  category?: string;
  itemQuery?: string;
  buyerGstin?: string;
  gpsLocation?: { lat: number; lng: number };
}

export interface OndcSelectRequest {
  providerId: string;
  items: { id: string; quantity: number }[];
  deliveryLocation: { pincode: string; address: string };
}

export const ondcService = {
  async search(request: OndcSearchRequest) {
    console.log('[ONDC Protocol] Triggering /search on Beckn Gateway', request);
    return {
      transactionId: `tx_ondc_${Date.now()}`,
      messageId: `msg_${Date.now()}`,
      bppProvidersCount: 4,
      status: 'ACK',
    };
  },

  async select(request: OndcSelectRequest) {
    console.log('[ONDC Protocol] Triggering /select for provider quote', request);
    return {
      quote: {
        price: { currency: 'INR', value: '25136.00' },
        breakup: [
          { title: 'Produce Cost', price: { currency: 'INR', value: '22400.00' } },
          { title: 'ONDC Logistics Partner', price: { currency: 'INR', value: '2400.00' } },
          { title: 'APMC Market Cess (1.5%)', price: { currency: 'INR', value: '336.00' } },
        ],
      },
      status: 'ACK',
    };
  },

  async init(orderId: string) {
    console.log('[ONDC Protocol] Triggering /init for order drafting', orderId);
    return {
      order: {
        id: orderId,
        paymentTerms: 'ONDC_ESCROW_COLLECTION',
        status: 'INITIALIZED',
      },
      status: 'ACK',
    };
  },

  async confirm(orderId: string) {
    console.log('[ONDC Protocol] Triggering /confirm for final order broadcast', orderId);
    return {
      orderId,
      status: 'CONFIRMED',
      fulfillmentStatus: 'ORDER_ACCEPTED_BY_FARMER',
    };
  },
};
