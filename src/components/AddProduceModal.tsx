import React, { useState } from 'react';
import { ProduceListing, FarmerProfile, QualityGrade } from '../types';
import { X, Sprout, Image } from 'lucide-react';

interface AddProduceModalProps {
  farmer: FarmerProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: ProduceListing) => void;
}

export const AddProduceModal: React.FC<AddProduceModalProps> = ({
  farmer,
  isOpen,
  onClose,
  onAddListing,
}) => {
  const [cropName, setCropName] = useState('Nashik Red Onion (Garwa)');
  const [category, setCategory] = useState<'Vegetables' | 'Spices' | 'Grains & Pulses' | 'Fruits' | 'Sugar & Jaggery'>('Vegetables');
  const [quantity, setQuantity] = useState<number>(100);
  const [moq, setMoq] = useState<number>(15);
  const [pricePerQuintal, setPricePerQuintal] = useState<number>(2600);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [description, setDescription] = useState('Freshly harvested premium crop ready for APMC dispatch.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: ProduceListing = {
      id: `prod-${Date.now()}`,
      title: `${qualityGrade} ${cropName}`,
      cropName,
      category,
      farmer,
      quantityAvailable: Number(quantity),
      minOrderQuantity: Number(moq),
      pricePerUnit: Math.round(Number(pricePerQuintal) / 100),
      pricePerQuintal: Number(pricePerQuintal),
      apmcBenchmarkPrice: Number(pricePerQuintal) - 50,
      qualityGrade,
      harvestDate: 'Today',
      imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
      location: `${farmer.location.village}, ${farmer.location.district} (MH)`,
      ondcVerified: true,
      organic: qualityGrade === 'Organic Certified',
      description,
    };
    onAddListing(newListing);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout color="#059669" size={20} />
            <h3 className="modal-title">Post New Crop Harvest Listing</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Crop Name & Variety</label>
            <input
              type="text"
              className="form-input"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Spices">Spices</option>
                <option value="Grains & Pulses">Grains & Pulses</option>
                <option value="Fruits">Fruits</option>
                <option value="Sugar & Jaggery">Sugar & Jaggery</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quality Grade</label>
              <select
                className="form-select"
                value={qualityGrade}
                onChange={(e: any) => setQualityGrade(e.target.value)}
              >
                <option value="Grade A (Export)">Grade A (Export)</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Organic Certified">Organic Certified</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Quantity (Quintals)</label>
              <input
                type="number"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Order Qty (Quintals)</label>
              <input
                type="number"
                className="form-input"
                value={moq}
                onChange={(e) => setMoq(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Asking Price per Quintal (₹)</label>
            <input
              type="number"
              className="form-input"
              value={pricePerQuintal}
              onChange={(e) => setPricePerQuintal(Number(e.target.value))}
              required
            />
            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>
              Suggested APMC Benchmark: ₹{pricePerQuintal - 50} / Quintal
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Batch Details</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Publish Listing on Virtual Mandi
          </button>
        </form>
      </div>
    </div>
  );
};
