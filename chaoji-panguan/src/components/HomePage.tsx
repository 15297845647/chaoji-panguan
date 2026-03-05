'use client';

import Link from 'next/link';

interface HomePageProps {
  onStart: () => void;
  onBecomeJudge: () => void;
}

export default function HomePage({ onStart, onBecomeJudge }: HomePageProps) {
  return (
    <div className="page active" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '60px',
      position: 'relative',
      zIndex: 1
    }}>
      <Link href="/history" className="history-link" style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: '#D4AF37',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        textDecoration: 'none',
        zIndex: 10
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
        历史记录
      </Link>
      
      <div className="logo-container" style={{ marginBottom: '40px', animation: 'float 3s ease-in-out infinite' }}>
        <div className="gavel-icon" style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
          margin: '0 auto 20px'
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#1A1A1A">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L17 8v8l-5 3-5-3V8l5-3.5z"/>
            <path d="M12 8v8M9 10l3-2 3 2"/>
          </svg>
        </div>
        <h1 className="app-title" style={{
          fontSize: '32px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px'
        }}>
          吵架判官
        </h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '60px' }}>
          AI 主持公道，让你心服口服
        </p>
      </div>

      <button className="start-btn" onClick={onStart} style={{
        width: '200px',
        height: '56px',
        background: 'linear-gradient(135deg, #8B0000 0%, #C41E3A 100%)',
        border: 'none',
        borderRadius: '28px',
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(196, 30, 58, 0.5)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        开始评判
      </button>

      <button onClick={onBecomeJudge} style={{
        marginTop: '16px',
        width: '200px',
        height: '44px',
        background: 'transparent',
        border: '2px solid #D4AF37',
        borderRadius: '22px',
        color: '#D4AF37',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        🧑‍⚖️ 成为判官
      </button>
    </div>
  );
}
