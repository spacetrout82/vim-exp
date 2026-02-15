import React, { useState, useEffect, useRef } from 'react';
import { vimCommands, type VimCommand } from './vimCommands';

function App() {
  const [mode, setMode] = useState<'easy' | 'hard' | null>(null);

  // Game state
  const [exercises, setExercises] = useState<VimCommand[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userBuffer, setUserBuffer] = useState('');
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);           // per exercise
  const [currentExerciseElapsed, setCurrentExerciseElapsed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);     // overall session
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

  const currentRef = useRef<HTMLDivElement>(null);

  // Helper: pick random exercises based on difficulty
  const startNewSession = (selectedMode: 'easy' | 'hard') => {
    let pool = [...vimCommands];
    if (selectedMode === 'easy') {
      pool = pool.filter(cmd => cmd.points <= 4);
    }
    // shuffle
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15); // 15 exercises per session

    setExercises(selected);
    setCurrentIndex(0);
    setUserBuffer('');
    setStreak(0);
    setMaxStreak(0);
    setScore(0);
    setSuccessCount(0);
    setMistakes(0);
    setCurrentExerciseElapsed(0);
    setElapsedTime(0);
    setIsRunning(true);
  };

  // Reset everything when going back to menu
  const handleBackToMenu = () => {
    setMode(null);
    setExercises([]);
    setCurrentIndex(0);
    setUserBuffer('');
    setStreak(0);
    setScore(0);
    setIsRunning(false);
  };

  // Overall + per-exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
        setCurrentExerciseElapsed((prev) => prev + 0.1);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Auto-scroll current exercise into center of wheel
  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentIndex]);

  // Keyboard handling (only when game is active)
  useEffect(() => {
    const normalizeKey = (e: KeyboardEvent): string => {
      if (e.key === 'Escape') return 'Esc';
      if (e.key === 'Backspace') return '<BS>';
      if (e.ctrlKey && e.key.length === 1) return `<C-${e.key.toLowerCase()}>`;
      if (e.key.length === 1) return e.key;
      return '';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (exercises.length === 0 || currentIndex >= exercises.length) return;

      const keyStr = normalizeKey(e);
      if (!keyStr) return;

      e.preventDefault();

      const currentExercise = exercises[currentIndex];
      const expected = currentExercise.keystroke;
      const newBuffer = userBuffer + keyStr;

      console.log('Key:', keyStr, 'Buffer:', newBuffer); // ← debugging tip

      if (newBuffer === expected) {
        // SUCCESS
        const timeTaken = currentExerciseElapsed || 0.1;
        const multiplier = 1 + Math.floor(streak / 5);
        const speedBonus = Math.max(0.5, 10 / (timeTaken + 2)); // faster = better
        const pointsEarned = Math.round(currentExercise.points * multiplier * speedBonus);

        setScore((s) => s + pointsEarned);
        setSuccessCount((c) => c + 1);

        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);

        setUserBuffer('');
        setMistakes(0);
        setCurrentExerciseElapsed(0);
        setFeedback('success');

        if (currentIndex + 1 < exercises.length) {
          setCurrentIndex((i) => i + 1);
        } else {
          setIsRunning(false); // session complete
        }

        setTimeout(() => setFeedback(null), 400);
      } else if (expected.startsWith(newBuffer)) {
        // partial match → continue
        setUserBuffer(newBuffer);
      } else {
        // MISTAKE
        const maxAllowed = mode === 'easy' ? 3 : 0;
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        setUserBuffer('');
        setFeedback('error');

        if (newMistakes > maxAllowed) {
          // exercise failed
          setStreak(0);
          setCurrentExerciseElapsed(0);
          setMistakes(0);

          if (currentIndex + 1 < exercises.length) {
            setCurrentIndex((i) => i + 1);
          } else {
            setIsRunning(false);
          }
        }
        setTimeout(() => setFeedback(null), 400);
      }
    };

    if (mode !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, exercises, currentIndex, userBuffer, mistakes, streak, maxStreak]);

  // Start game when mode is chosen
  useEffect(() => {
    if (mode !== null && exercises.length === 0) {
      startNewSession(mode);
    }
  }, [mode]);

  const currentExercise = exercises[currentIndex];
  const isGameOver = exercises.length > 0 && currentIndex >= exercises.length;

  return (
    <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'monospace', background: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh' }}>
      {mode === null ? (
        // MENU
        <>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧙‍♂️ VIM Practice Arena</h1>
          <p style={{ fontSize: '1.5rem' }}>Choose difficulty</p>

          <div style={{ margin: '40px' }}>
            <button onClick={() => setMode('easy')} style={{ fontSize: '1.8rem', padding: '18px 50px', margin: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px' }}>
              Easy (3 mistakes allowed per exercise)
            </button>
            <button onClick={() => setMode('hard')} style={{ fontSize: '1.8rem', padding: '18px 50px', margin: '15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '10px' }}>
              Hard (0 mistakes allowed)
            </button>
          </div>
        </>
      ) : isGameOver ? (
        // GAME OVER SCREEN
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ color: '#4fc3f7' }}>Session Complete!</h1>
          <div style={{ fontSize: '4rem', margin: '2rem 0', color: '#ffeb3b' }}>{score} pts</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
            <div>Overall time:</div><div>{elapsedTime.toFixed(1)} s</div>
            <div>Max streak:</div><div>{maxStreak}×</div>
            <div>Accuracy:</div><div>{Math.round((successCount / exercises.length) * 100)}%</div>
            <div>Exercises completed:</div><div>{successCount} / {exercises.length}</div>
          </div>

          <button onClick={handleBackToMenu} style={{ marginTop: '40px', fontSize: '1.4rem', padding: '15px 40px', background: '#2196F3' }}>
            Back to Menu
          </button>
        </div>
      ) : (
        // GAME SCREEN
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '900px', margin: '0 auto' }}>
            <div>Overall: <strong>{elapsedTime.toFixed(1)} s</strong></div>
            <div>Current exercise: <strong style={{ color: '#ffeb3b' }}>{currentExerciseElapsed.toFixed(1)} s</strong></div>
            <div>Score: <strong style={{ color: '#4fc3f7' }}>{score}</strong> Streak: <strong>{streak}×</strong></div>
          </div>

          {/* Exercise Wheel */}
          <div style={{ margin: '40px auto', maxWidth: '700px', height: '420px', overflowY: 'auto', padding: '20px', background: '#1a1a1a', borderRadius: '12px', border: '2px solid #333' }}>
            {exercises.slice(0, currentIndex).map((ex, i) => (
              <div key={i} style={{ padding: '12px', color: '#4CAF50', opacity: 0.8, textAlign: 'left' }}>
                ✓ {ex.description} <span style={{ fontSize: '0.9rem' }}>({ex.keystroke})</span>
              </div>
            ))}

            {currentExercise && (
              <div ref={currentRef} style={{ padding: '30px 20px', border: '4px solid #4fc3f7', borderRadius: '12px', background: '#0d2a4a', margin: '20px 0' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
                  {currentExercise.mode.toUpperCase()} mode
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>
                  {currentExercise.description}
                </div>
                <div style={{ marginTop: '15px', fontSize: '2rem', color: '#ffeb3b' }}>
                  Type: <code>{currentExercise.keystroke}</code>
                </div>
              </div>
            )}

            {(() => {
            const upcoming = exercises.slice(currentIndex + 1).slice(0, 6); // max 6 ahead
            return upcoming.map((ex, relativeIndex) => {
              // relativeIndex = 0 → immediate next (biggest)
              // relativeIndex = 1 → a bit smaller
              // ...
              const scale = 1 - relativeIndex * 0.12;          // 1.0 → 0.88 → 0.76 → ...
              const opacity = 0.9 - relativeIndex * 0.12;      // 0.9 → 0.78 → 0.66 → ...

              return (
                <div
                  key={relativeIndex}
                  style={{
                    padding: '12px 0',
                    opacity,
                    fontSize: `${1.1 * scale}rem`,               // starts ~1.1rem, shrinks gradually
                    textAlign: 'center',
                    color: '#ccc',
                    transition: 'all 0.4s ease',                 // smooth when new one enters
                  }}
                >
                  {ex.description} <span style={{ fontSize: '0.85rem' }}>({ex.keystroke})</span>
                </div>
              );
            });
            })()}
          </div>

          {/* Live Buffer */}
          <div
            style={{
              fontSize: '2.8rem',
              letterSpacing: '12px',
              minHeight: '80px',
              padding: '20px',
              background: '#111',
              borderRadius: '8px',
              border: '2px solid #444',
              color: feedback === 'success' ? '#4CAF50' : feedback === 'error' ? '#f44336' : '#fff',
              margin: '30px auto',
              maxWidth: '600px',
            }}
          >
            {userBuffer || 'Start typing...'}
          </div>

          <button onClick={handleBackToMenu} style={{ fontSize: '1.2rem', padding: '12px 30px' }}>
            End Session
          </button>
        </>
      )}
    </div>
  );
}

export default App;