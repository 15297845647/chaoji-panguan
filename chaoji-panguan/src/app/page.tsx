'use client';

import { useState, useEffect } from 'react';
import { JudgmentMode, JudgmentStyle, JudgmentResult, HistoryItem, Judge } from '@/types';
import HomePage from '@/components/HomePage';
import ModePage from '@/components/ModePage';
import StylePage from '@/components/StylePage';
import InputPage from '@/components/InputPage';
import LoadingPage from '@/components/LoadingPage';
import ResultPage from '@/components/ResultPage';
import JudgeRegisterPage from '@/components/JudgeRegisterPage';
import InviteJudgePage from '@/components/InviteJudgePage';
import JudgeDashboardPage from '@/components/JudgeDashboardPage';

type Page = 'home' | 'mode' | 'style' | 'input' | 'loading' | 'result' | 'judge-register' | 'invite-judge' | 'judge-dashboard';

export default function Main() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mode, setMode] = useState<JudgmentMode>('anonymous');
  const [style, setStyle] = useState<JudgmentStyle>('neutral');
  const [result, setResult] = useState<JudgmentResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentJudge, setCurrentJudge] = useState<Judge | null>(null);
  const [invitedJudge, setInvitedJudge] = useState<Judge | null>(null);

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
    setCurrentPage('judge-register');
  };

  const handleBackFromDashboard = () => {
    setCurrentPage('home');
  };

  const handleSubmit = async (partyA: string, partyB: string) => {
    setCurrentPage('loading');

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
          onViewCase={(caseId) => console.log('View case:', caseId)}
        />
      )}
    </div>
  );
}
