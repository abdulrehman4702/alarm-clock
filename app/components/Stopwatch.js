import { useState, useEffect } from 'react';

export default function Stopwatch({ theme }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const ms = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
    const sec = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    const min = Math.floor(time / 60000).toString().padStart(2, '0');
    return `${min}:${sec}.${ms}`;
  };

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning) {
      setLaps([...laps, formatTime()]);
    }
  };

  return (
    <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/30 shadow-2xl w-full transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
      <h2
        className={`relative text-2xl font-bold mb-6 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Stopwatch
      </h2>
      <div
        className={`text-5xl font-mono text-center mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        {formatTime()}
      </div>
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={startStop}
          className="bg-blue-500/80 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400 hover:border-blue-500"
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={addLap}
          className="bg-blue-500/80 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isRunning}
        >
          Lap
        </button>
        <button
          onClick={reset}
          className="bg-pink-500/80 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition-all duration-300 border border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={time === 0}
        >
          Reset
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {laps.map((lap, index) => (
          <div
            key={index}
            className="flex justify-between bg-white/10 p-3 rounded-xl border border-white/30 mb-2"
          >
            <span
              className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
            >
              Lap {index + 1}
            </span>
            <span
              className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
            >
              {lap}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}