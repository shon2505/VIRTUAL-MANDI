import React, { useState } from 'react';
import { FarmerProfile, ProduceListing, QuoteRequest, Order, OrderStatus } from '../types';
import { PlusCircle, ShieldCheck, TrendingUp, Package, MessageSquare, Check, X, Trash2, Truck, CheckCircle2, MapPin, Clock } from 'lucide-react';

interface FarmerDashboardProps {
  farmer: FarmerProfile;
  listings: ProduceListing[];
  quotes: QuoteRequest[];
  orders: Order[];
  onOpenAddModal: () => void;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onDeleteListing: (listingId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmer,
  listings,
  quotes,
  orders,
  onOpenAddModal,
  onAcceptQuote,
  onRejectQuote,
  onDeleteListing,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'listings' | 'quotes'>('orders');

  const farmerListings = listings.filter((l) => l.farmer.id === farmer.id);
  const pendingQuotes = quotes.filter((q) => q.status === 'Pending');
  const activeOrders = orders.filter((o) => o.farmerId === farmer.id || o.farmerName === farmer.name);

  return (
    <div>
      {/* Farmer Profile Card */}
      <div className="farmer-header">
        <div className="farmer-info">
          <img src={farmer.avatarUrl} alt={farmer.name} className="farmer-avatar-lg" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="farmer-title">{farmer.name}</h2>
              <span className="ondc-pill">
                <ShieldCheck size={12} /> KYC Verified Seller
              </span>
            </div>
            <p className="farmer-subtitle">
              {farmer.farmName} • <MapPin size={13} style={{ display: 'inline' }} /> {farmer.location.village}, {farmer.location.district} ({farmer.location.mandiHub})
            </p>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
              Landholding: <strong>{farmer.landholdingAcres} Acres</strong> • Orders Fulfilled: <strong>{farmer.completedOrders}</strong> • Rating ⭐ <strong>{farmer.rating}</strong>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal}>
          <PlusCircle size={18} /> Post New Crop Listing
        </button>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val" style={{ color: '#2563eb' }}>{activeOrders.length}</div>
          <div className="stat-lbl">Active Buyer Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{farmerListings.length}</div>
          <div className="stat-lbl">Harvest Produce Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: '#d97706' }}>{pendingQuotes.length}</div>
          <div className="stat-lbl">Pending B2B Buyer Quotes</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: '#059669' }}>₹3.86 L</div>
          <div className="stat-lbl">Total Mandi Revenue</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="filter-bar" style={{ marginBottom: '1rem' }}>
        <div className="category-pills">
          <button
            className={`cat-pill ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Clock size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Incoming Buyer Orders Queue ({activeOrders.length})
          </button>
          <button
            className={`cat-pill ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <Package size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            My Produce Listings ({farmerListings.length})
          </button>
          <button
            className={`cat-pill ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            <MessageSquare size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            B2B Buyer Price Offers ({quotes.length})
          </button>
        </div>
      </div>

      {/* Incoming Buyer Orders Queue */}
      {activeTab === 'orders' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Produce Title</th>
                <th>Buyer Company</th>
                <th>Quantity</th>
                <th>Total Value</th>
                <th>Current Status</th>
                <th>Farmer Dispatch Control</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((ord) => (
                <tr key={ord.id}>
                  <td><strong style={{ color: '#0f172a' }}>{ord.orderNumber}</strong></td>
                  <td style={{ fontWeight: 600 }}>{ord.cropTitle}</td>
                  <td>{ord.buyerCompany}</td>
                  <td><strong>{ord.quantity} Qtl</strong></td>
                  <td style={{ color: '#059669', fontWeight: 700 }}>₹{ord.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${ord.status === 'Delivered' ? 'delivered' : 'transit'}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {ord.status === 'Pending Approval' && (
                        <button
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => onUpdateOrderStatus(ord.id, 'Confirmed')}
                        >
                          <Check size={13} /> Accept Order
                        </button>
                      )}

                      {(ord.status === 'Pending Approval' || ord.status === 'Confirmed') && (
                        <button
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', background: '#e0f2fe', color: '#0369a1', borderColor: '#7dd3fc' }}
                          onClick={() => onUpdateOrderStatus(ord.id, 'In Logistics Transit')}
                        >
                          <Truck size={13} /> Dispatch Truck
                        </button>
                      )}

                      {ord.status === 'In Logistics Transit' && (
                        <button
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', background: '#9333ea' }}
                          onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                        >
                          <CheckCircle2 size={13} /> Mark Delivered
                        </button>
                      )}

                      {ord.status === 'Delivered' && (
                        <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                          ✓ Escrow Released
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Produce Listings Table with Remove/Delete Action */}
      {activeTab === 'listings' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop Listing</th>
                <th>Category</th>
                <th>Stock Available</th>
                <th>Price / Qtl</th>
                <th>APMC Benchmark</th>
                <th>Quality Grade</th>
                <th>Manage Item</th>
              </tr>
            </thead>
            <tbody>
              {farmerListings.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.category}</td>
                  <td><strong>{item.quantityAvailable} Qtl</strong></td>
                  <td><strong style={{ color: '#059669' }}>₹{item.pricePerQuintal}</strong></td>
                  <td style={{ color: '#64748b' }}>₹{item.apmcBenchmarkPrice}</td>
                  <td><span className="card-badge grade">{item.qualityGrade}</span></td>
                  <td>
                    <button
                      className="btn-outline"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', color: '#ef4444', borderColor: '#fca5a5' }}
                      onClick={() => onDeleteListing(item.id)}
                      title="Remove produce listing from Buyer Marketplace"
                    >
                      <Trash2 size={13} /> Remove Listing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* B2B Received Quotes */}
      {activeTab === 'quotes' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Buyer Company</th>
                <th>Target Crop</th>
                <th>Requested Qty</th>
                <th>Offered Price / Qtl</th>
                <th>Target Delivery</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{q.buyerCompany}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{q.buyerName}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{q.cropTitle}</td>
                  <td><strong>{q.requestedQty} Qtl</strong></td>
                  <td><strong style={{ color: '#d97706' }}>₹{q.offeredPricePerQuintal}</strong></td>
                  <td>{q.targetDeliveryDate}</td>
                  <td>
                    <span className={`status-pill ${q.status.toLowerCase()}`}>
                      {q.status}
                    </span>
                  </td>
                  <td>
                    {q.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => onAcceptQuote(q.id)}
                        >
                          <Check size={14} /> Accept Offer
                        </button>
                        <button
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', color: '#ef4444' }}
                          onClick={() => onRejectQuote(q.id)}
                        >
                          <X size={14} /> Decline
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
