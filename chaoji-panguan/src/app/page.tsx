'use client';

import { useState, useEffect } from 'react';
import { JudgmentMode, JudgmentStyle, JudgmentResult, HistoryItem, Judge, JudgmentSuggestion, ChatMessage } from '@/types';
import HomePage from '@/components/HomePage';
import ModePage from '@/components/ModePage';
import StylePage from '@/components/StylePage';
import InputPage from '@/components/InputPage';
import LoadingPage from '@/components/LoadingPage';
import ResultPage from '@/components/ResultPage';
import JudgeRegisterPage from '@/components/JudgeRegisterPage';
import InviteJudgePage from '@/components/InviteJudgePage';
import JudgeDashboardPage from '@/components/JudgeDashboardPage';
import CaseViewPage from '@/components/CaseViewPage';

type Page = 'home' | 'mode' | 'style' | 'input' | 'loading' | 'result' | 'judge-register' | 'invite-judge' | 'judge-dashboard' | 'case-view';

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

export default function Main() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mode, setMode] = useState<JudgmentMode>('anonymous');
  const [style, setStyle] = useState<JudgmentStyle>('neutral');
  const [result, setResult] = useState<JudgmentResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentJudge, setCurrentJudge] = useState<Judge | null>(null);
  const [invitedJudge, setInvitedJudge] = useState<Judge | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [currentCases, setCurrentCases] = useState<Case[]>([]);

  // 检查 URL 中的邀请码
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');
    if (inviteCode) {
      // 处理邀请码
      const savedCases = localStorage.getItem('pending-invites');
      if (savedCases) {
        try {
          const invites = JSON.parse(savedCases);
          // 验证邀请码并加入案件
        } catch (e) {
          console.error('Failed to parse invites:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    // 从 localStorage 加载历史记录
    const savedHistory = localStorage.getItem('judgment-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    // 加载当前判官的案件
    const savedCases = localStorage.getItem('judge-cases');
    if (savedCases) {
      try {
        setCurrentCases(JSON.parse(savedCases));
      } catch (e) {
        console.error('Failed to parse cases:', e);
      }
    }
  }, []);

  const handleStart = () => {
    setCurrentPage('mode');
  };

  const handleModeSelect = (selectedMode: JudgmentMode) => {
    setMode(selectedMode);
  };

  const handleStyleSelect = (selectedStyle: JudgmentStyle) => {
    setStyle(selectedStyle);
  };

  const handleModeContinue = () => {
    setCurrentPage('style');
  };

  const handleStyleContinue = () => {
    setCurrentPage('invite-judge');
  };

  // 生成邀请码
  const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // 保存邀请码
    const savedCodes = localStorage.getItem('invite-codes');
    const codes = savedCodes ? JSON.parse(savedCodes) : {};
    codes[code] = {
      judgeId: currentJudge?.id,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('invite-codes', JSON.stringify(codes));
    
    return code;
  };

  // 判官相关
  const handleJudgeRegister = (judgeData: Omit<Judge, 'id' | 'createdAt' | 'totalCases' | 'winRates'>) => {
    const newJudge: Judge = {
      ...judgeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalCases: 0,
      winRates: {}
    };
    
    // 保存到 localStorage
    const savedJudges = localStorage.getItem('registered-judges');
    const judges = savedJudges ? JSON.parse(savedJudges) : [];
    judges.push(newJudge);
    localStorage.setItem('registered-judges', JSON.stringify(judges));
    
    setCurrentJudge(newJudge);
    setCurrentPage('judge-dashboard');
  };

  const handleInviteRandom = () => {
    // 随机分配一个判官（模拟）
    const savedJudges = localStorage.getItem('registered-judges');
    const judges: Judge[] = savedJudges ? JSON.parse(savedJudges) : [];
    
    if (judges.length > 0) {
      const randomJudge = judges[Math.floor(Math.random() * judges.length)];
      setInvitedJudge(randomJudge);
    }
    setCurrentPage('input');
  };

  const handleInviteFriend = () => {
    // TODO: 生成邀请码/链接
    alert('邀请功能开发中，请先使用AI判官');
    setCurrentPage('input');
  };

  const handleSkipInvite = () => {
    setInvitedJudge(null);
    setCurrentPage('input');
  };

  const handleEnterJudgeDashboard = () => {
    // 检查是否已登录判官
    const savedJudges = localStorage.getItem('registered-judges');
    const judges: Judge[] = savedJudges ? JSON.parse(savedJudges) : [];
    
    if (judges.length > 0) {
      // 显示判官选择列表或直接进入
      setCurrentJudge(judges[0]);
      setCurrentPage('judge-dashboard');
    } else {
      setCurrentPage('judge-register');
    }
  };

  const handleBackFromDashboard = () => {
    setCurrentPage('home');
  };

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentPage('case-view');
  };

  const handleSubmitJudgment = (caseId: string, judgment: JudgmentSuggestion) => {
    // 更新案件状态
    const updatedCases = currentCases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'completed' as const,
          finalJudgment: judgment
        };
      }
      return c;
    });
    
    setCurrentCases(updatedCases);
    localStorage.setItem('judge-cases', JSON.stringify(updatedCases));
    
    // 更新判官统计
    if (currentJudge) {
      const savedJudges = localStorage.getItem('registered-judges');
      const judges: Judge[] = savedJudges ? JSON.parse(savedJudges) : [];
      const updatedJudges = judges.map(j => {
        if (j.id === currentJudge.id) {
          return {
            ...j,
            totalCases: j.totalCases + 1
          };
        }
        return j;
      });
      localStorage.setItem('registered-judges', JSON.stringify(updatedJudges));
    }
    
    setSelectedCaseId(null);
    setCurrentPage('judge-dashboard');
  };

  const handleSubmit = async (partyA: string, partyB: string) => {
    setCurrentPage('loading');

    // 如果有邀请判官，创建案件
    if (invitedJudge) {
      const newCase: Case = {
        id: Date.now().toString(),
        partyAName: partyA,
        partyBName: partyB,
        messages: [],
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // 保存到判官的案件列表
      const savedCases = localStorage.getItem('judge-cases');
      const cases: Case[] = savedCases ? JSON.parse(savedCases) : [];
      cases.push(newCase);
      localStorage.setItem('judge-cases', JSON.stringify(cases));
      setCurrentCases(cases);
    }

    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyA, partyB, mode, style }),
      });

      const data = await response.json();
      setResult(data);

      // 如果有邀请判官，生成 AI 建议并更新案件
      if (invitedJudge) {
        const aiSuggestion: JudgmentSuggestion = {
          winner: data.winner,
          winnerName: data.winnerName,
          subtitle: data.subtitle,
          reason: data.reason,
          dimensions: data.dimensions || []
        };
        
        const savedCases = localStorage.getItem('judge-cases');
        const cases: Case[] = savedCases ? JSON.parse(savedCases) : [];
        const updatedCases = cases.map(c => {
          if (c.partyAName === partyA && c.partyBName === partyB && c.status === 'pending') {
            return {
              ...c,
              status: 'judging' as const,
              messages: [], // TODO: 添加对话历史
              aiSuggestion
            };
          }
          return c;
        });
        localStorage.setItem('judge-cases', JSON.stringify(updatedCases));
        setCurrentCases(updatedCases);
      }

      // 保存到历史记录
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        winner: data.winner,
        winnerName: data.winnerName,
        preview: `${partyA.substring(0, 30)}... vs ${partyB.substring(0, 30)}...`,
        result: data,
        mode,
      };

      const newHistory = [newHistoryItem, ...history];
      setHistory(newHistory);
      localStorage.setItem('judgment-history', JSON.stringify(newHistory));

      setCurrentPage('result');
    } catch (error) {
      console.error('Failed to get judgment:', error);
      // 使用模拟结果
      const mockResult: JudgmentResult = {
        winner: 'partyA',
        winnerName: '甲方',
        subtitle: '逻辑更清晰，论据更充分',
        reason: '甲方在论证过程中展现了更强的逻辑性，论点与论据之间形成了有效的支撑关系。相比之下，乙方虽然也提出了自己的观点，但在事实依据和逻辑连贯性方面略显不足。',
        dimensions: [
          { label: '逻辑性', value: '甲方 90分', score: 'good' },
          { label: '事实依据', value: '甲方 85分', score: 'good' },
          { label: '情感控制', value: '乙方 70分', score: 'medium' },
          { label: '双赢可能', value: '难以调和', score: 'poor' },
        ],
      };
      setResult(mockResult);
      setCurrentPage('result');
    }
  };

  const handleShare = () => {
    alert('分享功能将跳转到微信分享');
  };

  const handleSave = () => {
    alert('已保存到历史记录');
  };

  const handleNewCase = () => {
    setCurrentPage('home');
    setResult(null);
  };

  return (
    <div className="phone" style={{
      maxWidth: '414px',
      margin: '0 auto',
      minHeight: '100vh',
      background: '#1A1A1A',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="top-decoration" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(180deg, #8B0000 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {currentPage === 'home' && <HomePage onStart={handleStart} onBecomeJudge={handleEnterJudgeDashboard} />}
      {currentPage === 'mode' && (
        <ModePage
          selectedMode={mode}
          onModeSelect={handleModeSelect}
          onContinue={handleModeContinue}
        />
      )}
      {currentPage === 'style' && (
        <StylePage
          selectedStyle={style}
          onStyleSelect={handleStyleSelect}
          onContinue={handleStyleContinue}
        />
      )}
      {currentPage === 'input' && (
        <InputPage mode={mode} onSubmit={handleSubmit} />
      )}
      {currentPage === 'loading' && <LoadingPage />}
      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onShare={handleShare}
          onSave={handleSave}
          onNewCase={handleNewCase}
        />
      )}
      {currentPage === 'judge-register' && (
        <JudgeRegisterPage
          onRegister={handleJudgeRegister}
          onSkip={handleBackFromDashboard}
        />
      )}
      {currentPage === 'invite-judge' && (
        <InviteJudgePage
          onRandomInvite={handleInviteRandom}
          onFriendInvite={handleInviteFriend}
          onSkip={handleSkipInvite}
        />
      )}
      {currentPage === 'judge-dashboard' && currentJudge && (
        <JudgeDashboardPage
          judge={currentJudge}
          onBack={handleBackFromDashboard}
          onViewCase={handleViewCase}
          onGenerateInviteCode={generateInviteCode}
        />
      )}
      {currentPage === 'case-view' && selectedCaseId && currentJudge && (
        <CaseViewPage
          caseId={selectedCaseId}
          judge={currentJudge}
          onBack={() => setCurrentPage('judge-dashboard')}
          onSubmitJudgment={handleSubmitJudgment}
        />
      )}
    </div>
  );
}
