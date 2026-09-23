import React from 'react';
import { UserRole } from '../types';
import { Sprout, ShieldCheck, ShoppingBag, Store, UserCheck, TrendingUp, PackageCheck, Bell, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  notificationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  notificationCount,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggedIn } = useAuth();
  const currentPath = location.pathname;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon" style={{ background: 'transparent', width: '32px', height: '32px' }}>
            <img src="/favicon.jpg" alt="Virtual Mandi" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
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

        {/* User Session Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}>
          {isLoggedIn && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              {user.role === 'farmer' ? <UserCheck size={14} className="text-emerald-600" /> : <Store size={14} className="text-blue-600" />}
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                {user.name} <span className="text-slate-400 font-normal">({user.role === 'farmer' ? 'Farmer' : 'Bulk Buyer'})</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
              Welcome to Virtual Mandi
            </div>
          )}
        </div>

        {/* Nav Actions */}
        <div className="nav-actions flex items-center gap-2">
          <LanguageSelector />
          {isLoggedIn ? (
            <>
              <button
                className={`nav-link-btn ${currentPath === '/marketplace' || currentPath === '/farmer/dashboard' ? 'active' : ''}`}
                onClick={() => navigate(user?.role === 'farmer' ? '/farmer/dashboard' : '/marketplace')}
              >
                <Store size={16} />
                {user?.role === 'farmer' ? 'Farm Dashboard' : 'Marketplace'}
              </button>

              <button
                className={`nav-link-btn ${currentPath === '/orders' ? 'active' : ''}`}
                onClick={() => navigate('/orders')}
              >
                <PackageCheck size={16} />
                Logistics & Orders
              </button>

              <button
                className={`nav-link-btn ${currentPath === '/analytics' ? 'active' : ''}`}
                onClick={() => navigate('/analytics')}
              >
                <TrendingUp size={16} />
                APMC Trends
              </button>

              {user?.role === 'buyer' && (
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

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-red-600 ml-2 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-emerald-600">Login</button>
              <button onClick={() => navigate('/signup')} className="text-sm font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 shadow-sm">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
