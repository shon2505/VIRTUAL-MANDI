import React from 'react';
import { Order, OrderStatus } from '../types';
import { PackageCheck, Truck, ShieldCheck, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
          Live Orders & Logistics Dispatch Tracker
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time tracking of produce dispatches, cold-chain transport status, and APMC escrow payment releases.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orders.map((ord) => {
          const isPending = ord.status === 'Pending Approval';
          const isConfirmed = ord.status === 'Confirmed' || ord.status === 'Dispatched' || ord.status === 'In Transit' || ord.status === 'Delivered';
          const isInTransit = ord.status === 'Dispatched' || ord.status === 'In Transit' || ord.status === 'Delivered';
          const isDelivered = ord.status === 'Delivered';

          return (
            <div
              key={ord.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Header info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                      {ord.orderNumber}
                    </span>
                    <span className={`status-pill ${isDelivered ? 'delivered' : isPending ? 'pending' : 'transit'}`}>
                      {ord.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Ordered on {ord.orderDate} • Buyer: <strong>{ord.buyerCompany}</strong> • Seller: <strong>{ord.farmerName}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
                    ₹{ord.totalAmount.toLocaleString()}
                  </div>
                  <span className="ondc-pill">
                    <ShieldCheck size={12} /> {isDelivered ? 'Released to Farmer' : ord.escrowStatus}
                  </span>
                </div>
              </div>

              {/* Produce Summary Row */}
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ord.cropTitle}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Quantity: {ord.quantity} Quintals</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#64748b' }}>
                  <div><Truck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Partner: {ord.logisticsPartner}</div>
                  <div>Vehicle: <strong>{ord.truckDetails}</strong></div>
                </div>
              </div>

              {/* Logistics Status Steps */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  PROCUREMENT & DISPATCH TIMELINE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>1. Order Placed</div>
                    <div style={{ fontSize: '0.68rem', color: '#065f46' }}>Escrow Secured</div>
                  </div>

                  <div style={{ background: isConfirmed ? '#ecfdf5' : '#fffbeb', border: `1px solid ${isConfirmed ? '#a7f3d0' : '#fde68a'}`, padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <CheckCircle2 size={16} color={isConfirmed ? '#059669' : '#d97706'} style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isConfirmed ? '#047857' : '#b45309' }}>2. Farmer Approved</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{isConfirmed ? 'Quality Certified' : 'Awaiting Farmer'}</div>
                  </div>

                  <div style={{ background: isInTransit ? '#e0f2fe' : '#f1f5f9', border: `1px solid ${isInTransit ? '#7dd3fc' : '#e2e8f0'}`, padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <Truck size={16} color={isInTransit ? '#0284c7' : '#94a3b8'} style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isInTransit ? '#0369a1' : '#64748b' }}>3. In Transit</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{isInTransit ? 'Truck Dispatched' : 'Pending Truck'}</div>
                  </div>

                  <div style={{ background: isDelivered ? '#f3e8ff' : '#f1f5f9', border: `1px solid ${isDelivered ? '#d8b4fe' : '#e2e8f0'}`, padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <PackageCheck size={16} color={isDelivered ? '#9333ea' : '#94a3b8'} style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDelivered ? '#6b21a8' : '#64748b' }}>4. Delivered</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{isDelivered ? 'Escrow Released' : ord.estimatedDelivery}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
