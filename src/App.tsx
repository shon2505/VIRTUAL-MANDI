import React, { useState } from 'react';
import { UserRole, ProduceListing, QuoteRequest, Order, OrderStatus, ToastMessage } from './types';
import {
  CURRENT_FARMER,
  MOCK_MANDI_RATES,
  INITIAL_PRODUCE_LISTINGS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { MandiTicker } from './components/MandiTicker';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AddProduceModal } from './components/AddProduceModal';
import { QuoteModal } from './components/QuoteModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersView } from './components/OrdersView';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationToast } from './components/NotificationToast';

export function App() {
  const [role, setRole] = useState<UserRole>('buyer');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'analytics'>('marketplace');

  // Unified Reactive Application State
  const [listings, setListings] = useState<ProduceListing[]>(INITIAL_PRODUCE_LISTINGS);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<ProduceListing[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState<ProduceListing | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Helper for adding toast alerts
  const addToast = (title: string, description: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (item: ProduceListing) => {
    if (!cart.some((c) => c.id === item.id)) {
      setCart([...cart, item]);
    }
    setIsCheckoutModalOpen(true);
  };

  const handleOpenQuoteModal = (item: ProduceListing) => {
    setQuoteTarget(item);
    setIsQuoteModalOpen(true);
  };

  // Farmer Add Produce Listing (Instant Sync to Buyer Marketplace)
  const handleAddListing = (newListing: ProduceListing) => {
    setListings([newListing, ...listings]);
    addToast(
      '🌾 New Produce Listed on Mandi!',
      `"${newListing.title}" is now live on the Buyer Marketplace for wholesale procurement.`,
      'success'
    );
  };

  // Farmer Delete Produce Listing (Instant Sync to Buyer Marketplace)
  const handleDeleteListing = (listingId: string) => {
    const target = listings.find((l) => l.id === listingId);
    setListings((prev) => prev.filter((l) => l.id !== listingId));
    addToast(
      '🗑️ Produce Listing Removed',
      `"${target?.title || 'Listing'}" was removed from the live Buyer Marketplace.`,
      'warning'
    );
  };

  // Submit Buyer Quote Offer
  const handleSubmitQuote = (newQuote: QuoteRequest) => {
    setQuotes([newQuote, ...quotes]);
    addToast(
      '💬 B2B Quote Request Sent!',
      `Your bulk offer for ${newQuote.cropTitle} was sent to Farmer ${newQuote.farmerName}.`,
      'info'
    );
  };

  // Farmer Quote Actions
  const handleAcceptQuote = (quoteId: string) => {
    const q = quotes.find((item) => item.id === quoteId);
    setQuotes(quotes.map((item) => (item.id === quoteId ? { ...item, status: 'Accepted' } : item)));
    addToast(
      '✅ B2B Quote Accepted by Farmer!',
      `Quote for ${q?.cropTitle || 'Crop'} accepted. Buyer notified to proceed with order.`,
      'success'
    );
  };

  const handleRejectQuote = (quoteId: string) => {
    setQuotes(quotes.map((item) => (item.id === quoteId ? { ...item, status: 'Rejected' } : item)));
    addToast('❌ Quote Declined', 'Quote offer was declined by farmer.', 'warning');
  };

  // Buyer Place Orders -> Real-time status: 'Pending Approval'
  const handlePlaceOrder = (newOrders: Order[]) => {
    setOrders([...newOrders, ...orders]);
    setCart([]);
    setActiveTab('orders');
    newOrders.forEach((o) => {
      addToast(
        '📦 New Order Placed & Escrow Held!',
        `Order ${o.orderNumber} for ${o.cropTitle} sent to Farmer ${o.farmerName}. Status: Pending Approval.`,
        'success'
      );
    });
  };

  // Farmer Update Order Lifecycle Status ('Pending Approval' -> 'Confirmed' -> 'In Logistics Transit' -> 'Delivered')
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              escrowStatus: newStatus === 'Delivered' ? 'Released to Farmer' : o.escrowStatus,
              updatedAt: new Date().toLocaleTimeString(),
            }
          : o
      )
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    const orderNum = targetOrder?.orderNumber || 'Order';

    if (newStatus === 'Confirmed') {
      addToast(
        '✓ Order Approved by Farmer!',
        `Order ${orderNum} was accepted by Farmer ${targetOrder?.farmerName}. Ready for dispatch.`,
        'success'
      );
    } else if (newStatus === 'In Logistics Transit') {
      addToast(
        '🚚 Freight Truck Dispatched!',
        `Order ${orderNum} is now in transit with ${targetOrder?.logisticsPartner}.`,
        'info'
      );
    } else if (newStatus === 'Delivered') {
      addToast(
        '🎉 Order Delivered & Payment Released!',
        `Order ${orderNum} delivered to destination mandi! Escrow funds released to farmer.`,
        'success'
      );
    }
  };

  return (
    <div className="app-container">
      {/* Live Floating Toast Notifications */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Live Mandi Rate Ticker */}
      <MandiTicker rates={MOCK_MANDI_RATES} />

      {/* Main Navbar with Role Session Indicator */}
      <Navbar
        role={role}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.length}
        onOpenCart={() => setIsCheckoutModalOpen(true)}
        notificationCount={toasts.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'marketplace' &&
          (role === 'buyer' ? (
            <BuyerMarketplace
              listings={listings}
              onAddToCart={handleAddToCart}
              onRequestQuote={handleOpenQuoteModal}
            />
          ) : (
            <FarmerDashboard
              farmer={CURRENT_FARMER}
              listings={listings}
              quotes={quotes}
              orders={orders}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onAcceptQuote={handleAcceptQuote}
              onRejectQuote={handleRejectQuote}
              onDeleteListing={handleDeleteListing}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          ))}

        {activeTab === 'orders' && (
          <OrdersView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
        )}

        {activeTab === 'analytics' && <AnalyticsView rates={MOCK_MANDI_RATES} />}
      </main>

      {/* Modals */}
      <AddProduceModal
        farmer={CURRENT_FARMER}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddListing={handleAddListing}
      />

      <QuoteModal
        listing={quoteTarget}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSubmitQuote={handleSubmitQuote}
      />

      <CheckoutModal
        cart={cart}
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

export default App;
