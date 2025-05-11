import { useState, useEffect } from 'react';

export default function Timer({ theme }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState({ minutes: '', seconds: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1000);
      }, 1000);
    } else if (time <= 0 && isRunning) {
      setIsRunning(false);
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500]);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = () => {
    const sec = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    const min = Math.floor(time / 60000).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const startPause = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setInputTime({ minutes: '', seconds: '' });
    setError('');
  };

  const setTimer = () => {
    const minutes = parseInt(inputTime.minutes || 0);
    const seconds = parseInt(inputTime.seconds || 0);
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) {
      setError('Please enter a valid time');
      return;
    }
    setError('');
    setTime(totalSeconds * 1000);
  };

  return (
    <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/30 shadow-2xl w-full transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
      <h2
        className={`relative text-2xl font-bold mb-6 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Timer
      </h2>
      {error && (
        <div className="text-pink-500 text-sm mb-4 text-center">{error}</div>
      )}
      <div
        className={`text-5xl font-mono text-center mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        {formatTime()}
      </div>
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Min"
          value={inputTime.minutes}
          onChange={(e) =>
            setInputTime({ ...inputTime, minutes: e.target.value })
          }
          className={`w-24 bg-white/30 text-${
            theme === 'dark' ? 'white' : 'gray-900'
          } p-3 rounded-xl border border-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="0"
        />
        <input
          type="number"
          placeholder="Sec"
          value={inputTime.seconds}
          onChange={(e) =>
            setInputTime({ ...inputTime, seconds: e.target.value })
          }
          className={`w-24 bg-white/30 text-${
            theme === 'dark' ? 'white' : 'gray-900'
          } p-3 rounded-xl border border-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="0"
          max="59"
        />
        <button
          onClick={setTimer}
          className="bg-blue-500/80 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400 hover:border-blue-500"
        >
          Set
        </button>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={startPause}
          className="bg-blue-500/80 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={time === 0}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="bg-pink-500/80 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition-all duration-300 border border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={time === 0}
        >
          Reset
        </button>
      </div>
    </div>
  );
}