import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState<'easy' | 'hard' | null>(null);

  // Not choosen yet, show menu
  if (mode === null) {
  return (
    <div style={{textAlign: 'center', padding: '50px', fontFamily: 'monospace' }}>
      <h1>Welcome to the Game!</h1>
      <p>Choose difficulty:</p>

      <div style={{ margin: '30px' }}>
        <button
          onClick={() => setMode('easy')}
          style={{ fontSize: '20px', margin: '10px', padding: '15px 30px' }}
        >
          Easy Mode (basic movements)
        </button>
      
        <button
          onClick={() => setMode('hard')}
          style={{ fontSize: '20px', margin: '10px', padding: '15px 30px' }}
        >
          Hard Mode (real commands)
        </button>
      </div>
    </div>
  );
}

// Mode selected, show game, lets do this
return (
  <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'monospace' }}>
    <h1>Training - {mode.toUpperCase()} mode</h1>
    <p>Game will appear here soon...</p>
    <p>Press Escape to go back to the menu</p>
  </div>
);
}
export default App;