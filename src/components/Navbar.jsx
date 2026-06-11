import { useTheme } from '../context/ThemeContext'
import '../styles/Navbar.css'

/**
 * Top navigation bar with branding and dark/light mode toggle.
 */
export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="navbar-brand-icon" aria-hidden="true">
            B
          </span>
          <span className="navbar-brand-text">
            <span>BMI Calculator</span>
            <span className="navbar-brand-sub">Track your health</span>
          </span>
        </a>

        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  )
}
