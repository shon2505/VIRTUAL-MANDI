import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { UserRole, ProduceListing, QuoteRequest, Order, OrderStatus, ToastMessage } from './types';
import { CURRENT_FARMER, MOCK_MANDI_RATES } from './data/mockData';
import { db } from './services/db';
import { Navbar } from './components/Navbar';
import { MandiTicker } from './components/MandiTicker';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { FarmerDashboard } from './components/FarmerDashboard';
import { Chatbot } from './components/Chatbot';
import { AddProduceModal } from './components/AddProduceModal';
import { QuoteModal } from './components/QuoteModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersView } from './components/OrdersView';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationToast } from './components/NotificationToast';
import { useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export function App() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/signup'].includes(location.pathname);

  // Unified Reactive Application State
  const [listings, setListings] = useState<ProduceListing[]>(db.getListings());
  const [quotes, setQuotes] = useState<QuoteRequest[]>(db.getQuotes());
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  
  React.useEffect(() => { db.saveListings(listings); }, [listings]);
  React.useEffect(() => { db.saveQuotes(quotes); }, [quotes]);
  React.useEffect(() => { db.saveOrders(orders); }, [orders]);
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
    navigate('/orders');
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

      {/* Global Elements hidden on public routes */}
      {!isPublicRoute && (
        <>
          <MandiTicker rates={MOCK_MANDI_RATES} />
          <Navbar
            cartCount={cart.length}
            onOpenCart={() => setIsCheckoutModalOpen(true)}
            notificationCount={toasts.length}
          />
        </>
      )}

      {/* Main Content Area */}
      <main className={isPublicRoute ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/marketplace" 
            element={
              isLoggedIn ? (
              <BuyerMarketplace
                listings={listings}
                onAddToCart={handleAddToCart}
                onRequestQuote={handleOpenQuoteModal}
              />
              ) : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/farmer/dashboard" 
            element={
              isLoggedIn && user?.role === 'farmer' ? (
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
              ) : <Navigate to="/login" replace />
            } 
          />

          <Route 
            path="/orders" 
            element={isLoggedIn ? <OrdersView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/analytics" 
            element={isLoggedIn ? <AnalyticsView rates={MOCK_MANDI_RATES} /> : <Navigate to="/login" replace />} 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modals */}
      {!isPublicRoute && (
        <>
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
          
          {/* AI Assistant Chatbot */}
          <Chatbot />
        </>
      )}
    </div>
  );
}

export default App;
