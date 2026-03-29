import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Calendar, ChevronDown, AlertTriangle, Check, Clock, GripHorizontal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CapacityDetailModal from './CapacityDetailModal';

const StrategicCapacityScreen = ({ staffRoster = [], phases = [], onUpdatePhases }) => {
  const { isDarkMode } = useTheme();
  const [selectedPhaseId, setSelectedPhaseId] = useState(phases[0]?.id || null);
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [projectColWidth, setProjectColWidth] = useState(192);
  const [isResizingCol, setIsResizingCol] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const containerRef = useRef(null);
  const wasDraggingRef = useRef(false);

  const selectedPhase = phases.find(p => p.id === selectedPhaseId);

  // Generate days array for the selected phase
  const phaseDays = useMemo(() => {
    if (!selectedPhase) return [];
    const start = new Date(selectedPhase.startDate);
    const end = new Date(selectedPhase.endDate);
    const days = [];
    const current = new Date(start);

    while (current <= end) {
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;

      // Skip weekends if excludeWeekends is enabled
      if (excludeWeekends && isWeekend) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      days.push({
        date: current.toISOString().split('T')[0],
        dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
        dateDisplay: `${month}/${day}`,
        formattedDate: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isWeekend,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [selectedPhase, excludeWeekends]);

  // Get accepted projects sorted by rating
  const acceptedProjects = useMemo(() => {
    if (!selectedPhase) return [];
    return selectedPhase.projects
      .filter(p => p.status === 'accepted')
      .sort((a, b) => b.overallScore - a.overallScore);
  }, [selectedPhase]);

  // Calculate capacity for each project on each day with real staff assignment
  const projectCapacity = useMemo(() => {
    const capacity = {};

    // Initialize capacity for all projects
    acceptedProjects.forEach(project => {
      capacity[project.id] = phaseDays.map(() => ({
        inRange: false,
        required: 0,
        assigned: 0,
        gap: 0,
        assignedStaff: [],
      }));
    });

    // For each day, assign staff to projects in priority order (by rating)
    phaseDays.forEach((day, dayIndex) => {
      // Track which staff are available this day
      const availableStaff = staffRoster.map((staff, index) => ({
        ...staff,
        index,
        available: true,
      }));

      // Go through projects in order (already sorted by rating desc)
      acceptedProjects.forEach(project => {
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        const dayDate = new Date(day.date);

        const isInRange = dayDate >= projectStart && dayDate <= projectEnd;

        // Get staffing needs for this project
        const staffingNeeds = project.staffingNeeds || [];
        const requiredRoles = staffingNeeds.map(n => ({ role: n.role, count: n.count }));
        const totalRequired = staffingNeeds.reduce((sum, n) => sum + n.count, 0);

        if (!isInRange) {
          capacity[project.id][dayIndex] = {
            inRange: false,
            required: 0,
            assigned: 0,
            gap: 0,
            assignedStaff: [],
            requiredRoles,
          };
          return;
        }

        const assignedStaff = [];

        // Try to assign staff for each role needed
        staffingNeeds.forEach(need => {
          let countNeeded = need.count;

          // Find available staff with matching role
          availableStaff.forEach(staff => {
            if (countNeeded > 0 && staff.available && staff.role === need.role) {
              assignedStaff.push(staff.index);
              staff.available = false;
              countNeeded--;
            }
          });
        });

        const assigned = assignedStaff.length;
        const gap = totalRequired - assigned;

        capacity[project.id][dayIndex] = {
          inRange: true,
          required: totalRequired,
          assigned,
          gap,
          assignedStaff,
          requiredRoles,
        };
      });
    });

    return capacity;
  }, [acceptedProjects, phaseDays, staffRoster]);

  // Calculate summary stats
  // Red = no staff, Yellow = partial staff, Green = fully staffed
  const stats = useMemo(() => {
    let noStaff = 0;
    let partialStaff = 0;
    let fullyStaffed = 0;

    Object.values(projectCapacity).forEach(days => {
      days.forEach(day => {
        if (day.inRange) {
          if (day.assigned === 0 && day.required > 0) noStaff++;
          else if (day.assigned < day.required) partialStaff++;
          else fullyStaffed++;
        }
      });
    });

    return { noStaff, partialStaff, fullyStaffed };
  }, [projectCapacity]);

  // Get cell color based on capacity
  // Green = all needed staff filled, Yellow = some staff filled, Red = no staff available
  const getCellColor = (dayData) => {
    if (!dayData.inRange) return null;
    if (dayData.assigned === 0 && dayData.required > 0) return 'bg-red-100 border-red-300'; // No staff
    if (dayData.assigned < dayData.required) return 'bg-amber-100 border-amber-300'; // Partial staff
    return 'bg-emerald-100 border-emerald-300'; // Fully staffed
  };

  // Handle drag start
  const handleDragStart = (e, project, type) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setDragState({
      projectId: project.id,
      type, // 'start', 'end', or 'move'
      startX: e.clientX,
      originalStart: project.startDate,
      originalEnd: project.endDate,
      containerLeft: rect.left,
    });
  };

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!dragState || !selectedPhase) return;

    const dayWidth = 32; // Width of each day column
    const deltaX = e.clientX - dragState.startX;
    const daysDelta = Math.round(deltaX / dayWidth);

    if (daysDelta === 0) return;

    // Mark that an actual drag occurred
    wasDraggingRef.current = true;

    const project = acceptedProjects.find(p => p.id === dragState.projectId);
    if (!project) return;

    const phaseStart = new Date(selectedPhase.startDate);
    const phaseEnd = new Date(selectedPhase.endDate);

    let newStart = new Date(dragState.originalStart);
    let newEnd = new Date(dragState.originalEnd);

    if (dragState.type === 'start') {
      newStart.setDate(newStart.getDate() + daysDelta);
      // Ensure start doesn't go past end or outside phase
      if (newStart >= newEnd) newStart = new Date(newEnd.getTime() - 24 * 60 * 60 * 1000);
      if (newStart < phaseStart) newStart = new Date(phaseStart);
    } else if (dragState.type === 'end') {
      newEnd.setDate(newEnd.getDate() + daysDelta);
      // Ensure end doesn't go before start or outside phase
      if (newEnd <= newStart) newEnd = new Date(newStart.getTime() + 24 * 60 * 60 * 1000);
      if (newEnd > phaseEnd) newEnd = new Date(phaseEnd);
    } else if (dragState.type === 'move') {
      const duration = new Date(dragState.originalEnd) - new Date(dragState.originalStart);
      newStart.setDate(newStart.getDate() + daysDelta);
      newEnd = new Date(newStart.getTime() + duration);

      // Ensure project stays within phase bounds
      if (newStart < phaseStart) {
        newStart = new Date(phaseStart);
        newEnd = new Date(newStart.getTime() + duration);
      }
      if (newEnd > phaseEnd) {
        newEnd = new Date(phaseEnd);
        newStart = new Date(newEnd.getTime() - duration);
      }
    }

    // Update the project dates
    if (onUpdatePhases) {
      const updatedPhases = phases.map(phase => {
        if (phase.id !== selectedPhaseId) return phase;
        return {
          ...phase,
          projects: phase.projects.map(p => {
            if (p.id !== dragState.projectId) return p;
            return {
              ...p,
              startDate: newStart.toISOString().split('T')[0],
              endDate: newEnd.toISOString().split('T')[0],
            };
          }),
        };
      });
      onUpdatePhases(updatedPhases);
    }
  }, [dragState, selectedPhase, acceptedProjects, phases, selectedPhaseId, onUpdatePhases]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragState(null);
    // Reset the dragging flag after a short delay to allow click event to check it
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 100);
  }, []);

  // Handle column resize
  const handleColResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingCol(true);
  }, []);

  const handleColResizeMove = useCallback((e) => {
    if (!isResizingCol || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.max(120, Math.min(400, e.clientX - containerRect.left));
    setProjectColWidth(newWidth);
  }, [isResizingCol]);

  const handleColResizeEnd = useCallback(() => {
    setIsResizingCol(false);
  }, []);

  // Add/remove event listeners for drag
  React.useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragState, handleDragMove, handleDragEnd]);

  // Add/remove event listeners for column resize
  React.useEffect(() => {
    if (isResizingCol) {
      window.addEventListener('mousemove', handleColResizeMove);
      window.addEventListener('mouseup', handleColResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleColResizeMove);
        window.removeEventListener('mouseup', handleColResizeEnd);
      };
    }
  }, [isResizingCol, handleColResizeMove, handleColResizeEnd]);

  // Find project date indices
  const getProjectDateIndices = (project) => {
    const startIdx = phaseDays.findIndex(d => d.date === project.startDate);
    const endIdx = phaseDays.findIndex(d => d.date === project.endDate);
    return {
      startIdx: startIdx >= 0 ? startIdx : 0,
      endIdx: endIdx >= 0 ? endIdx : phaseDays.length - 1,
    };
  };

  const DAY_WIDTH = 32;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Phase Selector */}
        <div className="relative">
          <button
            onClick={() => setIsPhaseDropdownOpen(!isPhaseDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg min-w-[180px] ${
              isDarkMode
                ? 'bg-indigo-900/50 border-indigo-700 text-indigo-300 hover:bg-indigo-800/50'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{selectedPhase?.name || 'Select Phase'}</span>
            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isPhaseDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isPhaseDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsPhaseDropdownOpen(false)} />
              <div className={`absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg border z-20 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {phases.length === 0 ? (
                  <div className={`p-4 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    No planning phases available
                  </div>
                ) : (
                  phases.map((phase) => {
                    const acceptedCount = phase.projects.filter(p => p.status === 'accepted').length;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => {
                          setSelectedPhaseId(phase.id);
                          setIsPhaseDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          selectedPhaseId === phase.id
                            ? isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                            : isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-medium">{phase.name}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {acceptedCount} accepted project{acceptedCount !== 1 ? 's' : ''}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Exclude Weekends Toggle */}
        <button
          onClick={() => setExcludeWeekends(!excludeWeekends)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            excludeWeekends
              ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
              : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className={`w-4 h-4 ${excludeWeekends ? 'text-indigo-600' : ''}`} />
          {excludeWeekends ? 'Weekends Hidden' : 'Hide Weekends'}
        </button>

        <div className="flex-1" />

        {/* Legend */}
        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-300' : ''}`}>
          <span className="w-4 h-4 bg-red-100 border border-red-300 rounded" /> No Staff
          <span className="w-4 h-4 bg-amber-100 border border-amber-300 rounded ml-3" /> Partial
          <span className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded ml-3" /> Filled
        </div>
      </div>

      {/* Gantt Chart */}
      <div
        ref={containerRef}
        className={`rounded-xl border overflow-hidden ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header Row */}
            <div className={`flex border-b ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              {/* Project Column Header */}
              <div
                className={`sticky left-0 z-20 flex-shrink-0 px-4 py-3 text-sm font-semibold border-r relative ${
                  isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
                style={{ width: projectColWidth }}
              >
                Project
                {/* Resize Handle */}
                <div
                  className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-500 ${
                    isResizingCol ? 'bg-indigo-500' : ''
                  }`}
                  onMouseDown={handleColResizeStart}
                />
              </div>
              {/* Rating Column Header */}
              <div
                className={`sticky z-20 flex-shrink-0 w-16 px-2 py-3 text-sm font-semibold text-center border-r ${
                  isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
                style={{ left: projectColWidth }}
              >
                Rating
              </div>
              {/* Days Headers */}
              {phaseDays.map((day, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 text-center border-r last:border-r-0 ${
                    day.isWeekend
                      ? isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
                      : ''
                  } ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
                  style={{ width: DAY_WIDTH }}
                >
                  <div className={`text-[10px] font-medium py-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {day.dayName}
                  </div>
                  <div className={`text-[10px] pb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {day.dateDisplay}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Rows */}
            {acceptedProjects.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Calendar className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-300'}`} />
                <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  No accepted projects in {selectedPhase?.name || 'selected phase'}
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Accept projects in Strategic Planning to see capacity needs
                </p>
              </div>
            ) : (
              acceptedProjects.map((project) => {
                const { startIdx, endIdx } = getProjectDateIndices(project);
                const capacityDays = projectCapacity[project.id] || [];

                return (
                  <div
                    key={project.id}
                    className={`flex border-b last:border-b-0 ${
                      isDarkMode ? 'border-slate-700 hover:bg-slate-700/30' : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {/* Project Name */}
                    <div
                      className={`sticky left-0 z-20 flex-shrink-0 px-4 border-r flex items-center ${
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                      }`}
                      style={{ width: projectColWidth }}
                    >
                      <div className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {project.name}
                      </div>
                    </div>

                    {/* Rating */}
                    <div
                      className={`sticky z-20 flex-shrink-0 w-16 px-2 border-r flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                      }`}
                      style={{ left: projectColWidth }}
                    >
                      <span className={`text-sm font-semibold ${
                        project.overallScore >= 4 ? 'text-emerald-600' :
                        project.overallScore >= 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {project.overallScore.toFixed(1)}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 relative" style={{ height: 32 }}>
                      {/* Background grid */}
                      <div className="absolute inset-0 flex">
                        {phaseDays.map((day, i) => (
                          <div
                            key={i}
                            className={`flex-shrink-0 border-r last:border-r-0 ${
                              day.isWeekend
                                ? isDarkMode ? 'bg-slate-700/30' : 'bg-slate-50'
                                : ''
                            } ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
                            style={{ width: DAY_WIDTH }}
                          />
                        ))}
                      </div>

                      {/* Project Bar */}
                      <div
                        className="absolute top-0 bottom-0 flex items-center cursor-move select-none"
                        style={{
                          left: startIdx * DAY_WIDTH,
                          width: (endIdx - startIdx + 1) * DAY_WIDTH,
                        }}
                      >
                        {/* Capacity Cells */}
                        <div
                          className="flex h-full"
                          onMouseDown={(e) => handleDragStart(e, project, 'move')}
                          title="Drag to move project"
                        >
                          {phaseDays.slice(startIdx, endIdx + 1).map((day, i) => {
                            const dayIndex = startIdx + i;
                            const dayData = capacityDays[dayIndex];
                            const colorClass = getCellColor(dayData);
                            const textColor = (dayData.assigned === 0 && dayData.required > 0) ? 'text-red-700' :
                              dayData.assigned < dayData.required ? 'text-amber-700' : 'text-emerald-700';
                            return (
                              <div
                                key={dayIndex}
                                className={`border-r last:border-r-0 flex items-center justify-center cursor-pointer hover:opacity-80 ${colorClass || ''}`}
                                style={{ width: DAY_WIDTH }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Don't show popup if we just finished dragging
                                  if (wasDraggingRef.current) return;
                                  setSelectedCell({
                                    project,
                                    day,
                                    dayInfo: dayData,
                                  });
                                }}
                              >
                                <span className={`text-[9px] font-semibold ${textColor}`}>
                                  {dayData.assigned}/{dayData.required}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Start Handle */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-10 flex items-center justify-center ${
                            isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          onMouseDown={(e) => handleDragStart(e, project, 'start')}
                          title="Drag to change start date"
                        >
                          <GripHorizontal className="w-2 h-2 text-white rotate-90" />
                        </div>

                        {/* End Handle */}
                        <div
                          className={`absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize z-10 flex items-center justify-center ${
                            isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          onMouseDown={(e) => handleDragStart(e, project, 'end')}
                          title="Drag to change end date"
                        >
                          <GripHorizontal className="w-2 h-2 text-white rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">No Staff</span>
          </div>
          <div className="text-3xl font-bold text-red-700">{stats.noStaff}</div>
          <p className="text-sm text-red-600 mt-1">Days with no staff assigned</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Partial Staff</span>
          </div>
          <div className="text-3xl font-bold text-amber-700">{stats.partialStaff}</div>
          <p className="text-sm text-amber-600 mt-1">Days with some staff assigned</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-emerald-700 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Fully Staffed</span>
          </div>
          <div className="text-3xl font-bold text-emerald-700">{stats.fullyStaffed}</div>
          <p className="text-sm text-emerald-600 mt-1">Days with all staff filled</p>
        </div>
      </div>

      {/* Instructions */}
      <div className={`mt-6 p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <strong>Tip:</strong> Drag the left edge to change start date, right edge to change end date, or drag the middle to move the entire project timeline. Click on a day to see staffing details.
        </p>
      </div>

      {/* Detail Modal */}
      <CapacityDetailModal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        project={selectedCell?.project}
        day={selectedCell?.day}
        dayInfo={selectedCell?.dayInfo}
        staffRoster={staffRoster}
      />
    </div>
  );
};

export default StrategicCapacityScreen;
