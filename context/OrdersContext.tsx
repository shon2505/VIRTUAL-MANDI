import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';

interface OrdersContextType {
  orders: Order[];
  farmerOrders: Order[];
  buyerOrders: Order[];
  isLoading: boolean;
  activeOrder: Order | null;
  loadOrders: () => Promise<void>;
  getOrder: (id: string) => Promise<Order | null>;
  createOrderFromCart: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<Order>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.warn('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getOrder = async (id: string) => {
    const found = await orderService.getOrderById(id);
    setActiveOrder(found);
    return found;
  };

  const createOrderFromCart = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => {
    const created = await orderService.createOrder(orderData);
    await loadOrders();
    return created;
  };

  const updateStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const updated = await orderService.updateOrderStatus(orderId, status, note);
    await loadOrders();
    setActiveOrder(updated);
    return updated;
  };

  const farmerOrders = orders.filter(o => o.farmerId === 'farmer_ramesh_1');
  const buyerOrders = orders; // Show buyer view of all placed orders

  return (
    <OrdersContext.Provider
      value={{
        orders,
        farmerOrders,
        buyerOrders,
        isLoading,
        activeOrder,
        loadOrders,
        getOrder,
        createOrderFromCart,
        updateStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
