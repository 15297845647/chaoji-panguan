'use client';

import { JudgmentMode } from '@/types';

interface ModePageProps {
  selectedMode: JudgmentMode;
  onModeSelect: (mode: JudgmentMode) => void;
  onContinue: () => void;
}

export default function ModePage({ selectedMode, onModeSelect, onContinue }: ModePageProps) {
  return (
    <div className="page active" style={{ paddingTop: '40px', position: 'relative', zIndex: 1 }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>
          选择评判模式
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          匿名模式下不显示用户身份
        </p>
      </div>

      <div className="mode-cards" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div 
          className={`mode-card ${selectedMode === 'anonymous' ? 'selected' : ''}`}
          onClick={() => onModeSelect('anonymous')}
          style={{
            background: 'linear-gradient(135deg, #333 0%, #1A1A1A 100%)',
            border: `2px solid ${selectedMode === 'anonymous' ? '#D4AF37' : '#666'}`,
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: selectedMode === 'anonymous' ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#8B0000'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>匿名模式</span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: `2px solid ${selectedMode === 'anonymous' ? '#D4AF37' : '#666'}`,
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedMode === 'anonymous' && (
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#D4AF37' }} />
              )}
            </div>
          </div>
          <p style={{ color: '#666', fontSize: '13px' }}>笑看风云，不透露身份</p>
        </div>

        <div 
          className={`mode-card ${selectedMode === 'realname' ? 'selected' : ''}`}
          onClick={() => onModeSelect('realname')}
          style={{
            background: 'linear-gradient(135deg, #333 0%, #1A1A1A 100%)',
            border: `2px solid ${selectedMode === 'realname' ? '#D4AF37' : '#666'}`,
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: selectedMode === 'realname' ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#D4AF37'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1A1A1A">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>实名模式</span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: `2px solid ${selectedMode === 'realname' ? '#D4AF37' : '#666'}`,
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedMode === 'realname' && (
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#D4AF37' }} />
              )}
            </div>
          </div>
          <p style={{ color: '#666', fontSize: '13px' }}>愿赌服输，显示双方昵称</p>
        </div>
      </div>

      <button onClick={onContinue} style={{
        width: '100%',
        height: '56px',
        background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 100%)',
        border: 'none',
        borderRadius: '28px',
        color: '#1A1A1A',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '40px',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
      }}>
        继续
      </button>
    </div>
  );
}
