'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryItem } from '@/types';
import HistoryPage from '@/components/HistoryPage';

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('judgment-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const handleItemClick = (item: HistoryItem) => {
    // 将选中的结果存储到 sessionStorage，然后跳转到首页显示
    sessionStorage.setItem('selected-result', JSON.stringify(item.result));
    router.push('/');
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

      <HistoryPage history={history} onItemClick={handleItemClick} />
    </div>
  );
}
