'use client';

export default function LoadingPage() {
  return (
    <div className="page active" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '100px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ width: '150px', height: '150px', position: 'relative', marginBottom: '40px' }}>
        <svg 
          style={{ 
            width: '100%', 
            height: '100%', 
            animation: 'judge 1.5s ease-in-out infinite' 
          }} 
          viewBox="0 0 24 24" 
          fill="#D4AF37"
        >
          <path d="M3 17h6v-2H3v2zm0-4h10v-2H3v2zm0-4h14V7H3v2z"/>
          <path d="M19 12l-4-4 4-4v8z" fill="#8B0000"/>
        </svg>
      </div>
      <p style={{ fontSize: '18px', color: '#D4AF37', marginBottom: '8px' }}>判官正在审理...</p>
      <p style={{ color: '#666', fontSize: '14px' }}>AI 正在分析双方观点</p>
      <div style={{ 
        width: '200px', 
        height: '4px', 
        background: '#333', 
        borderRadius: '2px', 
        marginTop: '30px',
        overflow: 'hidden' 
      }}>
        <div style={{ 
          height: '100%', 
          background: 'linear-gradient(90deg, #D4AF37, #F4E4BA)', 
          borderRadius: '2px', 
          animation: 'loading 2s ease-in-out infinite' 
        }} />
      </div>
    </div>
  );
}
