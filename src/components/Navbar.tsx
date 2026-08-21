import React from 'react';
import { UserRole } from '../types';
import { Sprout, ShieldCheck, ShoppingBag, Store, UserCheck, TrendingUp, PackageCheck, Bell } from 'lucide-react';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: 'marketplace' | 'orders' | 'analytics';
  setActiveTab: (tab: 'marketplace' | 'orders' | 'analytics') => void;
  cartCount: number;
  onOpenCart: () => void;
  notificationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  notificationCount,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => setActiveTab('marketplace')}>
          <div className="brand-icon">
            <Sprout size={24} />
          </div>
          <div>
            <span className="brand-title">Virtual Mandi</span>
            <div style={{ marginTop: '2px' }}>
              <span className="ondc-pill">
                <ShieldCheck size={12} /> ONDC Agri-Network Sync
              </span>
            </div>
          </div>
        </div>

        {/* Role Switcher Pill with Active User Session */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div className="role-switcher">
            <button
              className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
              onClick={() => setRole('buyer')}
            >
              <Store size={15} />
              Buyer Session
            </button>
            <button
              className={`role-btn ${role === 'farmer' ? 'active' : ''}`}
              onClick={() => setRole('farmer')}
            >
              <UserCheck size={15} />
              Farmer Session
            </button>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
            Active Profile: {role === 'buyer' ? '🏢 Metro Wholesale Traders' : '👨‍🌾 Ramesh Patil (Niphad Farms)'}
          </div>
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          <button
            className={`nav-link-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <Store size={16} />
            {role === 'farmer' ? 'Farm Dashboard' : 'Marketplace'}
          </button>

          <button
            className={`nav-link-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <PackageCheck size={16} />
            Logistics & Orders
          </button>

          <button
            className={`nav-link-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={16} />
            APMC Trends
          </button>

          {role === 'buyer' && (
            <button className="cart-badge-btn" onClick={onOpenCart} title="View Wholesale Procurement Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          )}

          {notificationCount > 0 && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#059669' }}>
              <Bell size={20} />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#059669',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {notificationCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
