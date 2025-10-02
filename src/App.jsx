import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import TimerCard from './components/TimerCard';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTimers(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initial: getRandomInt(0, 60),
    value: 0, // will be set to initial
    interval: getRandomInt(200, 2800),
    running: false,
    ref: null,
  })).map(t => ({ ...t, value: t.initial }));
}

function App() {
  const [timerCount, setTimerCount] = useState(2);
  const [timers, setTimers] = useState(() => createTimers(timerCount));
  const [globalRunning, setGlobalRunning] = useState(false);
  const [individualRunning, setIndividualRunning] = useState(Array(timerCount).fill(false));
  const intervals = useRef([]);

  // Reset intervals on timer count change
  useEffect(() => {
    stopAllTimers();
    setTimers(createTimers(timerCount));
    setIndividualRunning(Array(timerCount).fill(false));
    // eslint-disable-next-line
  }, [timerCount]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => stopAllTimers();
    // eslint-disable-next-line
  }, []);

  function startAllTimers() {
    stopAllTimers();
    setGlobalRunning(true);
    setIndividualRunning(Array(timerCount).fill(true));
    intervals.current = timers.map((timer, idx) => {
      return setInterval(() => {
        setTimers(timers => {
          const newTimers = [...timers];
          newTimers[idx] = { ...newTimers[idx], value: newTimers[idx].value + 1 };
          return newTimers;
        });
      }, timer.interval);
    });
  }

  function stopAllTimers() {
    intervals.current.forEach(clearInterval);
    intervals.current = [];
    setGlobalRunning(false);
    setIndividualRunning(Array(timerCount).fill(false));
  }

  function resetAllTimers() {
    stopAllTimers();
    setTimers(timers => timers.map(t => ({ ...t, value: t.initial })));
    setGlobalRunning(false);
    setIndividualRunning(Array(timerCount).fill(false));
  }

  function startTimer(idx) {
    if (individualRunning[idx]) return;
    const newIndividual = [...individualRunning];
    newIndividual[idx] = true;
    setIndividualRunning(newIndividual);
    setGlobalRunning(false);
    intervals.current[idx] = setInterval(() => {
      setTimers(timers => {
        const newTimers = [...timers];
        newTimers[idx] = { ...newTimers[idx], value: newTimers[idx].value + 1 };
        return newTimers;
      });
    }, timers[idx].interval);
    // Hide global buttons, show Stop All
  }

  function stopTimer(idx) {
    clearInterval(intervals.current[idx]);
    intervals.current[idx] = null;
    const newIndividual = [...individualRunning];
    newIndividual[idx] = false;
    setIndividualRunning(newIndividual);
    // If all are stopped, show global buttons
    if (newIndividual.every(r => !r)) {
      setGlobalRunning(false);
    }
  }

  // Stop All button should appear if any timer is running
  const anyRunning = individualRunning.some(r => r);

  // UI
  return (
    <div className="App" style={{ minHeight: '100vh', padding: 32, fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)' }}>
      <h2 style={{ textAlign: 'center' }}>React Timer Card App</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label htmlFor="timer-count" style={{ marginRight: 8 }}>Number of Timers: </label>
        <select
          id="timer-count"
          value={timerCount}
          onChange={e => setTimerCount(Number(e.target.value))}
          disabled={anyRunning}
          style={{ padding: '4px 12px', fontSize: 16 }}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!anyRunning && (
          <>
            <button onClick={startAllTimers} style={{ marginRight: 8 }}>Start All</button>
            <button onClick={resetAllTimers}>Reset All</button>
          </>
        )}
        {anyRunning && (
          <button onClick={stopAllTimers}>Stop All</button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {timers.map((timer, idx) => (
          <TimerCard
            key={timer.id}
            timer={timer}
            idx={idx}
            individualRunning={individualRunning}
            startTimer={startTimer}
            stopTimer={stopTimer}
            anyRunning={anyRunning}
            globalRunning={globalRunning}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
