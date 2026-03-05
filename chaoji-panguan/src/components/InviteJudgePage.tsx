'use client';

import { useState, useEffect } from 'react';
import { Judge } from '@/types';

interface InviteJudgePageProps {
  onRandomInvite: () => void;
  onFriendInvite: () => void;
  onSkip: () => void;
}

export default function InviteJudgePage({ onRandomInvite, onFriendInvite, onSkip }: InviteJudgePageProps) {
  const [registeredJudges, setRegisteredJudges] = useState<Judge[]>([]);

  useEffect(() => {
    // 获取已注册的判官
    const savedJudges = localStorage.getItem('registered-judges');
    if (savedJudges) {
      try {
        setRegisteredJudges(JSON.parse(savedJudges));
      } catch (e) {
        console.error('Failed to parse judges:', e);
      }
    }
  }, []);

  return (
    <div className="page active" style={{ paddingTop: '40px', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧑‍⚖️</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>
          邀请判官
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          可以邀请真人判官来裁决，AI会提供判决建议
        </p>
      </div>

      {/* 随机判官 */}
      <div 
        onClick={onRandomInvite}
        style={{
          background: 'linear-gradient(135deg, #333, #1A1A1A)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px',
          border: '2px solid #444',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            🎲
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
              随机判官
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              系统随机分配一位真人判官
            </div>
          </div>
          <div style={{ color: '#D4AF37', fontSize: '20px' }}>→</div>
        </div>
      </div>

      {/* 好友判官 */}
      <div 
        onClick={onFriendInvite}
        style={{
          background: 'linear-gradient(135deg, #333, #1A1A1A)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px',
          border: '2px solid #444',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #64B5F6, #1976D2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            👥
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
              邀请好友
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              邀请指定好友担任判官
            </div>
          </div>
          <div style={{ color: '#64B5F6', fontSize: '20px' }}>→</div>
        </div>
      </div>

      {/* 已注册的判官列表 */}
      {registeredJudges.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginBottom: '12px' }}>
            可用判官 ({registeredJudges.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {registeredJudges.slice(0, 3).map((judge) => (
              <div 
                key={judge.id}
                style={{
                  background: '#333',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #444'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {judge.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    {judge.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {judge.bio || '职业判官'}
                  </div>
                </div>
                <button style={{
                  padding: '6px 14px',
                  background: '#D4AF37',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#1A1A1A',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  邀请
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 跳过 */}
      <button onClick={onSkip} style={{
        width: '100%',
        height: '50px',
        background: 'transparent',
        border: '2px solid #444',
        borderRadius: '25px',
        color: '#666',
        fontSize: '15px',
        cursor: 'pointer',
        marginTop: '16px'
      }}>
        跳过，使用AI判官
      </button>
    </div>
  );
}
