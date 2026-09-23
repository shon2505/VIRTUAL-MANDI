import React, { useState } from 'react';
import { FarmerProfile, ProduceListing, QuoteRequest, Order, OrderStatus } from '../types';
import { PlusCircle, ShieldCheck, TrendingUp, Package, MessageSquare, Check, X, Trash2, Truck, CheckCircle2, MapPin, Clock, Tractor, Info } from 'lucide-react';

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
  const [activeMainTab, setActiveMainTab] = useState('Farm Dashboard');

  const mainTabs = ['Farm Dashboard', 'Logistics & Orders', 'APMC Trends'];

  const farmerListings = listings.filter((l) => l.farmer.id === farmer.id);
  const pendingQuotes = quotes.filter((q) => q.status === 'Pending');
  const activeOrders = orders.filter((o) => o.farmerId === farmer.id || o.farmerName === farmer.name);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Approval':
      case 'Pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-amber-50 text-amber-700 border border-amber-200">{status}</span>;
      case 'In Logistics Transit':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-sky-50 text-sky-700 border border-sky-200">{status}</span>;
      case 'Delivered':
      case 'Accepted':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{status}</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-rose-50 text-rose-700 border border-rose-200">{status}</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-slate-50 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* Secondary Nav Row */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-6 overflow-x-auto no-scrollbar">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab)}
                  className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeMainTab === tab
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
              <img src={farmer.avatarUrl} alt={farmer.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
              <span className="text-sm font-medium text-slate-700">{farmer.name}</span>
              <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Farmer</span>
            </div>
          </div>
        </div>
      </div>

      {activeMainTab === 'Farm Dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Profile Header Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 relative shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
              
              <div className="flex items-center gap-5">
                <img src={farmer.avatarUrl} alt={farmer.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{farmer.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-blue-200 bg-white text-[0.65rem] font-bold text-blue-600 uppercase tracking-wider">
                      <ShieldCheck size={10} /> KYC Verified Seller
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-3">
                    {farmer.farmName} <span className="mx-1">•</span> {farmer.location.village}, {farmer.location.district} ({farmer.location.mandiHub})
                  </p>
                  
                  {/* Thin Stat Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                    <div>Landholding <strong className="text-slate-800 ml-1">{farmer.landholdingAcres} Acres</strong></div>
                    <div className="w-px h-3 bg-slate-300 hidden sm:block"></div>
                    <div>Orders Fulfilled <strong className="text-slate-800 ml-1">{farmer.completedOrders}</strong></div>
                    <div className="w-px h-3 bg-slate-300 hidden sm:block"></div>
                    <div>Rating ⭐ <strong className="text-slate-800 ml-1">{farmer.rating}</strong></div>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={onOpenAddModal}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <PlusCircle size={16} /> Post New Crop Listing
                </button>
              </div>

            </div>
          </div>

          {/* Stat Card Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl font-bold text-slate-900">{activeOrders.length}</div>
                <Package size={18} className="text-slate-400" />
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Buyer Orders</div>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl font-bold text-slate-900">{farmerListings.length}</div>
                <Tractor size={18} className="text-slate-400" />
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Harvest Listings</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl font-bold text-slate-900">{pendingQuotes.length}</div>
                <MessageSquare size={18} className="text-slate-400" />
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Quotes</div>
            </div>

            <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-5 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <TrendingUp size={80} className="text-blue-600" />
              </div>
              <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="text-3xl font-bold text-blue-700 tracking-tight">₹3.86 L</div>
              </div>
              <div className="text-xs font-bold text-blue-600/80 uppercase tracking-wider relative z-10">Total Mandi Revenue</div>
            </div>
          </div>

          {/* Data Tables Section */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            
            {/* Table Sub-navigation */}
            <div className="border-b border-slate-200 px-4">
              <div className="flex space-x-6 overflow-x-auto no-scrollbar">
                <button
                  className={`py-3 px-1 inline-flex items-center gap-1.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Clock size={14} /> Buyer Orders Queue <span className="ml-1 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[0.65rem] border border-slate-200">{activeOrders.length}</span>
                </button>
                <button
                  className={`py-3 px-1 inline-flex items-center gap-1.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === 'listings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('listings')}
                >
                  <Package size={14} /> My Produce Listings <span className="ml-1 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[0.65rem] border border-slate-200">{farmerListings.length}</span>
                </button>
                <button
                  className={`py-3 px-1 inline-flex items-center gap-1.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === 'quotes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('quotes')}
                >
                  <MessageSquare size={14} /> B2B Price Offers <span className="ml-1 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[0.65rem] border border-slate-200">{quotes.length}</span>
                </button>
              </div>
            </div>

            <div className="p-0 sm:p-4">
              {/* --- Incoming Buyer Orders Queue --- */}
              {activeTab === 'orders' && (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                      <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Order Number</th>
                          <th className="px-4 py-3">Produce</th>
                          <th className="px-4 py-3">Buyer Company</th>
                          <th className="px-4 py-3">Quantity</th>
                          <th className="px-4 py-3">Total Value</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-900">{ord.orderNumber}</td>
                            <td className="px-4 py-3 font-medium text-slate-700">{ord.cropTitle}</td>
                            <td className="px-4 py-3">{ord.buyerCompany}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{ord.quantity} Qtl</td>
                            <td className="px-4 py-3 font-bold text-slate-900">₹{ord.totalAmount.toLocaleString()}</td>
                            <td className="px-4 py-3">{getStatusBadge(ord.status)}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end items-center gap-2">
                                {ord.status === 'Pending Approval' && (
                                  <button
                                    onClick={() => onUpdateOrderStatus(ord.id, 'Confirmed')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                                  >
                                    <Check size={12} /> Accept
                                  </button>
                                )}
                                {(ord.status === 'Pending Approval' || ord.status === 'Confirmed') && (
                                  <button
                                    onClick={() => onUpdateOrderStatus(ord.id, 'In Logistics Transit')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors"
                                  >
                                    <Truck size={12} /> Dispatch
                                  </button>
                                )}
                                {ord.status === 'In Logistics Transit' && (
                                  <button
                                    onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900 transition-colors"
                                  >
                                    <CheckCircle2 size={12} /> Delivered
                                  </button>
                                )}
                                {ord.status === 'Delivered' && (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                    <Check size={12} /> Escrow Released
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {activeOrders.length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No active orders found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Card View */}
                  <div className="md:hidden flex flex-col gap-3 p-3">
                    {activeOrders.map((ord) => (
                      <div key={ord.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative">
                        <div className="absolute top-4 right-4">{getStatusBadge(ord.status)}</div>
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5 pr-20">{ord.orderNumber}</h4>
                        <p className="text-sm font-semibold text-slate-700 mb-4">{ord.cropTitle}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Buyer</div>
                            <div className="text-xs font-medium text-slate-700 truncate">{ord.buyerCompany}</div>
                          </div>
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Quantity</div>
                            <div className="text-xs font-semibold text-slate-800">{ord.quantity} Qtl</div>
                          </div>
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Total Value</div>
                            <div className="text-xs font-bold text-slate-900">₹{ord.totalAmount.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                          {ord.status === 'Pending Approval' && (
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'Confirmed')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex-1 justify-center"
                            >
                              <Check size={12} /> Accept
                            </button>
                          )}
                          {(ord.status === 'Pending Approval' || ord.status === 'Confirmed') && (
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'In Logistics Transit')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 transition-colors flex-1 justify-center"
                            >
                              <Truck size={12} /> Dispatch
                            </button>
                          )}
                          {ord.status === 'In Logistics Transit' && (
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900 transition-colors flex-1 justify-center"
                            >
                              <CheckCircle2 size={12} /> Delivered
                            </button>
                          )}
                          {ord.status === 'Delivered' && (
                            <span className="inline-flex items-center justify-center w-full gap-1 text-xs font-bold text-emerald-600 py-1.5">
                              <Check size={12} /> Escrow Released
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {activeOrders.length === 0 && (
                      <div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg">No active orders found.</div>
                    )}
                  </div>
                </>
              )}

              {/* --- Produce Listings Table --- */}
              {activeTab === 'listings' && (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                      <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Crop Listing</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Stock Available</th>
                          <th className="px-4 py-3">Price / Qtl</th>
                          <th className="px-4 py-3">APMC Benchmark</th>
                          <th className="px-4 py-3">Quality</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {farmerListings.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-800">{item.title}</td>
                            <td className="px-4 py-3">{item.category}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{item.quantityAvailable} Qtl</td>
                            <td className="px-4 py-3 font-bold text-slate-900">₹{item.pricePerQuintal.toLocaleString()}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">₹{item.apmcBenchmarkPrice.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded border border-slate-200 bg-white text-xs font-semibold text-slate-600">{item.qualityGrade}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => onDeleteListing(item.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 rounded text-xs font-semibold hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards */}
                  <div className="md:hidden flex flex-col gap-3 p-3">
                    {farmerListings.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative">
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-0.5 rounded border border-slate-200 bg-white text-[0.65rem] font-semibold text-slate-600">{item.qualityGrade}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 pr-20">{item.title}</h4>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Stock</div>
                            <div className="text-xs font-semibold text-slate-800">{item.quantityAvailable} Qtl</div>
                          </div>
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Price</div>
                            <div className="text-xs font-bold text-slate-900">₹{item.pricePerQuintal.toLocaleString()}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">APMC Benchmark</div>
                            <div className="text-xs text-slate-500">₹{item.apmcBenchmarkPrice.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => onDeleteListing(item.id)}
                            className="inline-flex items-center justify-center w-full gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 rounded text-xs font-semibold hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={12} /> Remove Listing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* --- B2B Received Quotes --- */}
              {activeTab === 'quotes' && (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                      <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Buyer Company</th>
                          <th className="px-4 py-3">Target Crop</th>
                          <th className="px-4 py-3">Requested Qty</th>
                          <th className="px-4 py-3">Offered Price / Qtl</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quotes.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-900">{q.buyerCompany}</div>
                              <div className="text-xs text-slate-500">{q.buyerName}</div>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-700">{q.cropTitle}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{q.requestedQty} Qtl</td>
                            <td className="px-4 py-3 font-bold text-slate-900">₹{q.offeredPricePerQuintal.toLocaleString()}</td>
                            <td className="px-4 py-3">{getStatusBadge(q.status)}</td>
                            <td className="px-4 py-3 text-right">
                              {q.status === 'Pending' ? (
                                <div className="flex justify-end items-center gap-2">
                                  <button
                                    onClick={() => onAcceptQuote(q.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                                  >
                                    <Check size={12} /> Accept
                                  </button>
                                  <button
                                    onClick={() => onRejectQuote(q.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
                                  >
                                    <X size={12} /> Decline
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs font-medium text-slate-400">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards */}
                  <div className="md:hidden flex flex-col gap-3 p-3">
                    {quotes.map((q) => (
                      <div key={q.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative">
                        <div className="absolute top-4 right-4">{getStatusBadge(q.status)}</div>
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5 pr-20">{q.buyerCompany}</h4>
                        <p className="text-xs font-medium text-slate-500 mb-4">{q.cropTitle}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Requested</div>
                            <div className="text-xs font-semibold text-slate-800">{q.requestedQty} Qtl</div>
                          </div>
                          <div>
                            <div className="text-[0.65rem] uppercase font-bold text-slate-400 mb-0.5">Offer Price</div>
                            <div className="text-xs font-bold text-slate-900">₹{q.offeredPricePerQuintal.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                          {q.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => onAcceptQuote(q.id)}
                                className="inline-flex flex-1 justify-center items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                              >
                                <Check size={12} /> Accept
                              </button>
                              <button
                                onClick={() => onRejectQuote(q.id)}
                                className="inline-flex flex-1 justify-center items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
                              >
                                <X size={12} /> Decline
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-medium text-slate-400 w-full text-center py-1.5">Processed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Placeholders for main secondary tabs */}
      {activeMainTab === 'Logistics & Orders' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <Truck size={48} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Logistics Control Tower</h2>
          <p className="text-slate-500 max-w-md text-sm">Real-time GPS tracking and waybill management for dispatched orders.</p>
        </div>
      )}

      {activeMainTab === 'APMC Trends' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <TrendingUp size={48} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Mandi Analytics</h2>
          <p className="text-slate-500 max-w-md text-sm">Commodity price forecasting and historical APMC rates.</p>
        </div>
      )}
    </div>
  );
};
