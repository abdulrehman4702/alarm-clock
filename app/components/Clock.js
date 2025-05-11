import { formatTime } from '../utils';

export default function Clock({ time, showSeconds, toggleSeconds, theme }) {
  return (
    <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-8 border border-black/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
      <div className="relative w-[300px] h-[300px] bg-white/10 rounded-full border-2 border-black/30 shadow-inner">
        <div
          className={`absolute bottom-1/2 left-1/2 w-1.5 h-20 rounded-full -ml-0.75 origin-bottom shadow-lg ${
            theme === 'dark' ? 'bg-white/90' : 'bg-gray-900/90'
          }`}
          style={{
            transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() / 2}deg)`,
          }}
        />
        <div
          className={`absolute bottom-1/2 left-1/2 w-1 h-24 rounded-full -ml-0.5 origin-bottom shadow-lg ${
            theme === 'dark' ? 'bg-white/90' : 'bg-gray-900/90'
          }`}
          style={{
            transform: `rotate(${time.getMinutes() * 6}deg)`,
          }}
        />
        {showSeconds && (
          <div
            className="absolute bottom-1/2 left-1/2 w-0.5 h-28 bg-pink-500/90 rounded-full -ml-0.25 origin-bottom shadow-lg"
            style={{
              transform: `rotate(${time.getSeconds() * 6}deg)`,
            }}
          />
        )}
        <div className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg ${
          theme === 'dark' ? 'bg-white/90' : 'bg-gray-900/90'
        }`} />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`absolute top-2.5 left-1/2 w-1.5 h-4 rounded-full -translate-x-1/2 shadow-sm ${
              theme === 'dark' ? 'bg-white/70' : 'bg-gray-900/70'
            }`} />
          </div>
        ))}
      </div>
      <div
        className={`text-center text-4xl font-bold mt-6 drop-shadow-lg ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        {formatTime(time, showSeconds)}
      </div>
      <button
        onClick={toggleSeconds}
        className={`absolute bottom-4 right-4 ${
          theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'
        } transition-colors text-sm font-medium`}
      >
        {showSeconds ? 'Hide Seconds' : 'Show Seconds'}
      </button>
    </div>
  );
}