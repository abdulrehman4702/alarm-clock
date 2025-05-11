export default function ThemeToggle({ theme, toggleTheme }) {
    return (
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-2xl p-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
    );
  }