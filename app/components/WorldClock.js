import { useState, useEffect } from 'react';
import { formatTime } from '../utils';

export default function WorldClock({ theme }) {
  const [cities, setCities] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('cities') || '[]');
    }
    return [
      { name: 'New York', offset: -4 },
      { name: 'London', offset: 1 },
      { name: 'Tokyo', offset: 9 },
    ];
  });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cities', JSON.stringify(cities));
    }
  }, [cities]);

  const addCity = () => {
    if (!search) {
      setError('Please enter a city and UTC offset');
      return;
    }
    const [name, offset] = search.split(',');
    const offsetNum = parseInt(offset);
    if (!name.trim() || isNaN(offsetNum) || offsetNum < -12 || offsetNum > 14) {
      setError('Invalid input. Use format: City,Offset (e.g., Paris,+2)');
      return;
    }
    setError('');
    setCities([...cities, { name: name.trim(), offset: offsetNum }]);
    setSearch('');
  };

  const removeCity = (name) => {
    setCities(cities.filter((city) => city.name !== name));
  };

  const getCityTime = (offset) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + offset * 3600000);
    return formatTime(cityTime, true);
  };

  return (
    <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/30 shadow-2xl w-full transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
      <h2
        className={`relative text-2xl font-bold mb-6 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        World Clock
      </h2>
      <div className="flex justify-center mb-6">
        <div
          className="w-40 h-40 bg-cover bg-center rounded-full border-2 border-white/30 shadow-lg animate-spin-globe"
          style={{ backgroundImage: 'url(/globe.png)' }}
        />
      </div>
      {error && (
        <div className="text-pink-500 text-sm mb-4 text-center">{error}</div>
      )}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="City,UTC offset (e.g., Paris,+2)"
          className={`w-full bg-white/30 text-${
            theme === 'dark' ? 'white' : 'gray-900'
          } p-3 rounded-xl border border-black/60 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          contentEditable="true"
        />
        <button
          onClick={addCity}
          className="bg-blue-500/80 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-blue-400 hover:border-blue-500"
        >
          Add
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {cities.map((city) => (
          <div
            key={city.name}
            className="flex justify-between bg-white/10 p-3 rounded-xl border border-white/30 mb-2"
          >
            <div>
              <span
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {city.name}
              </span>
              <span
                className={`text-sm ml-2 ${
                  theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                }`}
              >
                (UTC{city.offset >= 0 ? '+' : ''}{city.offset})
              </span>
            </div>
            <div className="flex gap-2">
              <span
                className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
              >
                {getCityTime(city.offset)}
              </span>
              <button
                onClick={() => removeCity(city.name)}
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}