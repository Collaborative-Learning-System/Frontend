import { useState } from 'react';
import ChatUI from '../components/ChatUI';
import Quiz from '../components/Quiz';
import Leaderboard from '../components/Leaderboard';
import '../App.css';
import './Workspace.css';

const groups = [
  { id: 1, name: 'Computer Security' },
  { id: 2, name: 'Software Engineering' },
  { id: 3, name: 'Business Analysis' },
];


const Workspace = () => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0].id);
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="workspace-glass-root" style={{flexDirection: 'column', gap: 0, padding: 0}}>
      {/* Header at the top */}
      <header className="glass-panel workspace-header" style={{margin: 0, borderRadius: '0 0 24px 24px', padding: '32px 40px 24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1 className="workspace-title">Semester 5 Workspace</h1>
          <p className="workspace-desc">A short description of the workspace goes here.</p>
        </div>
        <div className="workspace-meta">
          <span className="role-label admin">Admin</span>
          <span className="member-count">12 Members</span>
          <button className="leave-btn">Leave</button>
        </div>
      </header>

      {/* Main content: sidebar + group content */}
      <div style={{display: 'flex', flex: 1, minHeight: '0', gap: 24, padding: '24px'}}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-icon">📚</span>
            <h2 className="sidebar-title">Groups</h2>
          </div>
          
          <nav className="groups-nav">
            {groups.map((group) => (
              <button
                key={group.id}
                className={`group-btn ${selectedGroup === group.id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group.id)}
              >
                <span className="group-name">{group.name}</span>
              </button>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <button className="add-group-btn">
              <span>+</span>
              <span>Add Group</span>
            </button>
          </div>
        </aside>

        {/* Group content */}
        <main className="glass-panel main-section" style={{margin: 0, padding: '32px 40px', minHeight: 0}}>
          <div className="group-ui">
            <div className="group-tabs">
              <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>Chat</button>
              <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => setActiveTab('quiz')}>Quiz</button>
              <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
            </div>
            <div className="group-tab-content">
              {activeTab === 'chat' && <ChatUI />}
              {activeTab === 'quiz' && <Quiz groupId={selectedGroup} />}
              {activeTab === 'leaderboard' && <Leaderboard groupId={selectedGroup} />}
            </div>
          </div>
        </main>
      </div>          
    </div>
  );
}

export default Workspace;
