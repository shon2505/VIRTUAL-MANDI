import React, { useState } from 'react';
import { ProduceListing, QuoteRequest } from '../types';
import { X, MessageSquare, ShieldCheck } from 'lucide-react';

interface QuoteModalProps {
  listing: ProduceListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote: (quote: QuoteRequest) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitQuote,
}) => {
  if (!isOpen || !listing) return null;

  const [requestedQty, setRequestedQty] = useState<number>(listing.minOrderQuantity * 2);
  const [offeredPrice, setOfferedPrice] = useState<number>(listing.pricePerQuintal - 100);
  const [deliveryDate, setDeliveryDate] = useState<string>('25 Aug 2026');
  const [notes, setNotes] = useState<string>('Doorstep delivery to Pune Wholesale Hub. Payment via Escrow.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuote: QuoteRequest = {
      id: `q-${Date.now()}`,
      listingId: listing.id,
      cropTitle: listing.title,
      farmerName: listing.farmer.name,
      buyerName: 'Vikram Mehta (Wholesaler)',
      buyerCompany: 'Metro Agri Logistics Ltd',
      requestedQty: Number(requestedQty),
      offeredPricePerQuintal: Number(offeredPrice),
      targetDeliveryDate: deliveryDate,
      status: 'Pending',
      notes,
      createdAt: 'Today',
    };
    onSubmitQuote(newQuote);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare color="#d97706" size={20} />
            <h3 className="modal-title">Submit Bulk Price Offer</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{listing.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Farmer: <strong>{listing.farmer.name}</strong> • Listed Asking Price: <strong style={{ color: '#059669' }}>₹{listing.pricePerQuintal}/Qtl</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Required Quantity (Quintals)</label>
              <input
                type="number"
                className="form-input"
                value={requestedQty}
                onChange={(e) => setRequestedQty(Number(e.target.value))}
                min={listing.minOrderQuantity}
                required
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>MOQ: {listing.minOrderQuantity} Qtl</div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Offered Price / Qtl (₹)</label>
              <input
                type="number"
                className="form-input"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Delivery Date</label>
            <input
              type="text"
              className="form-input"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Terms & Logistics Instructions</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', background: '#d97706' }}>
            Send Negotiation Offer to Farmer
          </button>
        </form>
      </div>
    </div>
  );
};
