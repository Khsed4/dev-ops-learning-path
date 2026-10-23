import React from 'react';
import { Terminal, Shield, CheckCircle2, Map, BookOpen, Calendar, Network, FileCode } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, completedCount, totalLessons }) {
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setActiveTab('overview')}>
        <div className="brand-icon">
          <Terminal size={22} />
        </div>
        <div className="brand-text">
          <h1>Sama DevOps Mastery</h1>
          <p>Zero to Cloud Production Hero</p>
        </div>
      </div>

      <div className="nav-progress-wrapper">
        <span className="progress-label">Your Mastery:</span>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
        <span className="progress-percent">{percent}% ({completedCount}/{totalLessons})</span>
      </div>

      <nav className="nav-tabs">
        <button 
          className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Map size={16} /> Overview
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          <BookOpen size={16} /> Lessons
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={16} /> 30-Day Plan
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          <Network size={16} /> Architecture
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'cheatsheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('cheatsheet')}
        >
          <FileCode size={16} /> Cheat Sheet
        </button>
      </nav>
    </header>
  );
}
