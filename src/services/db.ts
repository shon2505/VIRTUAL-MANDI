import { ProduceListing, QuoteRequest, Order, ToastMessage } from '../types';
import { INITIAL_PRODUCE_LISTINGS, INITIAL_QUOTES, INITIAL_ORDERS } from '../data/mockData';

const DB_KEYS = {
  LISTINGS: 'vm_listings_v2',
  QUOTES: 'vm_quotes_v2',
  ORDERS: 'vm_orders_v2',
};

// Initialize DB if empty
const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.LISTINGS)) {
    localStorage.setItem(DB_KEYS.LISTINGS, JSON.stringify(INITIAL_PRODUCE_LISTINGS));
  }
  if (!localStorage.getItem(DB_KEYS.QUOTES)) {
    localStorage.setItem(DB_KEYS.QUOTES, JSON.stringify(INITIAL_QUOTES));
  }
  if (!localStorage.getItem(DB_KEYS.ORDERS)) {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
};

initDB();

export const db = {
  getListings: (): ProduceListing[] => JSON.parse(localStorage.getItem(DB_KEYS.LISTINGS) || '[]'),
  saveListings: (data: ProduceListing[]) => localStorage.setItem(DB_KEYS.LISTINGS, JSON.stringify(data)),
  
  getQuotes: (): QuoteRequest[] => JSON.parse(localStorage.getItem(DB_KEYS.QUOTES) || '[]'),
  saveQuotes: (data: QuoteRequest[]) => localStorage.setItem(DB_KEYS.QUOTES, JSON.stringify(data)),
  
  getOrders: (): Order[] => JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]'),
  saveOrders: (data: Order[]) => localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(data)),
};
