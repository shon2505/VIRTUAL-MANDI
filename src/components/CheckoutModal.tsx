import React, { useState } from 'react';
import { ProduceListing, Order } from '../types';
import { X, ShoppingBag, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  cart: ProduceListing[];
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (newOrders: Order[]) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  isOpen,
  onClose,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const [logisticsMode, setLogisticsMode] = useState<'standard' | 'cold'>('standard');
  const [paymentEscrow, setPaymentEscrow] = useState<boolean>(true);

  const subtotal = cart.reduce((acc, item) => acc + item.pricePerQuintal * item.minOrderQuantity, 0);
  const logisticsCost = logisticsMode === 'cold' ? 12000 : 6500;
  const total = subtotal + logisticsCost;

  const handleConfirm = () => {
    const newOrders: Order[] = cart.map((item, idx) => ({
      id: `ord-${Date.now()}-${idx}`,
      orderNumber: `VM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cropTitle: item.title,
      farmerName: item.farmer.name,
      farmerId: item.farmer.id,
      buyerCompany: 'Metro Wholesale Traders Pvt Ltd',
      quantity: item.minOrderQuantity,
      totalAmount: item.pricePerQuintal * item.minOrderQuantity + (logisticsCost / cart.length),
      orderDate: 'Today',
      status: 'Confirmed',
      logisticsPartner: logisticsMode === 'cold' ? 'AgriExpress Cold Chain Reefer' : 'APMC Freight Truck',
      truckDetails: 'MH-12-VT-9920 (12-Ton Multi-Axle)',
      estimatedDelivery: 'In 2 Days',
      escrowStatus: paymentEscrow ? 'Held in Escrow' : 'Released to Farmer',
    }));

    onPlaceOrder(newOrders);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag color="#059669" size={20} />
            <h3 className="modal-title">Wholesale Checkout & Logistics</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Cart Items List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
              PRODUCE PROCUREMENT SUMMARY ({cart.length} ITEMS)
            </h4>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Farmer: {item.farmer.name} • {item.minOrderQuantity} Qtl @ ₹{item.pricePerQuintal}/Qtl
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#059669' }}>
                  ₹{(item.pricePerQuintal * item.minOrderQuantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Logistics Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Select Logistics & Transport Service</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                style={{
                  border: `2px solid ${logisticsMode === 'standard' ? '#059669' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  background: logisticsMode === 'standard' ? '#ecfdf5' : '#fff'
                }}
                onClick={() => setLogisticsMode('standard')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Truck size={16} /> Standard APMC Freight
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Ambient multi-axle truck (₹6,500)
                </div>
              </div>

              <div
                style={{
                  border: `2px solid ${logisticsMode === 'cold' ? '#059669' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  background: logisticsMode === 'cold' ? '#ecfdf5' : '#fff'
                }}
                onClick={() => setLogisticsMode('cold')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Truck size={16} color="#0284c7" /> Cold Chain Reefer
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Temperature controlled (₹12,000)
                </div>
              </div>
            </div>
          </div>

          {/* Escrow Guarantee Pill */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <ShieldCheck color="#16a34a" size={24} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d' }}>
                Protected by ONDC Agri Escrow Guarantee
              </div>
              <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                Payment is safely held in escrow until quality inspection at destination mandi.
              </div>
            </div>
          </div>

          {/* Totals */}
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.3rem' }}>
              <span>Produce Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
              <span>Logistics Freight</span>
              <span>₹{logisticsCost.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', paddingTop: '0.4rem', borderTop: '1px dashed #cbd5e1' }}>
              <span>Total Payable</span>
              <span style={{ color: '#059669' }}>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '0.75rem' }} onClick={handleConfirm}>
            <CheckCircle2 size={18} /> Confirm Order & Initiate Escrow Settlement
          </button>
        </div>
      </div>
    </div>
  );
};
