import React, { useState, useEffect } from 'react';

function App() {
  const [mode, setMode] = useState<'easy' | 'hard' | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Create new state to capture last key pressed, for future use in game logic (e.g. showing which key was pressed, or validating input)
  const [lastKey, setLastKey] = useState<string>('');
  
  // Timer logic - runs only in game mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (mode !== null && !isRunning) {
      // Start timer automatically when mode is selected
      setIsRunning(true);
    }

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100); // update every 100ms for smoth-ish 1 decimal place
    }
    // Cleanup: Stop timer when mode changes or component unmounts, or dependency changes
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isRunning]); //dependencies: re-run when mode or isRunning changes

const resetTimer = () => {
  setElapsedTime(0);
  setIsRunning(false);
};

const handleBackToMenu = () => {
  setMode(null);
  resetTimer();
};

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent scrolling on space, arrow keys, etc. when in game mode
    if ([' ', 'Arrowup', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && mode !== null) {
      e.preventDefault();
    }
    setLastKey(e.key);

    // Later: we'll check if the key matches expected vim command
    console.log('Keypressed:', e.key, 'with modifiers', {
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
    });
  };

  if (mode !== null) {
    window.addEventListener('keydown', handleKeyDown);
  }

  // Cleanup: remove event listener
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [mode]); // only depends on mode - we only want to listen for keypresses when in game mode


return (
  <div 
    style={{
      textAlign: 'center',
      padding: '50px',
      fontFamily: 'monospace',
      minHeight: '100vh',
      background: '#0f0f0f',
      color: '#e0e0e0',
    }}
  >
    {mode === null ? (
      <>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>VIM Practice Arena</h1>
        <p style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>Choose your training difficulty:</p>
        
        <div style={{ margin: '30px' }}>
          <button
            onClick={() => setMode('easy')}
            style={{
              fontSize: '1.5rem',
              margin: '15px',
              padding: '15px 40px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Easy Mode (basic movements) 
          </button>
        
          <button
            onClick={() => setMode('hard')}
            style={{
              fontSize: '1.5rem',
              margin: '15px',
              padding: '15px 40px',
              background: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Hard Mode (real commands)
          </button>
        </div>
      </>
    ) : (
      <>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          Training - {mode.toUpperCase()} mode
        </h1>

        <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '2rem 0',color: '#ffeb3b'}}>
          {elapsedTime.toFixed(1)} s
        </div>

       <p style={{ fontSize: '1.3rem', marginBottom: '3rem' }}>
            (Timer started automatically — vim exercise coming soon...)
          </p>

          <button
            onClick={handleBackToMenu}
            style={{
              fontSize: '1.4rem',
              padding: '12px 35px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back to Menu
          </button>
        </>
      )}
      <div style={{ marginTop: '2rem', fontSize: '1.6rem' }}>
        Last key pressed: <strong style={{ color: '#ff9800'}}>{lastKey || '(none)'}</strong>
      </div>

      <p style={{ fontSize: '1.1rem', color: '#aaa', marginTop: '1rem' }}>
        Try pressing h j k l, i, Esc, etc...
      </p>
    </div>
  );
}

export default App; 

//  // Not choosen yet, show menu
  //if (mode === null) {
  //return (
    //<div style={{textAlign: 'center', padding: '50px', fontFamily: 'monospace' }}>
      //<h1>Welcome to the Game!</h1>
      //<p>Choose difficulty:</p>

      //<div style={{ margin: '30px' }}>
        //<button
          //onClick={() => setMode('easy')}
          //style={{ fontSize: '20px', margin: '10px', padding: '15px 30px' }}
        //>
          //Easy Mode (basic movements) 
        //</button>
      
        //<button
          //onClick={() => setMode('hard')}
          //style={{ fontSize: '20px', margin: '10px', padding: '15px 30px' }}
        //>
          //Hard Mode (real commands)
        //</button>
      //</div>
    //</div>
  //);
//}

// // Mode selected, show game
// return (
  // <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'monospace' }}>
    // <h1>Training - {mode.toUpperCase()} mode</h1>
    // <p>Game will appear here soon...</p>
    // <p>Press Escape to go back to the menu</p>
  // </div>
// );
// }
// export default App;