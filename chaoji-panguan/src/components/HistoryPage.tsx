'use client';

import Link from 'next/link';
import { HistoryItem } from '@/types';

interface HistoryPageProps {
  history: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
}

export default function HistoryPage({ history, onItemClick }: HistoryPageProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getWinnerText = (winner: 'partyA' | 'partyB' | 'draw') => {
    return winner === 'partyA' ? '甲方胜' : winner === 'partyB' ? '乙方胜' : '平局';
  };

  return (
    <div className="page active" style={{ paddingTop: '20px', position: 'relative', zIndex: 1 }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px' 
      }}>
        <Link href="/" style={{ 
          background: 'none', 
          border: 'none', 
          color: '#D4AF37', 
          fontSize: '15px', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          textDecoration: 'none'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </Link>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>历史记录</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1" style={{ margin: '0 auto 20px', opacity: 0.5 }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <p style={{ color: '#666', fontSize: '14px' }}>暂无历史记录</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              style={{
                background: '#333',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '12px' 
              }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{formatDate(item.date)}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  background: item.winner === 'partyA' ? 'rgba(196, 30, 58, 0.2)' : 
                              item.winner === 'partyB' ? 'rgba(102, 102, 102, 0.2)' : 'rgba(212, 175, 55, 0.2)',
                  color: item.winner === 'partyA' ? '#FF6B6B' : 
                         item.winner === 'partyB' ? '#F5F5F5' : '#D4AF37'
                }}>
                  {getWinnerText(item.winner)}
                </span>
              </div>
              <p style={{ 
                fontSize: '13px', 
                color: '#666',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.preview}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
