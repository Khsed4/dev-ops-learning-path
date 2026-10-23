import React from 'react';
import { 
  Terminal, Cloud, Globe, Shield, Key, Box, Server, Database, RefreshCw, Lock, 
  ArrowRight, CheckCircle2, Clock, FileCode
} from 'lucide-react';

const iconMap = {
  Terminal, Cloud, Globe, Shield, Key, Box, Server, Database, RefreshCw, Lock, FileCode
};

export default function RoadmapCardsView({ modules, completedLessons, onSelectLesson }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          🗺️ Sama DevOps Curriculum Overview
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '0.5rem' }}>
          A 13-module progressive curriculum with 49 hands-on lessons taking you from fundamental Linux commands to advanced zero-downtime container deployments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {modules.map(mod => {
          const IconComp = iconMap[mod.icon] || Terminal;
          const completedCount = mod.lessons.filter(l => completedLessons[l.id]).length;
          const percent = Math.round((completedCount / mod.lessons.length) * 100);
          const firstLessonId = mod.lessons[0]?.id;

          return (
            <div 
              key={mod.id} 
              className="section-card"
              style={{ cursor: 'pointer', transition: 'var(--transition)' }}
              onClick={() => onSelectLesson(firstLessonId)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#a78bfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComp size={22} />
                </div>
                <span className="badge badge-time">{mod.days}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 600, textTransform: 'uppercase' }}>
                  Module {mod.number} • {mod.level}
                </span>
                <h3 style={{ marginTop: '0.25rem', fontSize: '1.2rem' }}>{mod.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  {mod.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  <span>{completedCount} of {mod.lessons.length} lessons completed</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>{percent}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
