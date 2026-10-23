import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LessonView from './components/LessonView';
import CalendarView from './components/CalendarView';
import ArchitectureView from './components/ArchitectureView';
import CheatSheetView from './components/CheatSheetView';
import RoadmapCardsView from './components/RoadmapCardsView';
import { roadmapData } from './data/roadmapData';

export default function App() {
  const [activeTab, setActiveTab] = useState('lessons'); // 'overview' | 'lessons' | 'calendar' | 'architecture' | 'cheatsheet'
  const [activeLessonId, setActiveLessonId] = useState('m1-l1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  
  // Persistent completed lessons state
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('sama_devops_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sama_devops_completed_lessons', JSON.stringify(completedLessons));
    } catch (e) {
      console.error(e);
    }
  }, [completedLessons]);

  const toggleComplete = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Find active lesson and module
  let currentLesson = null;
  let currentModule = null;
  let allLessonsList = [];

  roadmapData.modules.forEach(mod => {
    mod.lessons.forEach(l => {
      allLessonsList.push({ lesson: l, module: mod });
      if (l.id === activeLessonId) {
        currentLesson = l;
        currentModule = mod;
      }
    });
  });

  const currentIndex = allLessonsList.findIndex(item => item.lesson.id === activeLessonId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessonsList.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setActiveLessonId(allLessonsList[currentIndex - 1].lesson.id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setActiveLessonId(allLessonsList[currentIndex + 1].lesson.id);
    }
  };

  const handleSelectLessonFromAnywhere = (lessonId) => {
    setActiveLessonId(lessonId);
    setActiveTab('lessons');
  };

  const handleJumpToModule = (modId) => {
    const mod = roadmapData.modules.find(m => m.id === modId);
    if (mod && mod.lessons[0]) {
      setActiveLessonId(mod.lessons[0].id);
      setActiveTab('lessons');
    }
  };

  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const totalLessons = allLessonsList.length;

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        completedCount={completedCount}
        totalLessons={totalLessons}
      />

      <div className="main-layout">
        {activeTab === 'lessons' && (
          <Sidebar 
            modules={roadmapData.modules}
            activeLessonId={activeLessonId}
            setActiveLessonId={setActiveLessonId}
            completedLessons={completedLessons}
            toggleComplete={toggleComplete}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterLevel={filterLevel}
            setFilterLevel={setFilterLevel}
          />
        )}

        <main className="content-area">
          {activeTab === 'overview' && (
            <RoadmapCardsView 
              modules={roadmapData.modules}
              completedLessons={completedLessons}
              onSelectLesson={handleSelectLessonFromAnywhere}
            />
          )}

          {activeTab === 'lessons' && (
            <LessonView 
              lesson={currentLesson}
              moduleInfo={currentModule}
              isCompleted={!!completedLessons[activeLessonId]}
              onToggleComplete={() => toggleComplete(activeLessonId)}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              modules={roadmapData.modules}
              completedLessons={completedLessons}
              onSelectLesson={handleSelectLessonFromAnywhere}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView 
              onJumpToModule={handleJumpToModule}
            />
          )}

          {activeTab === 'cheatsheet' && (
            <CheatSheetView />
          )}
        </main>
      </div>
    </div>
  );
}
