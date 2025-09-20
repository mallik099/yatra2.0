import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{fontSize: '3rem', margin: '0 0 20px 0'}}>🚍 Yatra</h1>
        <p style={{color: '#666', fontSize: '1.2rem'}}>Testing - App should work!</p>
        <div style={{marginTop: '20px'}}>
          <button style={{
            background: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '10px'
          }}>
            Live Tracking
          </button>
          <button style={{
            background: '#8b5cf6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Route Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;