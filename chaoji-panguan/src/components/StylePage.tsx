'use client';

import { JudgmentStyle, JudgmentStyles, JudgmentStyleOption } from '@/types';

interface StylePageProps {
  selectedStyle: JudgmentStyle;
  onStyleSelect: (style: JudgmentStyle) => void;
  onContinue: () => void;
}

export default function StylePage({ selectedStyle, onStyleSelect, onContinue }: StylePageProps) {
  return (
    <div className="page active" style={{ paddingTop: '40px', position: 'relative', zIndex: 1 }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>
          选择判官风格
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          不同风格，判决体验大不同
        </p>
      </div>

      <div className="style-cards" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {JudgmentStyles.map((style: JudgmentStyleOption) => (
          <div 
            key={style.id}
            className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
            onClick={() => onStyleSelect(style.id)}
            style={{
              background: 'linear-gradient(135deg, #333 0%, #1A1A1A 100%)',
              border: `2px solid ${selectedStyle === style.id ? '#D4AF37' : '#444'}`,
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedStyle === style.id ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              fontSize: '32px',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: selectedStyle === style.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
              borderRadius: '12px'
            }}>
              {style.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px', color: selectedStyle === style.id ? '#D4AF37' : '#fff' }}>
                {style.name}
              </div>
              <div style={{ fontSize: '13px', color: '#888' }}>
                {style.description}
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: `2px solid ${selectedStyle === style.id ? '#D4AF37' : '#666'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedStyle === style.id && (
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#D4AF37' }} />
              )}
            </div>
          </div>
        ))}
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
        marginTop: '32px',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
      }}>
        开始吵架 🗣️
      </button>
    </div>
  );
}
