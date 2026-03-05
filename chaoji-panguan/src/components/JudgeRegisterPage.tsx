'use client';

import { useState, useEffect } from 'react';
import { Judge, JudgmentStyle, JudgmentStyles } from '@/types';

interface JudgeRegisterPageProps {
  onRegister: (judge: Omit<Judge, 'id' | 'createdAt' | 'totalCases' | 'winRates'>) => void;
  onSkip: () => void;
}

const AVATARS = ['⚖️', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🎩', '🔍', '📜', '🏆'];

export default function JudgeRegisterPage({ onRegister, onSkip }: JudgeRegisterPageProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('⚖️');
  const [bio, setBio] = useState('');
  const [style, setStyle] = useState<JudgmentStyle>('neutral');
  const [step, setStep] = useState<'avatar' | 'info'>('avatar');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入昵称');
      return;
    }
    onRegister({ name: name.trim(), avatar, bio: bio.trim(), style });
  };

  return (
    <div className="page active" style={{ paddingTop: '40px', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧑‍⚖️</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>
          成为判官
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          注册成为真人判官，裁决他人的纷争
        </p>
      </div>

      {step === 'avatar' ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)'
            }}>
              {avatar}
            </div>
            <p style={{ color: '#888', fontSize: '13px' }}>选择你的判官头像</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: avatar === a ? '3px solid #D4AF37' : '2px solid #444',
                  background: avatar === a ? 'rgba(212, 175, 55, 0.2)' : '#333',
                  fontSize: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {a}
              </button>
            ))}
          </div>

          <button onClick={() => setStep('info')} style={{
            width: '100%',
            height: '56px',
            background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)',
            border: 'none',
            borderRadius: '28px',
            color: '#1A1A1A',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer'
          }}>
            下一步 →
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '13px', marginBottom: '8px' }}>
              判官昵称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入昵称"
              maxLength={20}
              style={{
                width: '100%',
                height: '50px',
                background: '#333',
                border: '2px solid #444',
                borderRadius: '12px',
                padding: '0 16px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '13px', marginBottom: '8px' }}>
              个性签名
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="一句话介绍自己"
              maxLength={50}
              style={{
                width: '100%',
                height: '50px',
                background: '#333',
                border: '2px solid #444',
                borderRadius: '12px',
                padding: '0 16px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '13px', marginBottom: '12px' }}>
              判官风格
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {JudgmentStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: style === s.id ? '2px solid #D4AF37' : '2px solid #444',
                    background: style === s.id ? 'rgba(212, 175, 55, 0.2)' : '#333',
                    color: style === s.id ? '#D4AF37' : '#888',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} style={{
            width: '100%',
            height: '56px',
            background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)',
            border: 'none',
            borderRadius: '28px',
            color: '#1A1A1A',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '12px'
          }}>
            注册成为判官
          </button>

          <button onClick={onSkip} style={{
            width: '100%',
            height: '44px',
            background: 'transparent',
            border: 'none',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            暂时跳过
          </button>
        </>
      )}
    </div>
  );
}
