import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="screen">
        <div className="screen-header">
          <h1>Dashboard</h1>
        </div>
        <div className="empty-state">
          <p>Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card streak">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats?.streak || 0}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          <div className="stat-card due">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats?.cardsDue || 0}</div>
            <div className="stat-label">Cards Due</div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">💡</div>
            <div className="stat-value">{stats?.totalCards || 0}</div>
            <div className="stat-label">Total Cards</div>
          </div>

          <div className="stat-card sessions">
            <div className="stat-icon">✏️</div>
            <div className="stat-value">{stats?.totalSessions || 0}</div>
            <div className="stat-label">Sessions</div>
          </div>
        </div>

        <div className="recent-sessions">
          <h2>Recent Sessions</h2>
          {stats?.recentSessions && stats.recentSessions.length > 0 ? (
            <div className="sessions-list">
              {stats.recentSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-icon">📖</div>
                  <div className="session-info">
                    <div className="session-date">
                      {new Date(session.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="session-messages">
                      {session.messages.length} messages
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-sessions">No sessions yet. Start studying to see your history!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
