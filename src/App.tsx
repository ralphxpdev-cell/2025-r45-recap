import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Supabase is configured
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('tasks').select('count', { count: 'exact', head: true })
        if (error) {
          // If error is about auth, connection is working but user needs to authenticate
          if (error.message.includes('JWT') || error.message.includes('auth')) {
            setIsConnected(true)
            setError('Supabase connected. Authentication required to view tasks.')
          } else {
            setError(error.message)
          }
        } else {
          setIsConnected(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase')
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>2025 R45 Recap</h1>
        <h2>Auto-Tagging Task System</h2>
      </header>

      <main className="app-main">
        <div className="status-card">
          <h3>System Status</h3>

          <div className="status-item">
            <span className="status-label">Supabase Connection:</span>
            <span className={`status-value ${isConnected ? 'success' : 'pending'}`}>
              {isConnected ? '✓ Connected' : '⏳ Checking...'}
            </span>
          </div>

          {error && (
            <div className="status-item">
              <span className="status-label">Message:</span>
              <span className="status-value info">{error}</span>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>🎯 Design Philosophy</h3>
          <ul>
            <li>User never selects categories</li>
            <li>Every task text is automatically analyzed</li>
            <li>System assigns hidden tags: Action Domain, Energy Type, Time Weight</li>
            <li>No category UI on daily screen</li>
            <li>User sees insights as natural language summaries, not charts</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📊 Next Steps</h3>
          <ol>
            <li>Set up Supabase (see <code>SUPABASE_SETUP.md</code>)</li>
            <li>Configure environment variables (copy <code>.env.example</code> to <code>.env</code>)</li>
            <li>Build the task management UI</li>
            <li>Implement insights dashboard</li>
          </ol>
        </div>

        <div className="info-card">
          <h3>🔧 Tag Categories</h3>
          <div className="tag-grid">
            <div className="tag-category">
              <h4>Action Domain</h4>
              <ul>
                <li>work_project</li>
                <li>health_wellness</li>
                <li>learning_growth</li>
                <li>social_connection</li>
                <li>creative_expression</li>
              </ul>
            </div>
            <div className="tag-category">
              <h4>Energy Type</h4>
              <ul>
                <li>deep_focus</li>
                <li>light_activity</li>
                <li>social_energy</li>
                <li>creative_flow</li>
                <li>routine_execution</li>
              </ul>
            </div>
            <div className="tag-category">
              <h4>Time Weight</h4>
              <ul>
                <li>quick_win</li>
                <li>moderate_effort</li>
                <li>deep_work</li>
                <li>ongoing_commitment</li>
                <li>waiting_on_others</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Auto-Tagging Task Management System</p>
        <p>Built with React + TypeScript + Supabase</p>
      </footer>
    </div>
  )
}

export default App
