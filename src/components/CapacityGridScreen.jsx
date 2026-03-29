import React, { useState, useMemo } from 'react';
import { Calendar, Filter, AlertTriangle, Clock, Check, ChevronDown } from 'lucide-react';
import { getRiskColor, generateCapacityData } from '../utils/riskHelpers';
import { useTheme } from '../context/ThemeContext';
import CapacityDetailModal from './CapacityDetailModal';

const CapacityGridScreen = ({ staffRoster = [], phases = [] }) => {
  const { isDarkMode } = useTheme();
  const days = generateCapacityData();
  const [selectedCell, setSelectedCell] = useState(null);
  const [showGapsOnly, setShowGapsOnly] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(phases[0]?.id || null);
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);

  // Get accepted projects from selected phase
  const selectedPhase = phases.find(p => p.id === selectedPhaseId);
  const acceptedProjects = useMemo(() => {
    if (!selectedPhase) return [];
    return selectedPhase.projects
      .filter(p => p.status === 'accepted')
      .map(p => ({
        id: p.id,
        name: p.name,
        client: p.sponsor,
        staffingNeeds: p.staffingNeeds,
        risk: Math.round((5 - p.overallScore) * 20),
      }));
  }, [selectedPhase]);

  // Convert staffingNeeds to role requirements format
  const getProjectRoleRequirements = (project) => {
    if (!project.staffingNeeds) return [{ role: 'Frontend Developer', count: 2 }];
    return project.staffingNeeds.map(need => ({
      role: need.role,
      count: need.count,
    }));
  };

  // Generate capacity data with actual staff assignments
  const capacityData = acceptedProjects.map((project, pi) => {
    const requiredRoles = getProjectRoleRequirements(project);
    const totalRequired = requiredRoles.reduce((sum, r) => sum + r.count, 0);

    return {
      ...project,
      requiredRoles,
      dailyStaffing: days.map((_, dayIndex) => {
        // Simulate staff assignments - vary by day and project
        const seed = (pi * 14 + dayIndex) % 10;
        const assignmentVariation = seed < 3 ? 0 : seed < 6 ? 1 : seed < 8 ? 2 : 3;

        // Get staff that could work on this project (matching roles)
        const eligibleStaff = staffRoster
          .map((staff, index) => ({ ...staff, index }))
          .filter(staff => requiredRoles.some(r => r.role === staff.role));

        // Assign some staff based on variation
        const numToAssign = Math.min(eligibleStaff.length, Math.max(0, totalRequired - assignmentVariation));
        const assignedStaff = eligibleStaff
          .slice(0, numToAssign)
          .map(s => s.index);

        const assigned = assignedStaff.length;
        const gap = totalRequired - assigned;

        return {
          required: totalRequired,
          assigned,
          gap,
          assignedStaff,
          requiredRoles,
        };
      }),
    };
  });

  // Calculate summary stats
  const allDayData = capacityData.flatMap(p => p.dailyStaffing);
  const criticalGaps = allDayData.filter(d => d.gap > 1).length;
  const minorGaps = allDayData.filter(d => d.gap === 1).length;
  const fullyStaffed = allDayData.filter(d => d.gap <= 0).length;

  // Filter projects based on showGapsOnly
  const filteredCapacityData = showGapsOnly
    ? capacityData.filter(project => project.dailyStaffing.some(day => day.gap > 0))
    : capacityData;

  // Find which day indices have any gaps (for column highlighting)
  const daysWithGaps = new Set();
  capacityData.forEach(project => {
    project.dailyStaffing.forEach((day, idx) => {
      if (day.gap > 0) daysWithGaps.add(idx);
    });
  });

  const handleCellClick = (project, dayIndex) => {
    setSelectedCell({
      project,
      day: days[dayIndex],
      dayInfo: project.dailyStaffing[dayIndex],
    });
  };

  return (
    <div className="p-8">
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
        <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            : 'bg-white border-slate-200 hover:bg-slate-50'
        }`}>
          <Filter className="w-4 h-4" />
          All Teams
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowGapsOnly(!showGapsOnly)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showGapsOnly
              ? 'bg-amber-100 border-amber-300 text-amber-700'
              : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${showGapsOnly ? 'text-amber-600' : ''}`} />
          {showGapsOnly ? 'Showing Gaps Only' : 'Show Gaps Only'}
        </button>
        <div className="flex-1" />
        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-300' : ''}`}>
          <span className="w-4 h-4 bg-red-100 border border-red-300 rounded" /> Short 2+
          <span className="w-4 h-4 bg-amber-100 border border-amber-300 rounded ml-3" /> Short 1
          <span className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded ml-3" /> Staffed
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}>
                <th className={`sticky left-0 px-4 py-3 text-left text-sm font-semibold w-64 border-r ${
                  isDarkMode
                    ? 'bg-slate-900 text-slate-300 border-slate-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  Project
                </th>
                {days.map((day, i) => (
                  <th key={i} className={`px-2 py-3 text-center text-xs font-medium min-w-[60px] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <div className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {day.dayName}
                    </div>
                    <div>{day.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
              {acceptedProjects.length === 0 ? (
                <tr>
                  <td colSpan={days.length + 1} className="px-4 py-12 text-center">
                    <Calendar className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-300'}`} />
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      No accepted projects in {selectedPhase?.name || 'selected phase'}
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Accept projects in Strategic Planning to see capacity needs
                    </p>
                  </td>
                </tr>
              ) : filteredCapacityData.length === 0 ? (
                <tr>
                  <td colSpan={days.length + 1} className="px-4 py-12 text-center">
                    <Check className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-emerald-500' : 'text-emerald-400'}`} />
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      All projects are fully staffed!
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      No staffing gaps found in the selected period
                    </p>
                  </td>
                </tr>
              ) : filteredCapacityData.map(project => (
                <tr key={project.id} className={isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                  <td className={`sticky left-0 px-4 py-4 border-r ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${getRiskColor(project.risk)}`} />
                      <div>
                        <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {project.name}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {project.client}
                        </div>
                      </div>
                    </div>
                  </td>
                  {project.dailyStaffing.map((day, i) => {
                    const hasGap = day.gap > 0;
                    const dimmed = showGapsOnly && !hasGap;

                    const bgColor = dimmed
                      ? (isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-100/50 border-slate-200')
                      : day.gap > 1 ? 'bg-red-100 border-red-200' :
                        day.gap === 1 ? 'bg-amber-100 border-amber-200' :
                        day.gap <= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50';

                    const textColor = dimmed
                      ? (isDarkMode ? 'text-slate-500' : 'text-slate-400')
                      : day.gap > 1 ? 'text-red-700' :
                        day.gap === 1 ? 'text-amber-700' :
                        'text-emerald-700';

                    return (
                      <td key={i} className="px-2 py-2 text-center">
                        <div
                          onClick={() => handleCellClick(project, i)}
                          className={`rounded-lg border p-2 ${bgColor} cursor-pointer transition-all ${
                            dimmed ? 'opacity-40' : 'hover:shadow-md hover:scale-105'
                          }`}
                        >
                          <div className={`text-sm font-bold ${textColor}`}>
                            {day.assigned}/{day.required}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Critical Gaps</span>
          </div>
          <div className="text-3xl font-bold text-red-700">{criticalGaps}</div>
          <p className="text-sm text-red-600 mt-1">Days with 2+ staff shortage</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Minor Gaps</span>
          </div>
          <div className="text-3xl font-bold text-amber-700">{minorGaps}</div>
          <p className="text-sm text-amber-600 mt-1">Days with 1 staff shortage</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-emerald-700 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Fully Staffed</span>
          </div>
          <div className="text-3xl font-bold text-emerald-700">{fullyStaffed}</div>
          <p className="text-sm text-emerald-600 mt-1">Days with adequate coverage</p>
        </div>
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

export default CapacityGridScreen;
