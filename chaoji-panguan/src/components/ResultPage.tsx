'use client';

import { JudgmentResult } from '@/types';

interface ResultPageProps {
  result: JudgmentResult;
  onShare: () => void;
  onSave: () => void;
  onNewCase: () => void;
}

export default function ResultPage({ result, onShare, onSave, onNewCase }: ResultPageProps) {
  const winnerClass = result.winner === 'partyA' ? 'party-a' : result.winner === 'partyB' ? 'party-b' : 'draw';
  
  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'winner': return '#4CAF50';
      case 'loser': return '#FF6B6B';
      case 'humor': return '#D4AF37';
      case 'wisdom': return '#64B5F6';
      default: return '#fff';
    }
  };

  return (
    <div className="page active" style={{ paddingTop: '20px', position: 'relative', zIndex: 1 }}>
      {/* 随机事件 */}
      {result.randomEvent && (
        <div style={{
          background: 'linear-gradient(135deg, #8B0000 0%, #C41E3A 100%)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease forwards'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎲</div>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{result.randomEvent}</div>
        </div>
      )}

      {/* 判决结果 */}
      <div style={{
        background: 'linear-gradient(135deg, #333 0%, #1A1A1A 100%)',
        border: '2px solid #D4AF37',
        borderRadius: '20px',
        padding: '30px 20px',
        textAlign: 'center',
        marginBottom: '24px',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)',
        animation: 'slideUp 0.4s ease forwards'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 100%)',
          borderRadius: '20px',
          color: '#1A1A1A',
          fontSize: '14px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          判决结果
        </div>
        <div style={{
          fontSize: '36px',
          fontWeight: '900',
          marginBottom: '8px',
          color: result.winner === 'partyA' ? '#FF6B6B' : result.winner === 'partyB' ? '#F5F5F5' : '#D4AF37'
        }}>
          {result.winnerName}
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>{result.subtitle}</div>
      </div>

      {/* 对话重现 */}
      {result.dialogLines && result.dialogLines.length > 0 && (
        <div style={{
          background: '#333',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          animation: 'fadeIn 0.3s ease forwards'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#D4AF37',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            双方发言
          </div>
          {result.dialogLines.map((line, idx) => (
            <div key={idx} style={{
              background: '#1A1A1A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: idx < result.dialogLines!.length - 1 ? '12px' : 0,
              borderLeft: line.speaker === 'partyA' ? '3px solid #FF6B6B' : '3px solid #64B5F6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px' }}>{line.emoji}</span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: line.speaker === 'partyA' ? '#FF6B6B' : '#64B5F6'
                }}>
                  {line.speaker === 'partyA' ? '甲方' : '乙方'}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
                {line.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 判决理由 */}
      <div style={{
        background: '#333',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        animation: 'fadeIn 0.3s ease forwards'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#D4AF37',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          判决理由
        </div>
        <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#fff', textAlign: 'left' }}>
          {result.reason}
        </div>

        {/* 评分维度 */}
        <div style={{ 
          marginTop: '20px', 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px' 
        }}>
          {result.dimensions.map((dim, idx) => (
            <div key={idx} style={{
              background: '#1A1A1A',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{dim.label}</div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: dim.score === 'good' ? '#4CAF50' : dim.score === 'medium' ? '#D4AF37' : '#FF6B6B'
              }}>
                {dim.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 高光时刻 */}
      {result.highlights && result.highlights.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #333 0%, #1A1A1A 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          animation: 'fadeIn 0.3s ease forwards'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#D4AF37',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>✨</span>
            高光时刻
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {result.highlights.map((h, idx) => (
              <span key={idx} style={{
                background: `${getHighlightColor(h.type)}20`,
                border: `1px solid ${getHighlightColor(h.type)}`,
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '13px',
                color: getHighlightColor(h.type)
              }}>
                {h.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 改进建议 */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div style={{
          background: '#333',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          animation: 'fadeIn 0.3s ease forwards'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#D4AF37',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
            </svg>
            改进建议
          </div>
          {result.suggestions.map((s, idx) => (
            <div key={idx} style={{
              background: '#1A1A1A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: idx < result.suggestions!.length - 1 ? '12px' : 0
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#D4AF37', marginBottom: '8px' }}>
                {s.title}
              </div>
              <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
        <button onClick={onShare} style={{
          flex: 1,
          height: '50px',
          borderRadius: '25px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 100%)',
          border: 'none',
          color: '#1A1A1A'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
          分享结果
        </button>
        <button onClick={onSave} style={{
          flex: 1,
          height: '50px',
          borderRadius: '25px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'transparent',
          border: '2px solid #666',
          color: '#fff'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          保存
        </button>
      </div>

      <button onClick={onNewCase} style={{
        width: '100%',
        height: '50px',
        background: 'transparent',
        border: '2px solid #8B0000',
        borderRadius: '25px',
        color: '#8B0000',
        fontSize: '15px',
        fontWeight: '600',
        marginTop: '12px',
        cursor: 'pointer'
      }}>
        再断一案
      </button>
    </div>
  );
}
