import React from 'react';
import { Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function CalendarView({ modules, completedLessons, onSelectLesson }) {
  // Flatten all lessons into a step-by-step sequence
  let dayCounter = 1;
  const schedule = [];

  modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
      schedule.push({
        step: dayCounter++,
        moduleNumber: mod.number,
        moduleTitle: mod.title,
        lesson
      });
    });
  });

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>📅 Complete DevOps Mastery Roadmap (49 Daily Lessons)</h2>
        <p style={{ color: '#94a3b8' }}>
          Follow this structured step-by-step track (approx. 45-60 minutes each). By Lesson 49, you will be able to deploy, secure, and maintain production cloud servers completely on your own.
        </p>
      </div>

      <div className="calendar-grid">
        {schedule.map(item => {
          const isDone = !!completedLessons[item.lesson.id];

          return (
            <div 
              key={item.step} 
              className={`day-card ${isDone ? 'completed' : ''}`}
              onClick={() => onSelectLesson(item.lesson.id)}
            >
              <div className="day-card-top">
                <span className="day-number-pill">Lesson {item.step}</span>
                {isDone ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending</span>
                )}
              </div>

              <h4>{item.lesson.title}</h4>

              <div className="day-card-meta">
                <span>Mod {item.moduleNumber}: {item.moduleTitle.split(' ')[0]}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {item.lesson.timeEstimate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
