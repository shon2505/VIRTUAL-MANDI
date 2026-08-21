import React from 'react';
import { MandiRate } from '../types';
import { TrendingUp, BarChart3, ShieldCheck, Zap, Activity } from 'lucide-react';

interface AnalyticsViewProps {
  rates: MandiRate[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ rates }) => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
          APMC Mandi Intelligence & AI Price Forecasting
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time daily modal rates, historical price movements, and 7-day predictive analytics across major Indian agricultural mandi hubs.
        </p>
      </div>

      {/* Mandi Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {rates.map((r) => (
          <div key={r.id} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{r.mandi}</span>
              <span className={`trend-badge ${r.trend}`}>
                {r.changePct > 0 ? `+${r.changePct}%` : `${r.changePct}%`}
              </span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{r.crop}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
              ₹{r.modalPrice} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>/ Quintal</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Range: ₹{r.minPrice} - ₹{r.maxPrice} • {r.lastUpdated}
            </div>
          </div>
        ))}
      </div>

      {/* AI Market Forecast Insights */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Zap size={20} color="#d97706" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
            7-Day Mandi Price & Arrival Outlook
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#047857', marginBottom: '0.2rem' }}>Lasalgaon Red Onion</div>
            <div style={{ fontSize: '0.82rem', color: '#065f46' }}>
              Predicted Trend: <strong>+3.5% Upward</strong> over next 5 days due to decreased arrivals from Nashik & Pimpalgaon belts.
            </div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#b45309', marginBottom: '0.2rem' }}>Sangli GI Turmeric</div>
            <div style={{ fontSize: '0.82rem', color: '#78350f' }}>
              Predicted Trend: <strong>Stable Range (₹14,200 - ₹14,800)</strong>. Export demand remains consistent with steady stock.
            </div>
          </div>

          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '0.2rem' }}>Narayangaon Tomato</div>
            <div style={{ fontSize: '0.82rem', color: '#0c4a6e' }}>
              Predicted Trend: <strong>High Volatility</strong>. Monsoon harvest spikes likely to stabilize mandi spot rates by weekend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
