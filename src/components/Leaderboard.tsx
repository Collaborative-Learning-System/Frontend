import React, { useState } from 'react';
import './Leaderboard.css';

interface UserScore {
  id: number;
  name: string;
  avatar: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  rank: number;
  // badges: string[];
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  groupId: number;
}

const mockLeaderboardData: { [key: number]: UserScore[] } = {
  1: [ // Computer Security
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: '👨‍💻',
      totalScore: 285,
      quizzesCompleted: 15,
      averageScore: 95,
      rank: 1,
      isCurrentUser: false
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      totalScore: 270,
      quizzesCompleted: 14,
      averageScore: 90,
      rank: 2,
      isCurrentUser: false
    },
    {
      id: 3,
      name: 'You',
      avatar: '👤',
      totalScore: 245,
      quizzesCompleted: 12,
      averageScore: 85,
      rank: 3,
      isCurrentUser: true
    },
    {
      id: 4,
      name: 'Mike Rodriguez',
      avatar: '👨‍🎓',
      totalScore: 220,
      quizzesCompleted: 11,
      averageScore: 82,
      rank: 4,
  // badges: ['🔑'],
      isCurrentUser: false
    },
    {
      id: 5,
      name: 'Emma Wilson',
      avatar: '👩‍🔬',
      totalScore: 210,
      quizzesCompleted: 10,
      averageScore: 80,
      rank: 5,
  // badges: ['🛡️'],
      isCurrentUser: false
    }
  ],
  2: [ // Software Engineering
    {
      id: 6,
      name: 'David Kim',
      avatar: '👨‍💻',
      totalScore: 295,
      quizzesCompleted: 16,
      averageScore: 92,
      rank: 1,
  // badges: ['🏆', '💻', '⚡'],
      isCurrentUser: false
    },
    {
      id: 7,
      name: 'Lisa Zhang',
      avatar: '👩‍💻',
      totalScore: 280,
      quizzesCompleted: 15,
      averageScore: 88,
      rank: 2,
  // badges: ['🥈', '🔧', '📚'],
      isCurrentUser: false
    },
    {
      id: 3,
      name: 'You',
      avatar: '👤',
      totalScore: 250,
      quizzesCompleted: 13,
      averageScore: 83,
      rank: 3,
  // badges: ['🥉', '⚙️'],
      isCurrentUser: true
    }
  ],
  3: [ // Business Analysis
    {
      id: 8,
      name: 'Jennifer Brown',
      avatar: '👩‍💼',
      totalScore: 275,
      quizzesCompleted: 14,
      averageScore: 89,
      rank: 1,
  // badges: ['🏆', '📊', '💼'],
      isCurrentUser: false
    },
    {
      id: 3,
      name: 'You',
      avatar: '👤',
      totalScore: 230,
      quizzesCompleted: 11,
      averageScore: 78,
      rank: 2,
  // badges: ['🥈', '📈'],
      isCurrentUser: true
    }
  ]
};



const Leaderboard: React.FC<LeaderboardProps> = ({ groupId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');
  
  const leaderboardData = mockLeaderboardData[groupId] || [];
  // Display podium as 2-1-3 order
  const topThreeRaw = leaderboardData.slice(0, 3);
  const topThree = [topThreeRaw[1], topThreeRaw[0], topThreeRaw[2]].filter(Boolean);
  // const others = leaderboardData.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#0077ff';
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <div className="period-selector">
          <button 
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            This Week
          </button>
          <button 
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </button>
          <button 
            className={selectedPeriod === 'all' ? 'active' : ''}
            onClick={() => setSelectedPeriod('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium-container">
        <h3>Top Performers</h3>
        <div className="podium">
          {topThree.map((user) => (
            <div 
              key={user.id} 
              className={`podium-item rank-${user.rank} ${user.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="podium-rank" style={{ color: getRankColor(user.rank) }}>
                {getRankIcon(user.rank)}
              </div>
              <div className="podium-avatar">{user.avatar}</div>
              <div className="podium-info">
                <div className="podium-name">{user.name}</div>
                <div className="podium-score">{user.totalScore} pts</div>
                <div className="podium-average">{user.averageScore}% avg</div>
              </div>
              {/* badges removed */}
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="leaderboard-list">
        <h3>Full Rankings</h3>
        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Score</span>
            <span>Quizzes</span>
            <span>Average</span>
            {/* <span>Badges</span> */}
          </div>
          
          {leaderboardData.map((user) => (
            <div 
              key={user.id} 
              className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank-cell">
                <span 
                  className="rank-badge"
                  style={{ color: getRankColor(user.rank) }}
                >
                  {getRankIcon(user.rank)}
                </span>
              </div>
              
              <div className="player-cell">
                <div className="player-info">
                  <span className="player-name">{user.name}</span>
                  {user.isCurrentUser && <span className="you-indicator">YOU</span>}
                </div>
              </div>
              
              <div className="score-cell">
                <span className="total-score">{user.totalScore}</span>
                <span className="score-label">pts</span>
              </div>
              
              <div className="quizzes-cell">
                {user.quizzesCompleted}
              </div>
              
              <div className="average-cell">
                <span className="average-score">{user.averageScore}%</span>
              </div>
              
              {/* badges removed */}
            </div>
          ))}
        </div>
      </div>

      {leaderboardData.length === 0 && (
        <div className="no-data">
          <p>No leaderboard data available for this group yet.</p>
          <p>Complete some quizzes to see rankings!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
