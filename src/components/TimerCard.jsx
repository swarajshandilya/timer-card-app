import React from 'react';

function TimerCard({ timer, idx, individualRunning, startTimer, stopTimer, anyRunning, globalRunning }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', boxShadow: '0 2px 8px #e0e7ff', borderRadius: 8, padding: 16, minWidth: 120, textAlign: 'center' }}>
      <h4>Timer {idx + 1}</h4>
      <div style={{ fontSize: 24, marginBottom: 8 }}>
        {`00:${timer.value.toString().padStart(2, '0')}`}
      </div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
        Interval: {timer.interval}ms<br />Initial: {timer.initial}s
      </div>
      {!individualRunning[idx] ? (
        <button onClick={() => startTimer(idx)} disabled={anyRunning && !globalRunning}>Start Me</button>
      ) : (
        <button onClick={() => stopTimer(idx)}>Stop Me</button>
      )}
    </div>
  );
}

export default TimerCard;
