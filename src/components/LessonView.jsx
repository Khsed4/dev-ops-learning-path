import React, { useState } from 'react';
import { 
  Lightbulb, ShieldCheck, Clock, FileText, Terminal, Copy, Check, 
  ChevronRight, ChevronLeft, CheckCircle2, HelpCircle, Eye, EyeOff, Award 
} from 'lucide-react';

export default function LessonView({ 
  lesson, 
  moduleInfo, 
  isCompleted, 
  onToggleComplete, 
  onPrev, 
  onNext, 
  hasPrev, 
  hasNext 
}) {
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  if (!lesson) {
    return (
      <div className="lesson-view" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Select a lesson from the sidebar to begin learning!</h2>
      </div>
    );
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(index);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const levelClass = moduleInfo.level.toLowerCase().includes('beginner') 
    ? 'badge-level-beginner' 
    : moduleInfo.level.toLowerCase().includes('intermediate') 
    ? 'badge-level-intermediate' 
    : 'badge-level-advanced';

  return (
    <div className="lesson-view">
      {/* Header */}
      <div className="lesson-header">
        <div className="lesson-meta-badges">
          <span className="badge badge-module">Module {moduleInfo.number}: {moduleInfo.title}</span>
          <span className={`badge ${levelClass}`}>{moduleInfo.level}</span>
          <span className="badge badge-time"><Clock size={13} /> {lesson.timeEstimate}</span>
        </div>
        <h2>{lesson.title}</h2>
      </div>

      {/* deploy.md Reference */}
      <div className="deploy-ref-box">
        <FileText size={22} className="deploy-ref-icon" />
        <div className="deploy-ref-text">
          <h4>Where this appears in deploy.md:</h4>
          <p>{lesson.deployRef}</p>
        </div>
      </div>

      {/* Real World Analogy Box for ESL Learners */}
      <div className="analogy-box">
        <div className="analogy-header">
          <Lightbulb size={24} color="#f59e0b" />
          <h3>Simple Real-Life Analogy (Think of it like this)</h3>
        </div>
        <p className="analogy-content">{lesson.analogy}</p>
      </div>

      {/* Why It Matters */}
      <div className="section-card">
        <h3><ShieldCheck size={20} color="#10b981" /> Why this matters in production</h3>
        <p>{lesson.whyItMatters}</p>
      </div>

      {/* Key Concepts */}
      <div className="section-card">
        <h3><HelpCircle size={20} color="#8b5cf6" /> Core Concepts & Plain Explanations</h3>
        <div className="concepts-text">{lesson.keyConcept}</div>
      </div>

      {/* Commands & Flags */}
      {lesson.commands && lesson.commands.length > 0 && (
        <div className="terminal-block">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red"></span>
              <span className="terminal-dot dot-yellow"></span>
              <span className="terminal-dot dot-green"></span>
            </div>
            <span className="terminal-title">Terminal Commands & Flags Explained</span>
            <div></div>
          </div>
          <div className="terminal-commands-list">
            {lesson.commands.map((c, idx) => (
              <div key={idx} className="cmd-row">
                <div className="cmd-code-line">
                  <code>$ {c.cmd}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy(c.cmd, idx)}
                  >
                    {copiedCmd === idx ? <><Check size={14} color="#10b981" /> Copied!</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                <p className="cmd-explanation">{c.explain}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Hands-on Exercise */}
      {lesson.exercise && (
        <div className="exercise-box">
          <div className="exercise-header">
            <div className="exercise-header-left">
              <Award size={24} color="#10b981" />
              <h3>{lesson.exercise.title}</h3>
            </div>
            <span className="exercise-badge">Hands-On Practice</span>
          </div>

          <p className="exercise-objective"><strong>🎯 Objective:</strong> {lesson.exercise.objective}</p>

          <div className="exercise-steps-list">
            {lesson.exercise.steps.map((step, idx) => (
              <label key={idx} className="exercise-step-item">
                <input 
                  type="checkbox" 
                  className="step-checkbox" 
                  checked={!!completedSteps[idx]}
                  onChange={() => toggleStep(idx)}
                />
                <span className="step-text">{step}</span>
              </label>
            ))}
          </div>

          {lesson.exercise.testCommand && (
            <div className="cmd-row" style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 600 }}>Verification / Test Command:</span>
              <div className="cmd-code-line" style={{ background: '#022c22', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <code style={{ color: '#6ee7b7' }}>$ {lesson.exercise.testCommand}</code>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopy(lesson.exercise.testCommand, 'test-cmd')}
                >
                  {copiedCmd === 'test-cmd' ? <><Check size={14} color="#10b981" /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>
          )}

          <div className="exercise-solution-drawer">
            <button 
              className="solution-toggle-btn"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? <><EyeOff size={16} /> Hide Solution</> : <><Eye size={16} /> Reveal Solution & Deep Explanation</>}
            </button>

            {showSolution && (
              <div className="solution-content">
                <pre>{lesson.exercise.solution}</pre>
                <p className="solution-explanation-text">
                  <strong>💡 Pro Explanation:</strong> {lesson.exercise.solutionExplanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="lesson-nav-footer">
        <button 
          className="nav-arrow-btn" 
          onClick={onPrev}
          disabled={!hasPrev}
        >
          <ChevronLeft size={18} /> Previous Lesson
        </button>

        <button 
          className={`complete-lesson-btn ${isCompleted ? 'is-completed' : ''}`}
          onClick={onToggleComplete}
        >
          <CheckCircle2 size={18} />
          {isCompleted ? "Completed! (Click to redo)" : "Mark Lesson as Complete"}
        </button>

        <button 
          className="nav-arrow-btn" 
          onClick={onNext}
          disabled={!hasNext}
        >
          Next Lesson <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
