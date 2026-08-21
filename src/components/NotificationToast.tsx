import React from 'react';
import { ToastMessage } from '../types';
import { Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxWidth: '380px',
        width: '100%',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
            borderLeft: `4px solid ${
              toast.type === 'success' ? '#10b981' : toast.type === 'warning' ? '#f59e0b' : '#3b82f6'
            }`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ marginTop: '2px', color: toast.type === 'success' ? '#34d399' : '#60a5fa' }}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <Bell size={18} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
              {toast.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1px' }}>
              {toast.description}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
              {toast.timestamp}
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
