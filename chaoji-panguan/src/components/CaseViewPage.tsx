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

interface CaseViewPageProps {
  caseId: string;
  judge: Judge;
  onBack: () => void;
  onSubmitJudgment: (caseId: string, judgment: JudgmentSuggestion) => void;
}

export default function CaseViewPage({ caseId, judge, onBack, onSubmitJudgment }: CaseViewPageProps) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [activeTab, setActiveTab] = useState<'dialog' | 'ai-suggestion' | 'adjust'>('dialog');
  const [editedSuggestion, setEditedSuggestion] = useState<JudgmentSuggestion | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // 从 localStorage 加载案件
    const savedCases = localStorage.getItem('judge-cases');
    if (savedCases) {
      try {
        const cases: Case[] = JSON.parse(savedCases);
        const foundCase = cases.find(c => c.id === caseId);
        if (foundCase) {
          setCaseData(foundCase);
          if (foundCase.aiSuggestion) {
            setEditedSuggestion({ ...foundCase.aiSuggestion });
          }
        }
      } catch (e) {
        console.error('Failed to parse cases:', e);
      }
    }
  }, [caseId]);

  if (!caseData) {
    return (
      <div className="page active" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: '#666' }}>案件加载中...</div>
      </div>
    );
  }

  const handleWinnerSelect = (winner: 'partyA' | 'partyB' | 'draw') => {
    if (editedSuggestion) {
      setEditedSuggestion({
        ...editedSuggestion,
        winner,
        winnerName: winner === 'draw' ? '平局' : winner === 'partyA' ? caseData.partyAName : caseData.partyBName
      });
    }
  };

  const handleSubmit = () => {
    if (editedSuggestion && caseData) {
      setShowConfirmModal(true);
    }
  };

  const confirmSubmit = () => {
    if (editedSuggestion && caseData) {
      onSubmitJudgment(caseId, editedSuggestion);
    }
  };

  return (
    <div className="page active" style={{ paddingTop: '20px', position: 'relative', zIndex: 1 }}>
      {/* 顶部信息 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <button onClick={onBack} style={{
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #444',
          borderRadius: '8px',
          color: '#888',
          fontSize: '13px',
          cursor: 'pointer'
        }}>
          ← 返回
        </button>
        <div style={{ 
          fontSize: '14px', 
          color: caseData.status === 'pending' ? '#D4AF37' : 
                 caseData.status === 'judging' ? '#64B5F6' : '#4CAF50' 
        }}>
          {caseData.status === 'pending' ? '待裁决' : 
           caseData.status === 'judging' ? '裁决中' : '已完成'}
        </div>
      </div>

      {/* 案件信息 */}
      <div style={{
        background: 'linear-gradient(135deg, #333, #1A1A1A)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        border: '2px solid #D4AF37'
      }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', textAlign: 'center' }}>
          {caseData.partyAName} <span style={{ color: '#D4AF37' }}>VS</span> {caseData.partyBName}
        </div>
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '8px' }}>
          {new Date(caseData.createdAt).toLocaleString('zh-CN')}
        </div>
      </div>

      {/* Tab 切换 */}
      <div style={{ 
        display: 'flex', 
        background: '#333', 
        borderRadius: '12px', 
        padding: '4px',
        marginBottom: '16px'
      }}>
        <button 
          onClick={() => setActiveTab('dialog')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'dialog' ? '#D4AF37' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: activeTab === 'dialog' ? '#1A1A1A' : '#888',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          对话记录
        </button>
        <button 
          onClick={() => setActiveTab('ai-suggestion')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'ai-suggestion' ? '#D4AF37' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: activeTab === 'ai-suggestion' ? '#1A1A1A' : '#888',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          AI 建议
        </button>
        <button 
          onClick={() => setActiveTab('adjust')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'adjust' ? '#D4AF37' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: activeTab === 'adjust' ? '#1A1A1A' : '#888',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          调整判决
        </button>
      </div>

      {/* 对话记录 */}
      {activeTab === 'dialog' && (
        <div style={{ marginBottom: '80px' }}>
          {caseData.messages.map((msg, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'partyA' ? 'flex-start' : 'flex-end',
                marginBottom: '12px'
              }}
            >
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginBottom: '4px',
                marginLeft: msg.sender === 'partyA' ? '0' : 'auto'
              }}>
                {msg.sender === 'partyA' ? caseData.partyAName : caseData.partyBName} · {msg.time}
              </div>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: msg.sender === 'partyA' ? '#333' : '#8B0000',
                color: '#fff',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI 建议 */}
      {activeTab === 'ai-suggestion' && caseData.aiSuggestion && (
        <div style={{ marginBottom: '80px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1A3A5C, #0D2137)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            border: '1px solid #64B5F6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#64B5F6' }}>AI 判决建议</span>
            </div>
            
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: caseData.aiSuggestion.winner === 'partyA' ? '#4CAF50' : 
                     caseData.aiSuggestion.winner === 'partyB' ? '#F44336' : '#D4AF37',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {caseData.aiSuggestion.winner === 'draw' ? '🤝 平局' : 
               `👑 胜者: ${caseData.aiSuggestion.winnerName}`}
            </div>
            
            <div style={{ fontSize: '14px', color: '#fff', marginBottom: '16px', lineHeight: '1.6' }}>
              {caseData.aiSuggestion.subtitle}
            </div>

            <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
              {caseData.aiSuggestion.reason}
            </div>

            {/* 维度评分 */}
            {caseData.aiSuggestion.dimensions && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                  评分维度
                </div>
                {caseData.aiSuggestion.dimensions.map((dim, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: '1px solid #333'
                  }}>
                    <span style={{ color: '#888', fontSize: '13px' }}>{dim.label}</span>
                    <span style={{ 
                      color: dim.score === 'good' ? '#4CAF50' : 
                             dim.score === 'medium' ? '#FFC107' : '#F44336',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {dim.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 调整判决 */}
      {activeTab === 'adjust' && editedSuggestion && (
        <div style={{ marginBottom: '80px' }}>
          {/* 选择胜者 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginBottom: '12px' }}>
              选择胜者
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleWinnerSelect('partyA')}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: editedSuggestion.winner === 'partyA' ? '#4CAF50' : '#333',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {caseData.partyAName}
              </button>
              <button 
                onClick={() => handleWinnerSelect('draw')}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: editedSuggestion.winner === 'draw' ? '#D4AF37' : '#333',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                平局
              </button>
              <button 
                onClick={() => handleWinnerSelect('partyB')}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: editedSuggestion.winner === 'partyB' ? '#F44336' : '#333',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {caseData.partyBName}
              </button>
            </div>
          </div>

          {/* 副标题 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginBottom: '8px' }}>
              简评
            </div>
            <textarea
              value={editedSuggestion.subtitle}
              onChange={(e) => setEditedSuggestion({ ...editedSuggestion, subtitle: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: '#333',
                border: '1px solid #444',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px',
                minHeight: '60px',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* 详细理由 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginBottom: '8px' }}>
              详细理由
            </div>
            <textarea
              value={editedSuggestion.reason}
              onChange={(e) => setEditedSuggestion({ ...editedSuggestion, reason: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: '#333',
                border: '1px solid #444',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px',
                minHeight: '120px',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* 预览调整后的判决 */}
          <div style={{
            background: 'linear-gradient(135deg, #333, #1A1A1A)',
            borderRadius: '16px',
            padding: '20px',
            border: '2px solid #D4AF37',
            marginBottom: '80px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#D4AF37', marginBottom: '12px' }}>
              📋 您的判决（预览）
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: editedSuggestion.winner === 'partyA' ? '#4CAF50' : 
                     editedSuggestion.winner === 'partyB' ? '#F44336' : '#D4AF37',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {editedSuggestion.winner === 'draw' ? '🤝 平局' : `👑 胜者: ${editedSuggestion.winnerName}`}
            </div>
            <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px' }}>
              {editedSuggestion.subtitle}
            </div>
            <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
              {editedSuggestion.reason.substring(0, 100)}...
            </div>
          </div>
        </div>
      )}

      {/* 底部按钮 */}
      {caseData.status !== 'completed' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          background: 'linear-gradient(180deg, transparent, #1A1A1A 20%)',
          display: 'flex',
          gap: '12px'
        }}>
          <button onClick={onBack} style={{
            flex: 1,
            padding: '14px',
            background: '#333',
            border: 'none',
            borderRadius: '12px',
            color: '#888',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            返回
          </button>
          <button onClick={handleSubmit} style={{
            flex: 2,
            padding: '14px',
            background: '#D4AF37',
            border: 'none',
            borderRadius: '12px',
            color: '#1A1A1A',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            提交判决
          </button>
        </div>
      )}

      {/* 确认弹窗 */}
      {showConfirmModal && (
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
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚖️</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#D4AF37' }}>
                确认提交判决？
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                提交后将被邀请的用户查看
              </div>
            </div>

            <button onClick={confirmSubmit} style={{
              width: '100%',
              padding: '14px',
              background: '#D4AF37',
              border: 'none',
              borderRadius: '12px',
              color: '#1A1A1A',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px'
            }}>
              确认提交
            </button>

            <button onClick={() => setShowConfirmModal(false)} style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '1px solid #666',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              返回修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
