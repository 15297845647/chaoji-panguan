'use client';

import { useState, useRef, useEffect } from 'react';
import { JudgmentMode } from '@/types';

interface InputPageProps {
  mode: JudgmentMode;
  onSubmit: (partyA: string, partyB: string) => void;
}

interface ChatMessage {
  id: number;
  sender: 'partyA' | 'partyB';
  content: string;
  time: string;
}

export default function InputPage({ mode, onSubmit }: InputPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSender, setCurrentSender] = useState<'partyA' | 'partyB'>('partyA');
  const [currentInput, setCurrentInput] = useState('');
  const [partyAReady, setPartyAReady] = useState(false);
  const [partyBReady, setPartyBReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const partyAName = mode === 'anonymous' ? '有理哥' : '甲方';
  const partyBName = mode === 'anonymous' ? '无理怪' : '乙方';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (currentInput.trim().length < 2) {
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: currentSender,
      content: currentInput.trim(),
      time: getCurrentTime()
    };

    setMessages([...messages, newMessage]);
    setCurrentInput('');
    
    // 切换发言方
    setCurrentSender(currentSender === 'partyA' ? 'partyB' : 'partyA');
    
    // 重置该方ready状态
    if (currentSender === 'partyA') {
      setPartyAReady(false);
    } else {
      setPartyBReady(false);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleReady = () => {
    if (currentSender === 'partyA') {
      setPartyAReady(!partyAReady);
      if (!partyAReady) setCurrentSender('partyB');
    } else {
      setPartyBReady(!partyBReady);
      if (!partyBReady) setCurrentSender('partyA');
    }
  };

  const handleSubmit = () => {
    const partyAMsgs = messages.filter(m => m.sender === 'partyA').map(m => m.content).join('\n\n');
    const partyBMsgs = messages.filter(m => m.sender === 'partyB').map(m => m.content).join('\n\n');

    if (!partyAMsgs || !partyBMsgs) {
      alert('请双方都发言后再提交');
      return;
    }

    onSubmit(partyAMsgs, partyBMsgs);
  };

  const partyAMsgs = messages.filter(m => m.sender === 'partyA');
  const partyBMsgs = messages.filter(m => m.sender === 'partyB');

  return (
    <div className="page active" style={{ 
      paddingTop: '0', 
      position: 'relative', 
      zIndex: 1, 
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 40px)',
      background: '#1A1A1A'
    }}>
      {/* 顶部栏 */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#D4AF37' }}>
            微信舌战
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {messages.length} 条消息
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ 
            padding: '4px 10px', 
            borderRadius: '12px', 
            fontSize: '12px',
            background: partyAReady ? '#4CAF50' : 'rgba(255, 107, 107, 0.2)',
            color: partyAReady ? '#fff' : '#FF6B6B'
          }}>
            {partyAName} {partyAReady ? '✓' : '...'}
          </span>
          <span style={{ 
            padding: '4px 10px', 
            borderRadius: '12px', 
            fontSize: '12px',
            background: partyBReady ? '#4CAF50' : 'rgba(100, 181, 246, 0.2)',
            color: partyBReady ? '#fff' : '#64B5F6'
          }}>
            {partyBName} {partyBReady ? '✓' : '...'}
          </span>
        </div>
      </div>

      {/* 聊天区域 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px',
        paddingBottom: '100px'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            paddingTop: '60px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>双方准备开喷</div>
            <div style={{ fontSize: '12px', color: '#444' }}>
              {partyAName} 先发言
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: msg.sender === 'partyA' ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}
            >
              {/* 头像 */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: msg.sender === 'partyA' 
                  ? 'linear-gradient(135deg, #FF6B6B, #C41E3A)'
                  : 'linear-gradient(135deg, #64B5F6, #1976D2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginLeft: msg.sender === 'partyA' ? '0' : '8px',
                marginRight: msg.sender === 'partyA' ? '8px' : '0',
                flexShrink: 0
              }}>
                {msg.sender === 'partyA' ? '😤' : '🤬'}
              </div>
              
              {/* 消息气泡 */}
              <div style={{ maxWidth: '70%' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginBottom: '4px',
                  textAlign: msg.sender === 'partyA' ? 'left' : 'right'
                }}>
                  {msg.sender === 'partyA' ? partyAName : partyBName}
                </div>
                <div style={{
                  background: msg.sender === 'partyA' 
                    ? 'linear-gradient(135deg, #FF6B6B, #C41E3A)'
                    : 'linear-gradient(135deg, #64B5F6, #1976D2)',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'partyA' 
                    ? '4px 16px 16px 16px'
                    : '16px 4px 16px 16px',
                  color: '#fff',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#444', 
                  marginTop: '4px',
                  textAlign: msg.sender === 'partyA' ? 'left' : 'right'
                }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 当前发言提示 */}
      {messages.length > 0 && (
        <div style={{
          padding: '8px 16px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderTop: '1px solid #333',
          textAlign: 'center',
          fontSize: '13px',
          color: '#D4AF37'
        }}>
          当前 {currentSender === 'partyA' ? partyAName : partyBName} 正在输入...
        </div>
      )}

      {/* 输入区域 */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        background: '#2A2A2A',
        borderTop: '1px solid #333',
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          {/* 输入框 */}
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${currentSender === 'partyA' ? partyAName : partyBName} 说...`}
              rows={1}
              style={{
                width: '100%',
                minHeight: '40px',
                maxHeight: '100px',
                background: '#1A1A1A',
                border: `2px solid ${currentSender === 'partyA' ? '#FF6B6B' : '#64B5F6'}`,
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '15px',
                resize: 'none',
                outline: 'none',
                lineHeight: '1.4'
              }}
            />
          </div>
          
          {/* 发送按钮 */}
          <button 
            onClick={handleSendMessage}
            disabled={!currentInput.trim()}
            style={{
              width: '40px',
              height: '40px',
              background: currentInput.trim() 
                ? (currentSender === 'partyA' 
                    ? 'linear-gradient(135deg, #FF6B6B, #C41E3A)'
                    : 'linear-gradient(135deg, #64B5F6, #1976D2)')
                : '#444',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '18px',
              cursor: currentInput.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            ➤
          </button>
        </div>

        {/* 底部操作栏 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '12px'
        }}>
          {/* 准备完毕按钮 */}
          <button 
            onClick={handleToggleReady}
            style={{
              padding: '8px 16px',
              height: '36px',
              background: (currentSender === 'partyA' ? partyAReady : partyBReady) 
                ? '#4CAF50' 
                : 'transparent',
              border: '2px solid #4CAF50',
              borderRadius: '18px',
              color: (currentSender === 'partyA' ? partyAReady : partyBReady) ? '#fff' : '#4CAF50',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {(currentSender === 'partyA' ? partyAReady : partyBReady) ? '✓ 准备完毕' : '我准备好了'}
          </button>

          {/* 判决按钮 */}
          {partyAReady && partyBReady && (
            <button 
              onClick={handleSubmit}
              style={{
                padding: '10px 24px',
                height: '36px',
                background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)',
                border: 'none',
                borderRadius: '18px',
                color: '#1A1A1A',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.4)'
              }}
            >
              ⚖️ 开始判决
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
