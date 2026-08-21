import React, { useState } from 'react';
import { ProduceListing } from '../types';
import { Search, ShieldCheck, MapPin, Calendar, Scale, ShoppingCart, MessageSquare, Award } from 'lucide-react';

interface BuyerMarketplaceProps {
  listings: ProduceListing[];
  onAddToCart: (item: ProduceListing) => void;
  onRequestQuote: (item: ProduceListing) => void;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  listings,
  onAddToCart,
  onRequestQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Vegetables', 'Spices', 'Sugar & Jaggery', 'Fruits'];

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmer.location.mandiHub.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-tag">
            <ShieldCheck size={16} /> Direct APMC Mandi Procurement
          </div>
          <h1 className="hero-title">Direct from Indian Farmers.<br/>Built for Bulk Procurement.</h1>
          <p className="hero-subtitle">
            Source fresh produce directly from verified farmers across Maharashtra APMC hubs with transparent mandi pricing, quality grading, and guaranteed escrow checkout.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by crop name (e.g. Red Onion, Turmeric, Tomato, Mandi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Grid */}
      <div className="produce-grid">
        {filteredListings.map((item) => (
          <div key={item.id} className="produce-card">
            <div className="card-img-wrapper">
              <img src={item.imageUrl} alt={item.title} className="card-img" />
              <div className="card-badge-container">
                <span className="card-badge grade">{item.qualityGrade}</span>
                {item.ondcVerified && (
                  <span className="card-badge" style={{ background: '#047857' }}>
                    ONDC Verified
                  </span>
                )}
              </div>
            </div>

            <div className="card-body">
              {/* Farmer Info */}
              <div className="farmer-row">
                <img
                  src={item.farmer.avatarUrl}
                  alt={item.farmer.name}
                  className="farmer-avatar"
                />
                <div>
                  <span className="farmer-name">{item.farmer.name}</span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {item.farmer.farmName} • Rating ⭐ {item.farmer.rating}
                  </div>
                </div>
              </div>

              {/* Crop Title */}
              <h3 className="card-title">{item.title}</h3>

              {/* Pricing */}
              <div className="price-row">
                <div>
                  <span className="price-main">₹{item.pricePerQuintal}</span>
                  <span className="price-unit"> / Quintal</span>
                </div>
                <span className="price-unit">(₹{item.pricePerUnit}/kg)</span>
                <span className="apmc-ref" title="Current APMC benchmark price">
                  APMC Benchmark ₹{item.apmcBenchmarkPrice}
                </span>
              </div>

              {/* Key details */}
              <div className="details-list">
                <div className="detail-item">
                  <MapPin size={13} /> {item.location}
                </div>
                <div className="detail-item">
                  <Scale size={13} /> Stock: {item.quantityAvailable} Qtl (MOQ: {item.minOrderQuantity} Qtl)
                </div>
                <div className="detail-item">
                  <Calendar size={13} /> Harvest: {item.harvestDate}
                </div>
              </div>

              {/* Action buttons */}
              <div className="card-actions">
                <button
                  className="btn-outline"
                  onClick={() => onRequestQuote(item)}
                  title="Submit custom volume price offer to farmer"
                >
                  <MessageSquare size={15} /> Request Quote
                </button>
                <button
                  className="btn-primary"
                  onClick={() => onAddToCart(item)}
                  title="Add to direct wholesale procurement cart"
                >
                  <ShoppingCart size={15} /> Buy Bulk
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
