import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, ChevronRight, CheckCircle2, Circle, 
  Terminal, Cloud, Globe, Shield, Key, Box, Server, Database, RefreshCw, Lock, FileCode,
  ChevronsUpDown, X, Columns, List, Clock, Sparkles, BookOpen
} from 'lucide-react';

const iconMap = {
  Terminal, Cloud, Globe, Shield, Key, Box, Server, Database, RefreshCw, Lock, FileCode
};

export default function Sidebar({ 
  modules, 
  activeLessonId, 
  setActiveLessonId, 
  completedLessons, 
  toggleComplete,
  searchQuery,
  setSearchQuery,
  filterLevel,
  setFilterLevel
}) {
  // Sidebar view layout: 'dual' (2 Columns: Modules | Lessons) or 'single' (1 Column Accordion)
  const [sidebarLayout, setSidebarLayout] = useState(() => {
    try {
      return localStorage.getItem('sama_sidebar_layout') || 'dual';
    } catch (e) {
      return 'dual';
    }
  });

  // Track which module is selected in Dual Column mode
  const [selectedModuleId, setSelectedModuleId] = useState(() => {
    for (const m of modules) {
      if (m.lessons.some(l => l.id === activeLessonId)) {
        return m.id;
      }
    }
    return modules[0]?.id || 'module-1';
  });

  // Keep selectedModuleId in sync if activeLessonId changes from outside (e.g. Next/Prev buttons)
  useEffect(() => {
    for (const m of modules) {
      if (m.lessons.some(l => l.id === activeLessonId)) {
        setSelectedModuleId(m.id);
        break;
      }
    }
  }, [activeLessonId, modules]);

  // Expanded modules for single-column mode
  const [expandedModules, setExpandedModules] = useState({ [selectedModuleId]: true });

  const handleLayoutChange = (mode) => {
    setSidebarLayout(mode);
    try {
      localStorage.setItem('sama_sidebar_layout', mode);
    } catch (e) {}
  };

  const toggleModuleAccordion = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const expandAll = () => {
    const all = {};
    modules.forEach(m => { all[m.id] = true; });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  const isAllExpanded = modules.every(m => expandedModules[m.id]);

  // Filter modules and lessons
  const filteredModules = modules.map(mod => {
    const lessons = mod.lessons.filter(les => {
      const matchesSearch = 
        les.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        les.analogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        les.keyConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        les.deployRef.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = filterLevel === 'All' || mod.level.toLowerCase().includes(filterLevel.toLowerCase());
      return matchesSearch && matchesLevel;
    });

    return { ...mod, filteredLessons: lessons };
  }).filter(mod => mod.filteredLessons.length > 0);

  // Selected module in dual mode
  const currentSelectedMod = filteredModules.find(m => m.id === selectedModuleId) || filteredModules[0] || modules[0];

  return (
    <aside className={`sidebar ${sidebarLayout === 'dual' ? 'mode-dual' : 'mode-single'}`}>
      {/* Top Search & Filter Bar */}
      <div className="sidebar-header">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            className="search-input"
            placeholder="Search 50+ topics, commands, deploy.md..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sidebar-controls-row">
          <div className="difficulty-filters">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button 
                key={level}
                className={`filter-chip ${filterLevel === level ? 'active' : ''}`}
                onClick={() => setFilterLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="sidebar-layout-controls">
            {/* 2-Columns vs 1-Column Toggle */}
            <div className="layout-toggle-group">
              <button 
                className={`layout-btn ${sidebarLayout === 'dual' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('dual')}
                title="2 Columns: Modules on left, Lessons on right (Clear, Wide, Highly Readable)"
              >
                <Columns size={13} />
                <span>2 Cols</span>
              </button>
              <button 
                className={`layout-btn ${sidebarLayout === 'single' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('single')}
                title="1 Column: Single vertical list with collapsible accordion"
              >
                <List size={13} />
                <span>1 Col</span>
              </button>
            </div>

            {sidebarLayout === 'single' && (
              <button 
                className="expand-toggle-btn"
                onClick={isAllExpanded ? collapseAll : expandAll}
                title={isAllExpanded ? "Collapse All" : "Expand All"}
              >
                <ChevronsUpDown size={13} />
                <span>{isAllExpanded ? "Collapse" : "Expand"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DUAL COLUMN MODE (Modules on Left, Lessons on Right) */}
      {sidebarLayout === 'dual' ? (
        <div className="sidebar-dual-wrapper">
          {/* Column 1: Modules List */}
          <div className="sidebar-col-modules">
            <div className="col-subhead">
              <span>MODULES ({filteredModules.length})</span>
            </div>

            {filteredModules.map(mod => {
              const IconComp = iconMap[mod.icon] || Terminal;
              const isSelected = mod.id === currentSelectedMod?.id;
              const completedCount = mod.lessons.filter(l => completedLessons[l.id]).length;
              const allDone = completedCount === mod.lessons.length && mod.lessons.length > 0;
              const hasActiveLesson = mod.lessons.some(l => l.id === activeLessonId);

              return (
                <div 
                  key={mod.id} 
                  className={`dual-module-item ${isSelected ? 'selected' : ''} ${hasActiveLesson ? 'has-active' : ''}`}
                  onClick={() => setSelectedModuleId(mod.id)}
                >
                  <div className="dual-module-badge">
                    <span>{mod.number}</span>
                  </div>

                  <div className="dual-module-content">
                    <div className="dual-module-title-row">
                      <span className="dual-module-title">{mod.title}</span>
                      <ChevronRight size={14} className="dual-module-arrow" />
                    </div>
                    <div className="dual-module-meta">
                      <span className="dual-module-days">{mod.days}</span>
                      <span className="dual-meta-dot">•</span>
                      <span className={`dual-status-badge ${allDone ? 'all-done' : ''}`}>
                        {allDone ? "✓ Done" : `${completedCount}/${mod.lessons.length}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Lessons List for Selected Module */}
          <div className="sidebar-col-lessons">
            {currentSelectedMod ? (
              <>
                <div className="dual-lessons-header">
                  <div className="dual-lessons-mod-header-badge">
                    <span className="mod-pill-badge">Module {currentSelectedMod.number}</span>
                    <span className="level-pill-badge">{currentSelectedMod.level}</span>
                  </div>
                  <h4 className="dual-lessons-mod-title">{currentSelectedMod.title}</h4>
                  <p className="dual-lessons-mod-desc">{currentSelectedMod.description}</p>
                </div>

                <div className="dual-lessons-list">
                  {currentSelectedMod.filteredLessons.map((lesson, idx) => {
                    const isCompleted = !!completedLessons[lesson.id];
                    const isActive = activeLessonId === lesson.id;
                    const lessonNum = `${currentSelectedMod.number}.${idx + 1}`;

                    return (
                      <div 
                        key={lesson.id}
                        className={`dual-lesson-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => setActiveLessonId(lesson.id)}
                      >
                        <div className="dual-lesson-top">
                          <button 
                            className={`lesson-check-circle ${isCompleted ? 'checked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(lesson.id);
                            }}
                            title={isCompleted ? "Mark incomplete" : "Mark completed"}
                          >
                            {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </button>

                          <div className="dual-lesson-title-area">
                            <span className="dual-lesson-num">Lesson {lessonNum}</span>
                            <h5 className="dual-lesson-title">{lesson.title}</h5>
                          </div>
                        </div>

                        <div className="dual-lesson-footer">
                          <span className="dual-lesson-time">
                            <Clock size={11} /> {lesson.timeEstimate}
                          </span>
                          <span className="dual-lesson-deploy-tag" title={lesson.deployRef}>
                            {lesson.keyConcept || "Hands-on Exercise"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="dual-empty-state">
                <BookOpen size={32} />
                <p>No modules match your current filter.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SINGLE COLUMN ACCORDION MODE (With Guaranteed flex-shrink: 0 and zero squish) */
        <div className="sidebar-modules">
          {filteredModules.map(mod => {
            const isExpanded = expandedModules[mod.id] || searchQuery.length > 0;
            const completedInMod = mod.lessons.filter(l => completedLessons[l.id]).length;
            const allDone = completedInMod === mod.lessons.length && mod.lessons.length > 0;

            return (
              <div key={mod.id} className={`module-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="module-card-header" onClick={() => toggleModuleAccordion(mod.id)}>
                  <div className="module-badge-box">
                    <span className="module-num">{mod.number}</span>
                  </div>

                  <div className="module-info-box">
                    <h3 className="module-card-title">{mod.title}</h3>
                    <div className="module-card-sub">
                      <span className="module-days-text">{mod.days}</span>
                      <span className="meta-bullet">•</span>
                      <span className={`module-status-pill ${allDone ? 'all-done' : ''}`}>
                        {allDone ? "✓ Done" : `${completedInMod}/${mod.lessons.length} done`}
                      </span>
                    </div>
                  </div>

                  <div className={`module-chevron ${isExpanded ? 'rotated' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="module-lessons-container">
                    {mod.filteredLessons.map((lesson, idx) => {
                      const isCompleted = !!completedLessons[lesson.id];
                      const isActive = activeLessonId === lesson.id;
                      const lessonNum = `${mod.number}.${idx + 1}`;

                      return (
                        <div 
                          key={lesson.id}
                          className={`lesson-row ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                          onClick={() => setActiveLessonId(lesson.id)}
                        >
                          <div className="lesson-row-left">
                            <button 
                              className={`lesson-check-circle ${isCompleted ? 'checked' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(lesson.id);
                              }}
                              title={isCompleted ? "Mark incomplete" : "Mark completed"}
                            >
                              {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            </button>
                            <span className="lesson-prefix">{lessonNum}</span>
                            <span className="lesson-name">{lesson.title}</span>
                          </div>
                          <span className="lesson-time-pill">{lesson.timeEstimate}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
