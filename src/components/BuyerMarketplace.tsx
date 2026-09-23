import React, { useState } from 'react';
import { ProduceListing } from '../types';
import { Search, ShieldCheck, MapPin, Calendar, Box, Package, Building2, TrendingUp, Info, Scale, Truck } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('Marketplace');

  const categories = ['All', 'Vegetables', 'Spices', 'Sugar & Jaggery', 'Fruits'];
  const tabs = ['Marketplace', 'Logistics & Orders', 'APMC Trends'];

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmer.location.mandiHub.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Secondary Nav Row */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-6 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Identity Chip */}
            <div className="hidden sm:flex items-center gap-2 py-3">
              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                <Building2 size={12} className="text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Metro Wholesale Traders</span>
              <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Bulk Buyer</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'Marketplace' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header Block */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <ShieldCheck size={14} className="text-blue-600" /> Direct APMC Mandi Procurement
            </div>
            <h1 className="text-3xl md:text-4xl text-slate-900 tracking-tight mb-2">
              <span className="font-medium text-slate-500 block sm:inline">Direct from Indian Farmers.</span>{' '}
              <span className="font-bold">Built for Bulk Procurement.</span>
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
              Source verified produce directly from farm-gates. Transparent pricing, escrow protection, and direct ONDC logistics integrations for scale.
            </p>
          </div>

          {/* Filter/Category Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-shadow"
                placeholder="Search by crop, grade, or APMC hub..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Horizontal Chip Row */}
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-2 pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === cat
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative h-48 bg-slate-100">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  
                  {/* Top Tier: Trust Signals */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.ondcVerified && (
                      <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <ShieldCheck size={12} className="text-blue-600" /> ONDC Verified
                      </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded shadow-sm">
                      {item.qualityGrade}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  {/* Middle Tier: Identity & Title */}
                  <div className="mb-3">
                    <div className="text-xs text-slate-500 mb-1 truncate">
                      {item.farmer.name} • {item.farmer.farmName} • Rating ⭐ {item.farmer.rating}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Price Block */}
                  <div className="mb-5 pb-4 border-b border-slate-100">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-bold text-slate-900 tracking-tight">₹{item.pricePerQuintal.toLocaleString()}</span>
                      <span className="text-sm font-medium text-slate-500 mb-1">/ Quintal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400">(₹{item.pricePerUnit}/kg)</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[0.7rem] font-semibold text-slate-500">
                        <TrendingUp size={10} className="text-blue-500" /> APMC Benchmark ₹{item.apmcBenchmarkPrice}
                      </span>
                    </div>
                  </div>

                  {/* Meta Row: 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 mt-auto">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[0.65rem] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Location</div>
                        <div className="text-xs font-medium text-slate-700 truncate" title={item.location}>{item.location.split(',')[0]}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[0.65rem] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Stock Available</div>
                        <div className="text-xs font-medium text-slate-700">{item.quantityAvailable} Qtl</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Scale size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[0.65rem] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Min Order (MOQ)</div>
                        <div className="text-xs font-medium text-slate-700">{item.minOrderQuantity} Qtl</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[0.65rem] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Harvest Date</div>
                        <div className="text-xs font-medium text-slate-700">{item.harvestDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Row */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() => onRequestQuote(item)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors"
                    >
                      Request Quote
                    </button>
                    <button
                      onClick={() => onAddToCart(item)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Buy Bulk
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-lg">
              <Box size={40} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No listings found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Placeholders for other tabs to keep UI functional */}
      {activeTab === 'Logistics & Orders' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <Truck size={48} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Logistics & Tracking Module</h2>
          <p className="text-slate-500 max-w-md text-sm">Real-time ONDC logistics tracking and waybill management will appear here. Navigate to your global Orders page for current active orders.</p>
        </div>
      )}

      {activeTab === 'APMC Trends' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <TrendingUp size={48} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Market Intelligence</h2>
          <p className="text-slate-500 max-w-md text-sm">Historical APMC pricing charts and predictive volume forecasting models are being generated.</p>
        </div>
      )}
    </div>
  );
};
