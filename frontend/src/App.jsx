import { useState, useEffect } from 'react'
import './App.css'
import StudyScreen from './components/StudyScreen'
import FlashcardScreen from './components/FlashcardScreen'
import DashboardScreen from './components/DashboardScreen'

function App() {
  const [activeScreen, setActiveScreen] = useState('study')

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('SW registration failed:', err))
    }
  }, [])

  return (
    <div className="app">
      <main className="main-content">
        {activeScreen === 'study' && <StudyScreen />}
        {activeScreen === 'flashcards' && <FlashcardScreen />}
        {activeScreen === 'dashboard' && <DashboardScreen />}
      </main>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeScreen === 'study' ? 'active' : ''}`}
          onClick={() => setActiveScreen('study')}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">Study</span>
        </button>
        <button
          className={`nav-item ${activeScreen === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveScreen('flashcards')}
        >
          <span className="nav-icon">🎴</span>
          <span className="nav-label">Cards</span>
        </button>
        <button
          className={`nav-item ${activeScreen === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveScreen('dashboard')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Stats</span>
        </button>
      </nav>
    </div>
  )
}

export default App
