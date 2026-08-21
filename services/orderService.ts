import { Order, OrderStatus } from '../types';
import { MOCK_ORDERS } from './mockData';

export const orderService = {
  privateOrders: [...MOCK_ORDERS],

  async getAllOrders(): Promise<Order[]> {
    return [...this.privateOrders];
  },

  async getFarmerOrders(farmerId?: string): Promise<Order[]> {
    if (!farmerId) return [...this.privateOrders];
    return this.privateOrders.filter(o => o.farmerId === farmerId);
  },

  async getBuyerOrders(buyerId?: string): Promise<Order[]> {
    if (!buyerId) return [...this.privateOrders];
    return this.privateOrders.filter(o => o.buyerId === buyerId);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const order = this.privateOrders.find(o => o.id === orderId || o.orderNumber === orderId);
    return order ? { ...order } : null;
  },

  async createOrder(newOrderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<Order> {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ord_vm_${randomSuffix}`;
    const orderNumber = `VM-2026-${randomSuffix}`;

    const newOrder: Order = {
      ...newOrderData,
      id: orderId,
      orderNumber: orderNumber,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'new',
          title: 'Order Placed & Escrow Funded',
          description: `Bulk procurement order placed for ${newOrderData.items.map(i => i.produceName).join(', ')}.`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'accepted',
          title: 'Farmer Confirmation',
          description: 'Awaiting farmer acceptance and batch allocation.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'preparing',
          title: 'Grading & Packaging',
          description: 'Produce grading and crate packing.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'ready_for_pickup',
          title: 'Ready for Dispatch / Pickup',
          description: 'Freight loading at Mandi hub.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'in_transit',
          title: 'In Transit',
          description: 'Freight transit to destination warehouse.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'delivered',
          title: 'Delivered & Quality Verified',
          description: 'Payment released from Escrow.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
      ],
    };

    this.privateOrders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<Order> {
    const idx = this.privateOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = this.privateOrders[idx];
    const statusTitles: Record<OrderStatus, string> = {
      new: 'Order Placed',
      accepted: 'Farmer Accepted Order',
      preparing: 'Produce in Grading & Packing',
      ready_for_pickup: 'Ready for Truck Dispatch',
      in_transit: 'In Transit to Destination Warehouse',
      delivered: 'Delivered & Quality Verified',
      cancelled: 'Order Cancelled',
    };

    const statusDescriptions: Record<OrderStatus, string> = {
      new: 'Order received into Virtual Mandi ONDC network.',
      accepted: 'Farmer confirmed availability and reserved stock batch.',
      preparing: 'Produce being graded, weighed, and packed into bulk crates.',
      ready_for_pickup: 'Loaded at farm gate / Mandi logistics dock.',
      in_transit: 'Truck en route to buyer warehouse with GPS tracking.',
      delivered: 'Warehouse gate receipt confirmed. Payment released to farmer.',
      cancelled: 'Order was cancelled and funds returned.',
    };

    const updatedTimeline = order.timeline.map(step => {
      if (step.status === newStatus) {
        return {
          ...step,
          completed: true,
          current: true,
          timestamp: 'Just now',
          description: note || statusDescriptions[newStatus] || step.description,
        };
      }
      return {
        ...step,
        current: false,
        completed: step.completed || false,
      };
    });

    const isExistingStep = updatedTimeline.some(s => s.status === newStatus);
    if (!isExistingStep) {
      updatedTimeline.push({
        status: newStatus,
        title: statusTitles[newStatus] || newStatus,
        description: note || statusDescriptions[newStatus] || '',
        timestamp: 'Just now',
        completed: true,
        current: true,
      });
    }

    let paymentStatus = order.paymentStatus;
    if (newStatus === 'delivered') {
      paymentStatus = 'released_to_farmer';
    } else if (newStatus === 'cancelled') {
      paymentStatus = 'refunded';
    }

    this.privateOrders[idx] = {
      ...order,
      status: newStatus,
      paymentStatus,
      timeline: updatedTimeline,
    };

    return this.privateOrders[idx];
  },
};
