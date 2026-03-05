'use client';

import { useState, useEffect } from 'react';
import { Judge, ChatMessage, JudgmentSuggestion } from '@/types';

interface Case {
  id: string;
  partyAName: string;
  partyBName: string;
  messages: ChatMessage[];
  status: 'pending' | 'judging' | 'completed';
  createdAt: string;
  aiSuggestion?: JudgmentSuggestion;
  finalJudgment?: JudgmentSuggestion;
}

interface JudgeDashboardPageProps {
  judge: Judge;
  onBack: () => void;
  onViewCase: (caseId: string) => void;
  onGenerateInviteCode: () => string;
}

export default function JudgeDashboardPage({ judge, onBack, onViewCase, onGenerateInviteCode }: JudgeDashboardPageProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // 从 localStorage 加载案件
    const savedCases = localStorage.getItem('judge-cases');
    if (savedCases) {
      try {
        setCases(JSON.parse(savedCases));
      } catch (e) {
        console.error('Failed to parse cases:', e);
      }
    }
  }, []);

  const pendingCases = cases.filter(c => c.status === 'pending');
  const judgingCases = cases.filter(c => c.status === 'judging');
  const completedCases = cases.filter(c => c.status === 'completed');

  const handleGenerateInvite = () => {
    const code = onGenerateInviteCode();
    setInviteCode(code);
    setShowInviteModal(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}?invite=${inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="page active" style={{ paddingTop: '20px', position: 'relative', zIndex: 1 }}>
      {/* 判官信息 */}
      <div style={{
        background: 'linear-gradient(135deg, #333, #1A1A1A)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '2px solid #D4AF37'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            {judge.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#D4AF37' }}>
              {judge.name}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
              {judge.bio || '专注裁决三十年'} · 已裁决 {completedCases.length} 场
            </div>
          </div>
          <button onClick={onBack} style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #444',
            borderRadius: '8px',
            color: '#888',
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            退出
          </button>
        </div>
      </div>

      {/* 统计 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#333', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>{pendingCases.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>待裁决</div>
        </div>
        <div style={{ background: '#333', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#64B5F6' }}>{judgingCases.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>裁决中</div>
        </div>
        <div style={{ background: '#333', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{completedCases.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>已完成</div>
        </div>
      </div>

      {/* 待裁决案件 */}
      {pendingCases.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#D4AF37', marginBottom: '12px' }}>
            🔥 待裁决 ({pendingCases.length})
          </div>
          {pendingCases.map(c => (
            <div 
              key={c.id}
              onClick={() => onViewCase(c.id)}
              style={{
                background: '#333',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: '1px solid #444'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    {c.partyAName} vs {c.partyBName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {c.messages.length} 条对话 · {new Date(c.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
                <div style={{ color: '#D4AF37', fontSize: '20px' }}>→</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 裁决中案件 */}
      {judgingCases.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#64B5F6', marginBottom: '12px' }}>
            ⚔️ 裁决中 ({judgingCases.length})
          </div>
          {judgingCases.map(c => (
            <div 
              key={c.id}
              onClick={() => onViewCase(c.id)}
              style={{
                background: '#333',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: '1px solid #64B5F6'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    {c.partyAName} vs {c.partyBName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64B5F6', marginTop: '4px' }}>
                    AI 已提供建议，待您确认
                  </div>
                </div>
                <div style={{ color: '#64B5F6', fontSize: '20px' }}>→</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 已完成案件 */}
      {completedCases.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#4CAF50', marginBottom: '12px' }}>
            ✅ 已完成 ({completedCases.length})
          </div>
          {completedCases.slice(0, 5).map(c => (
            <div 
              key={c.id}
              onClick={() => onViewCase(c.id)}
              style={{
                background: '#333',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: '1px solid #444'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    {c.partyAName} vs {c.partyBName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4CAF50', marginTop: '4px' }}>
                    胜者: {c.finalJudgment?.winnerName || '待判定'}
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>查看</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingCases.length === 0 && judgingCases.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😴</div>
          <div style={{ fontSize: '14px' }}>暂无待裁决的案件</div>
          <div style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>
            邀请好友来吵架，你在中间裁决
          </div>
        </div>
      )}

      {/* 邀请好友 */}
      <div style={{
        background: 'linear-gradient(135deg, #8B0000, #C41E3A)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
          🎯 邀请好友来吵
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
          生成邀请码，好友可直接参与
        </div>
        <button onClick={handleGenerateInvite} style={{
          padding: '10px 24px',
          background: '#fff',
          border: 'none',
          borderRadius: '20px',
          color: '#C41E3A',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          生成邀请码
        </button>
      </div>

      {/* 邀请码弹窗 */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#1A1A1A',
            borderRadius: '16px',
            padding: '24px',
            margin: '20px',
            border: '2px solid #D4AF37',
            width: '100%',
            maxWidth: '340px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎫</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#D4AF37' }}>
                邀请码已生成
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                分享给好友，他们可直接加入你的法庭
              </div>
            </div>
            
            <div style={{
              background: '#333',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#D4AF37',
                letterSpacing: '4px',
                fontFamily: 'monospace'
              }}>
                {inviteCode}
              </div>
            </div>

            <button onClick={handleCopyCode} style={{
              width: '100%',
              padding: '12px',
              background: '#D4AF37',
              border: 'none',
              borderRadius: '12px',
              color: '#1A1A1A',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px'
            }}>
              {copySuccess ? '✅ 已复制' : '复制邀请码'}
            </button>

            <button onClick={handleCopyLink} style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #666',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '12px'
            }}>
              复制邀请链接
            </button>

            <button onClick={() => setShowInviteModal(false)} style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
