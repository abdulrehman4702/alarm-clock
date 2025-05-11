'use client';

import { useState, useEffect } from 'react';
import Clock from './components/Clock';
import AlarmPanel from './components/AlarmPanel';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import WorldClock from './components/WorldClock';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('alarms') || '[]');
    }
    return [];
  });
  const [isAlarmRinging, setIsAlarmRinging] = useState(null);
  const [theme, setTheme] = useState('light');
  const [showSeconds, setShowSeconds] = useState(true);
  const [activeTab, setActiveTab] = useState('clock');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alarms', JSON.stringify(alarms));
    }
  }, [alarms]);

  useEffect(() => {
    alarms.forEach((alarm) => {
      if (alarm.isActive) {
        const now = new Date();
        const [hours, minutes] = alarm.time.split(':').map(Number);
        const alarmDate = new Date();
        alarmDate.setHours(hours, minutes, 0, 0);

        if (
          now.getHours() === hours &&
          now.getMinutes() === minutes &&
          now.getSeconds() === 0
        ) {
          setIsAlarmRinging(alarm);
          setAlarms((prev) =>
            prev.map((a) =>
              a.id === alarm.id ? { ...a, isActive: false } : a
            )
          );
          if ('vibrate' in navigator && alarm.vibrate) {
            navigator.vibrate([500, 200, 500]);
          }
        }
      }
    });
  }, [time, alarms]);

  const addAlarm = (alarm) => {
    setAlarms([...alarms, { ...alarm, id: Date.now(), isActive: true }]);
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const snoozeAlarm = () => {
    if (isAlarmRinging) {
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
      const hours = snoozeTime.getHours().toString().padStart(2, '0');
      const minutes = snoozeTime.getMinutes().toString().padStart(2, '0');
      setAlarms([
        ...alarms,
        {
          ...isAlarmRinging,
          time: `${hours}:${minutes}`,
          isActive: true,
          id: Date.now(),
        },
      ]);
      setIsAlarmRinging(null);
      if ('vibrate' in navigator) {
        navigator.vibrate(0);
      }
    }
  };

  const stopAlarm = () => {
    setIsAlarmRinging(null);
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSeconds = () => {
    setShowSeconds(!showSeconds);
  };

  const getThemeClasses = () =>
    theme === 'dark'
      ? 'from-gray-800 via-blue-900 to-gray-800 text-white'
      : 'from-blue-100 via-pink-100 to-purple-100 text-gray-900';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getThemeClasses()} flex flex-col items-center justify-center p-4 gap-6 relative overflow-hidden`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br ${
            theme === 'dark' ? 'from-blue-400/10 to-white/10' : 'from-white/30 to-blue-200/20'
          } rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr ${
            theme === 'dark' ? 'from-white/10 to-blue-400/10' : 'from-pink-200/20 to-white/30'
          } rounded-full blur-3xl animate-pulse delay-1000`}
        />
      </div>

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <div className="flex gap-4 bg-white/20 backdrop-blur-2xl rounded-full p-2 border border-white/30 shadow-lg">
        {['clock', 'alarms', 'stopwatch', 'timer', 'world'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'text-white/80 hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        {activeTab === 'clock' && (
          <Clock
            time={time}
            showSeconds={showSeconds}
            toggleSeconds={toggleSeconds}
            theme={theme}
          />
        )}
        {activeTab === 'alarms' && (
          <AlarmPanel
            alarms={alarms}
            addAlarm={addAlarm}
            deleteAlarm={deleteAlarm}
            toggleAlarm={toggleAlarm}
            isAlarmRinging={isAlarmRinging}
            snoozeAlarm={snoozeAlarm}
            stopAlarm={stopAlarm}
            theme={theme}
          />
        )}
        {activeTab === 'stopwatch' && <Stopwatch theme={theme} />}
        {activeTab === 'timer' && <Timer theme={theme} />}
        {activeTab === 'world' && <WorldClock theme={theme} />}
      </div>

      {isAlarmRinging && (
        <audio autoPlay loop volume={isAlarmRinging.volume}>
          <source src={`/alarm-${isAlarmRinging.sound}.mp3`} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}