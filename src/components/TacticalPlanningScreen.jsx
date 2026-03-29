import React, { useState } from 'react';
import {
  Calendar, Users, DollarSign, Clock, CheckCircle, AlertTriangle,
  ArrowLeft, Play, Pause, MoreHorizontal, TrendingUp, Target,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { displayName, getInitials } from '../utils/nameHelpers';

const TacticalPlanningScreen = ({ onNavigateToStrategic }) => {
  const { isDarkMode } = useTheme();
  const [selectedPhase, setSelectedPhase] = useState('q1-2025');
  const [expandedProject, setExpandedProject] = useState(null);

  const phases = [
    {
      id: 'q1-2025',
      name: 'Q1 2025',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      totalBudget: '$275,000',
      totalStaffWeeks: 48,
      usedStaffWeeks: 24,
      projects: [
        {
          id: 1,
          name: 'Customer Portal Redesign',
          status: 'in-progress',
          progress: 35,
          budget: '$150,000',
          spent: '$52,500',
          staffWeeks: 24,
          usedStaffWeeks: 8,
          startDate: '2025-01-06',
          endDate: '2025-03-15',
          team: [
            { name: 'Sarah Chen', role: 'Frontend Dev', allocation: 100 },
            { name: 'Mike Ross', role: 'Frontend Dev', allocation: 100 },
            { name: 'Lisa Park', role: 'Designer', allocation: 75 },
            { name: 'Tom Wilson', role: 'Backend Dev', allocation: 50 },
          ],
          overallScore: 4.2,
          risks: ['Designer availability conflict in Feb', 'Third-party API dependency'],
        },
        {
          id: 2,
          name: 'API Rate Limiting',
          status: 'not-started',
          progress: 0,
          budget: '$45,000',
          spent: '$0',
          staffWeeks: 8,
          usedStaffWeeks: 0,
          startDate: '2025-02-01',
          endDate: '2025-02-28',
          team: [
            { name: 'Alex Kim', role: 'Backend Dev', allocation: 100 },
            { name: 'Jordan Lee', role: 'Backend Dev', allocation: 100 },
          ],
          overallScore: 3.8,
          risks: [],
        },
        {
          id: 3,
          name: 'Legacy Database Migration',
          status: 'planned',
          progress: 0,
          budget: '$80,000',
          spent: '$0',
          staffWeeks: 16,
          usedStaffWeeks: 0,
          startDate: '2025-03-01',
          endDate: '2025-03-31',
          team: [],
          overallScore: 3.4,
          risks: ['Requires Q1 Portal completion first'],
        },
      ],
    },
    {
      id: 'q2-2025',
      name: 'Q2 2025',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      totalBudget: '$0',
      totalStaffWeeks: 0,
      usedStaffWeeks: 0,
      projects: [],
    },
  ];

  const currentPhase = phases.find(p => p.id === selectedPhase);

  const getStatusBadge = (status) => {
    const styles = {
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'not-started': 'bg-slate-100 text-slate-600 border-slate-200',
      'planned': 'bg-amber-100 text-amber-700 border-amber-200',
      'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'blocked': 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || styles['planned'];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'in-progress': 'In Progress',
      'not-started': 'Not Started',
      'planned': 'Planned',
      'completed': 'Completed',
      'blocked': 'Blocked',
    };
    return labels[status] || 'Unknown';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Parse as local date to avoid timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onNavigateToStrategic?.()}
              className={`flex items-center gap-1 text-sm ${
                isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Strategic Planning
            </button>
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Execution Tracker
          </h2>
          <p className={`mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Track and manage approved projects in progress
          </p>
        </div>

        {/* Phase Selector */}
        <div className="flex items-center gap-3">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPhase === phase.id
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {phase.name}
            </button>
          ))}
        </div>
      </div>

      {currentPhase && (
        <>
          {/* Phase Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Timeline</span>
              </div>
              <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {formatDate(currentPhase.startDate)} - {formatDate(currentPhase.endDate)}
              </div>
            </div>
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Projects</span>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentPhase.projects.length}
              </div>
            </div>
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Staff Capacity</span>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentPhase.usedStaffWeeks}/{currentPhase.totalStaffWeeks}
              </div>
              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(currentPhase.usedStaffWeeks / currentPhase.totalStaffWeeks) * 100}%` }}
                />
              </div>
            </div>
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Budget</span>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentPhase.totalBudget}
              </div>
            </div>
          </div>

          {/* Projects */}
          {currentPhase.projects.length === 0 ? (
            <div className={`text-center py-16 rounded-xl border-2 border-dashed ${
              isDarkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <CheckCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                No Tactical Projects
              </h3>
              <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Accept projects from Strategic Planning to see them here
              </p>
              <button
                onClick={() => onNavigateToStrategic?.()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Go to Strategic Planning
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentPhase.projects.map((project) => {
                const isExpanded = expandedProject === project.id;

                return (
                  <div
                    key={project.id}
                    className={`rounded-xl border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Collapsed Header - Always Visible */}
                    <div
                      className={`p-6 cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            project.status === 'in-progress' ? 'bg-blue-100' :
                            project.status === 'completed' ? 'bg-emerald-100' :
                            isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                          }`}>
                            {project.status === 'in-progress' ? (
                              <Play className="w-5 h-5 text-blue-600" />
                            ) : project.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Clock className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {project.name}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(project.status)}`}>
                                {getStatusLabel(project.status)}
                              </span>
                            </div>
                            <div className={`flex items-center gap-4 mt-1 text-sm ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                              <span>Score: {project.overallScore}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className={`p-2 rounded-lg ${
                              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          </button>
                          {isExpanded ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          )}
                        </div>
                      </div>

                      {/* Progress - Always Visible */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Progress</span>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {project.progress}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                          <div
                            className={`h-full ${
                              project.progress >= 75 ? 'bg-emerald-500' :
                              project.progress >= 50 ? 'bg-blue-500' :
                              project.progress >= 25 ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className={`px-6 pb-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 mt-4 mb-4">
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Budget</div>
                            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {project.spent} / {project.budget}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Staff-Weeks</div>
                            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {project.usedStaffWeeks} / {project.staffWeeks}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Team Size</div>
                            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {project.team.length} members
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Risks</div>
                            <div className={`font-semibold ${project.risks.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {project.risks.length} identified
                            </div>
                          </div>
                        </div>

                        {/* Team */}
                        {project.team.length > 0 && (
                          <div>
                            <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                              Assigned Team
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.team.map((member, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                    isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                                  }`}
                                >
                                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                                    {getInitials(member)}
                                  </div>
                                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {displayName(member)}
                                  </span>
                                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {member.allocation}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Risks */}
                        {project.risks.length > 0 && (
                          <div className={`mt-4 p-3 rounded-lg border ${
                            isDarkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                Risks
                              </span>
                            </div>
                            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                              {project.risks.map((risk, i) => (
                                <li key={i}>• {risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TacticalPlanningScreen;
