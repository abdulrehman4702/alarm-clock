import { useState } from 'react';

export default function AlarmPanel({
  alarms,
  addAlarm,
  deleteAlarm,
  toggleAlarm,
  isAlarmRinging,
  snoozeAlarm,
  stopAlarm,
  theme,
}) {
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [sound, setSound] = useState('default');
  const [volume, setVolume] = useState(0.8);
  const [vibrate, setVibrate] = useState(true);
  const [error, setError] = useState('');

  const handleAddAlarm = () => {
    if (!time) {
      setError('Please select a time');
      return;
    }
    setError('');
    addAlarm({ time, label, sound, volume, vibrate });
    setTime('');
    setLabel('');
    setSound('default');
    setVolume(0.8);
    setVibrate(true);
  };

  return (
    <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/30 shadow-2xl w-full transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
      <h2
        className={`relative text-2xl font-bold mb-6 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Alarms
      </h2>
      {error && (
        <div className="text-pink-500 text-sm mb-4 text-center">{error}</div>
      )}
      <div className="relative space-y-4">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`w-full bg-white/30 text-${
            theme === 'dark' ? 'white' : 'gray-900'
          } p-3 rounded-xl border border-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Alarm Label"
          className={`w-full bg-white/30 text-${
            theme === 'dark' ? 'white' : 'gray-900'
          } p-3 rounded-xl border border-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
        <select
          value={sound}
          onChange={(e) => setSound(e.target.value)}
          className={`w-full bg-white/30 text-${
            theme === 'dark' ? 'white' : 'gray-900'
          } p-3 rounded-xl border border-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        >
          <option value="default">Default Alarm</option>
          <option value="bell">Bell</option>
          <option value="chime">Chime</option>
        </select>
        <div className="flex items-center gap-4">
          <label
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <label
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Vibrate
          </label>
          <input
            type="checkbox"
            checked={vibrate}
            onChange={(e) => setVibrate(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </div>
        <button
          onClick={handleAddAlarm}
          className="w-full bg-blue-500/80 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400 hover:border-blue-500"
        >
          Add Alarm
        </button>
      </div>
      <div className="mt-6 space-y-2 max-h-48 overflow-y-auto">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/30"
          >
            <div>
              <span
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {alarm.time} {alarm.label && `- ${alarm.label}`}
              </span>
              <span
                className={`text-sm ml-2 ${
                  theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                }`}
              >
                ({alarm.sound})
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={alarm.isActive}
                onChange={() => toggleAlarm(alarm.id)}
                className="w-5 h-5 accent-blue-500"
              />
              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isAlarmRinging && (
        <div className="relative mt-6 p-4 bg-pink-500/20 rounded-xl border border-pink-500/50 animate-pulse">
          <p
            className={`text-lg font-bold text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Alarm: {isAlarmRinging.time}{' '}
            {isAlarmRinging.label && `- ${isAlarmRinging.label}`}
          </p>
          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={snoozeAlarm}
              className="bg-blue-500/80 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400"
            >
              Snooze (5 min)
            </button>
            <button
              onClick={stopAlarm}
              className="bg-pink-500/80 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition-all duration-300 border border-pink-500"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}