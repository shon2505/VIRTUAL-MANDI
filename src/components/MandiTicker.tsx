import React from 'react';
import { MandiRate } from '../types';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface MandiTickerProps {
  rates: MandiRate[];
}

export const MandiTicker: React.FC<MandiTickerProps> = ({ rates }) => {
  return (
    <div className="mandi-ticker-bar">
      <div className="ticker-label">
        <Activity size={14} /> LIVE APMC RATES
      </div>
      <div className="ticker-scroll">
        {rates.map((item) => (
          <div key={item.id} className="ticker-item">
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{item.crop}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>({item.mandi})</span>
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>₹{item.modalPrice}/Qtl</span>
            <span className={`trend-badge ${item.trend}`}>
              {item.trend === 'up' && <TrendingUp size={11} />}
              {item.trend === 'down' && <TrendingDown size={11} />}
              {item.trend === 'stable' && <Minus size={11} />}
              {item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
