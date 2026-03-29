import React, { useState, useMemo } from 'react';
import {
  Plus, Calendar, ChevronDown, ChevronUp, GripVertical, Lightbulb,
  CheckCircle, XCircle, Users, Clock, DollarSign, ArrowRight, Star,
  AlertTriangle, TrendingUp, BarChart3, Settings, X, AlertOctagon, ExternalLink, RotateCcw, Pencil
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PlanningPhaseForm from './PlanningPhaseForm';
import StrategicProjectForm from './StrategicProjectForm';
import { phaseApi } from '../services/api';

const StrategicPlanningScreen = ({ onNavigateToTactical, onProjectSelect, phases = [], onUpdatePhases, onRefresh }) => {
  const { isDarkMode } = useTheme();
  const [isPhaseFormOpen, setIsPhaseFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [phaseToEdit, setPhaseToEdit] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showCapacityRunway, setShowCapacityRunway] = useState(false);
  const [isStaffConfigOpen, setIsStaffConfigOpen] = useState(false);

  // Company-wide available staff by role
  const [companyStaff, setCompanyStaff] = useState({
    'Frontend Developer': 4,
    'Backend Developer': 5,
    'Full Stack Developer': 2,
    'UI/UX Designer': 2,
    'QA Engineer': 3,
    'DevOps Engineer': 2,
    'Project Manager': 2,
    'Data Analyst': 1,
    'Technical Lead': 2,
    'Security Engineer': 1,
  });

  // Helper to update phases via parent
  const setPhases = (updater) => {
    if (typeof updater === 'function') {
      onUpdatePhases(updater(phases));
    } else {
      onUpdatePhases(updater);
    }
  };

  const handleAddPhase = async (phaseData, isEditMode) => {
    try {
      if (isEditMode) {
        await phaseApi.update(phaseData.id, {
          name: phaseData.name,
          description: phaseData.description,
          startDate: phaseData.startDate,
          endDate: phaseData.endDate,
          type: phaseData.type,
        });
      } else {
        await phaseApi.create({
          name: phaseData.name,
          description: phaseData.description,
          startDate: phaseData.startDate,
          endDate: phaseData.endDate,
          type: phaseData.type,
        });
      }
      // Refresh data from server to get the persisted state
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to save phase:', err);
      // Fall back to local update so the UI still responds
      if (isEditMode) {
        const updatedPhases = phases.map(phase =>
          phase.id === phaseData.id ? phaseData : phase
        );
        onUpdatePhases(updatedPhases);
      } else {
        onUpdatePhases([...phases, phaseData]);
      }
    }
    setPhaseToEdit(null);
  };

  const handleEditPhase = (phase) => {
    setPhaseToEdit(phase);
    setIsPhaseFormOpen(true);
  };

  const handleClosePhaseForm = () => {
    setIsPhaseFormOpen(false);
    setPhaseToEdit(null);
  };

  const handleAddProject = (projectData, isEditMode) => {
    if (!selectedPhaseId) return;

    if (isEditMode) {
      // Update existing project
      setPhases(prev => prev.map(phase => {
        if (phase.id === selectedPhaseId) {
          return {
            ...phase,
            projects: phase.projects.map(p =>
              p.id === projectData.id ? projectData : p
            ),
          };
        }
        return phase;
      }));
    } else {
      // Add new project
      setPhases(prev => prev.map(phase => {
        if (phase.id === selectedPhaseId) {
          const newProject = {
            ...projectData,
            stackRank: phase.projects.length + 1,
          };
          return {
            ...phase,
            projects: [...phase.projects, newProject],
          };
        }
        return phase;
      }));
    }
    setProjectToEdit(null);
  };

  const handleEditProject = (phaseId, project) => {
    setSelectedPhaseId(phaseId);
    setProjectToEdit(project);
    setIsProjectFormOpen(true);
  };

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setProjectToEdit(null);
  };

  const moveProject = (phaseId, projectId, direction) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;

      const projects = [...phase.projects];
      const index = projects.findIndex(p => p.id === projectId);
      if (index === -1) return phase;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= projects.length) return phase;

      [projects[index], projects[newIndex]] = [projects[newIndex], projects[index]];
      projects.forEach((p, i) => { p.stackRank = i + 1; });

      return { ...phase, projects: projects };
    }));
  };

  const updateProjectStatus = (phaseId, projectId, newStatus) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;

      return {
        ...phase,
        projects: phase.projects.map(p =>
          p.id === projectId
            ? {
                ...p,
                status: newStatus,
                ...(newStatus === 'accepted' ? { acceptedAt: new Date().toISOString() } : {}),
                ...(newStatus === 'rejected' ? { rejectedAt: new Date().toISOString() } : {}),
              }
            : p
        ),
      };
    }));
  };

  const toggleProjectStatus = (phaseId, projectId, currentStatus) => {
    // If already accepted/rejected, reset to strategic. Otherwise, set to the new status.
    if (currentStatus === 'accepted' || currentStatus === 'rejected') {
      updateProjectStatus(phaseId, projectId, 'strategic');
    }
  };

  const acceptProject = (phaseId, projectId) => {
    updateProjectStatus(phaseId, projectId, 'accepted');
  };

  const rejectProject = (phaseId, projectId) => {
    updateProjectStatus(phaseId, projectId, 'rejected');
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 3) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Parse as local date to avoid timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate capacity runway for a phase
  const calculateCapacityRunway = (phase) => {
    // Only include strategic and accepted projects in capacity calculation (not rejected)
    const projects = phase.projects
      .filter(p => p.status === 'strategic' || p.status === 'accepted')
      .sort((a, b) => a.stackRank - b.stackRank);

    // Calculate phase duration in weeks
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    const phaseDurationWeeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));

    // Available staff-weeks per role for this phase
    const availableStaffWeeks = {};
    Object.entries(companyStaff).forEach(([role, count]) => {
      availableStaffWeeks[role] = count * phaseDurationWeeks;
    });

    // Track cumulative usage and determine cutoff
    let cumulativeUsage = {};
    let cutoffIndex = -1;
    let hasPartialProject = false;

    const projectsWithCapacity = projects.map((project, index) => {
      const projectNeeds = {};
      let canFullyStaff = true;
      let partiallyStaffed = false;
      const roleStatus = [];

      project.staffingNeeds.forEach(need => {
        const role = need.role;
        const neededWeeks = need.count * need.durationWeeks;
        const previousUsage = cumulativeUsage[role] || 0;
        const available = availableStaffWeeks[role] || 0;
        const remaining = available - previousUsage;

        projectNeeds[role] = (projectNeeds[role] || 0) + neededWeeks;

        if (neededWeeks > remaining) {
          canFullyStaff = false;
          if (remaining > 0) {
            partiallyStaffed = true;
          }
        }

        roleStatus.push({
          role,
          needed: neededWeeks,
          available: remaining,
          shortage: Math.max(0, neededWeeks - remaining),
          percentAvailable: remaining > 0 ? Math.min(100, (remaining / neededWeeks) * 100) : 0,
        });
      });

      // Update cumulative usage
      Object.entries(projectNeeds).forEach(([role, weeks]) => {
        cumulativeUsage[role] = (cumulativeUsage[role] || 0) + weeks;
      });

      // Determine if this is where we hit the cutoff
      if (!canFullyStaff && cutoffIndex === -1) {
        cutoffIndex = index;
        if (partiallyStaffed) {
          hasPartialProject = true;
        }
      }

      return {
        ...project,
        canFullyStaff,
        partiallyStaffed: !canFullyStaff && partiallyStaffed,
        roleStatus,
        cumulativeUsage: { ...cumulativeUsage },
      };
    });

    // Calculate overall capacity usage by role
    const capacityByRole = Object.entries(availableStaffWeeks).map(([role, available]) => {
      const used = cumulativeUsage[role] || 0;
      return {
        role,
        available,
        used: Math.min(used, available),
        overflow: Math.max(0, used - available),
        percentUsed: available > 0 ? Math.min(100, (used / available) * 100) : 0,
      };
    }).filter(r => r.used > 0 || r.overflow > 0);

    return {
      projects: projectsWithCapacity,
      cutoffIndex,
      hasPartialProject,
      phaseDurationWeeks,
      capacityByRole,
      totalProjects: projects.length,
      fullyStaffedCount: cutoffIndex === -1 ? projects.length : cutoffIndex + (hasPartialProject ? 0 : 0),
    };
  };

  // Staff Configuration Modal
  const StaffConfigModal = () => {
    if (!isStaffConfigOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsStaffConfigOpen(false)} />
        <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Company Staff
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Configure available headcount
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsStaffConfigOpen(false)}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {Object.entries(companyStaff).map(([role, count]) => (
                <div key={role} className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {role}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={count}
                    onChange={(e) => setCompanyStaff(prev => ({
                      ...prev,
                      [role]: parseInt(e.target.value) || 0
                    }))}
                    className={`w-16 p-2 rounded-lg border text-center ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={() => setIsStaffConfigOpen(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Capacity Runway View Component
  const CapacityRunwayView = ({ phase }) => {
    const runway = useMemo(() => calculateCapacityRunway(phase), [phase, companyStaff]);

    return (
      <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className={`font-semibold flex items-center gap-2 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Capacity Runway Analysis
          </h4>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Phase: {runway.phaseDurationWeeks} weeks
            </span>
            <button
              onClick={() => setIsStaffConfigOpen(true)}
              className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ${
                isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Settings className="w-3 h-3" />
              Staff Config
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {runway.totalProjects}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Projects
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
            <div className="text-2xl font-bold text-emerald-600">
              {runway.cutoffIndex === -1 ? runway.totalProjects : runway.cutoffIndex}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Fully Staffable
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
            <div className="text-2xl font-bold text-amber-600">
              {runway.hasPartialProject ? 1 : 0}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              Partially Staffable
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <div className="text-2xl font-bold text-red-600">
              {runway.cutoffIndex === -1 ? 0 : runway.totalProjects - runway.cutoffIndex - (runway.hasPartialProject ? 1 : 0)}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Cannot Staff
            </div>
          </div>
        </div>

        {/* Capacity by Role */}
        {runway.capacityByRole.length > 0 && (
          <div className="mb-6">
            <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Staff Utilization by Role
            </h5>
            <div className="space-y-2">
              {runway.capacityByRole.map(({ role, available, used, overflow, percentUsed }) => (
                <div key={role} className="flex items-center gap-3">
                  <div className={`w-40 text-sm truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {role}
                  </div>
                  <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${
                        overflow > 0 ? 'bg-red-500' : percentUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                    {overflow > 0 && (
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className={`w-32 text-sm text-right ${
                    overflow > 0 ? 'text-red-500 font-semibold' : isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {used}/{available} weeks
                    {overflow > 0 && ` (+${overflow})`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Runway Visualization */}
        <div>
          <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Project Stack (by Priority)
          </h5>
          <div className="space-y-2">
            {runway.projects.map((project, index) => (
              <div key={project.id} className="relative">
                {/* Cutoff Line */}
                {runway.cutoffIndex === index && (
                  <div className="absolute -top-3 left-0 right-0 flex items-center gap-2 z-10">
                    <div className="flex-1 h-0.5 bg-red-500" />
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                      CAPACITY LIMIT
                    </span>
                    <div className="flex-1 h-0.5 bg-red-500" />
                  </div>
                )}

                <div className={`p-4 rounded-lg border ${
                  project.canFullyStaff
                    ? isDarkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
                    : project.partiallyStaffed
                      ? isDarkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
                      : isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                } ${runway.cutoffIndex === index ? 'mt-4' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        project.canFullyStaff
                          ? 'bg-emerald-100 text-emerald-700'
                          : project.partiallyStaffed
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        #{project.stackRank}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          project.canFullyStaff
                            ? isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                            : project.partiallyStaffed
                              ? isDarkMode ? 'text-amber-300' : 'text-amber-700'
                              : isDarkMode ? 'text-red-300' : 'text-red-700'
                        }`}>
                          {project.name}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {project.totalStaffWeeks} staff-weeks
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.canFullyStaff ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                          <CheckCircle className="w-3 h-3" />
                          Can Staff
                        </span>
                      ) : project.partiallyStaffed ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                          <AlertTriangle className="w-3 h-3" />
                          Partial
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          <AlertOctagon className="w-3 h-3" />
                          Cannot Staff
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role-level breakdown for non-fully-staffed projects */}
                  {!project.canFullyStaff && (
                    <div className="mt-3 pt-3 border-t border-dashed border-current/20">
                      <div className="flex flex-wrap gap-2">
                        {project.roleStatus.filter(r => r.shortage > 0).map((rs, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-xs ${
                            isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600'
                          }`}>
                            {rs.role}: need {rs.needed}w, short {rs.shortage}w
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {runway.projects.length === 0 && (
            <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
              isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'
            }`}>
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No projects to analyze</p>
              <p className="text-sm">Add strategic projects to see capacity runway</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-8">
        {/* Actions */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCapacityRunway(!showCapacityRunway)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showCapacityRunway
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isDarkMode
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Capacity Runway
            </button>
            <button
              onClick={() => setIsPhaseFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              New Planning Phase
            </button>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-6">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`rounded-xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              {/* Phase Header */}
              <div
                className={`p-6 cursor-pointer ${
                  isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                    }`}>
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {phase.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {phase.projects.length}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          {phase.projects.filter(p => p.status === 'accepted').length}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Accepted
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">
                          {phase.projects.filter(p => p.status === 'rejected').length}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Rejected
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPhase(phase);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-600'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                      }`}
                      title="Edit phase"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {expandedPhase === phase.id ? (
                      <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    )}
                  </div>
                </div>
                {phase.description && (
                  <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {phase.description}
                  </p>
                )}
              </div>

              {/* Phase Content */}
              {expandedPhase === phase.id && (
                <div className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  {/* Strategic Projects */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-semibold flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Strategic Project Ideas
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          Stack Ranked
                        </span>
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhaseId(phase.id);
                          setIsProjectFormOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Idea
                      </button>
                    </div>

                    {phase.projects.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
                        isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'
                      }`}>
                        <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No project ideas yet</p>
                        <p className="text-sm">Click "Add Idea" to propose a project</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const runway = calculateCapacityRunway(phase);
                          const runwayMap = new Map(runway.projects.map(p => [p.id, p]));
                          const sortedProjects = phase.projects
                            .sort((a, b) => a.stackRank - b.stackRank);

                          return sortedProjects.map((project, index) => {
                              const runwayProject = runwayMap.get(project.id);
                              const canFullyStaff = runwayProject?.canFullyStaff ?? (project.status === 'rejected' ? false : true);
                              const partiallyStaffed = runwayProject?.partiallyStaffed ?? false;
                              const isAccepted = project.status === 'accepted';
                              const isRejected = project.status === 'rejected';

                              return (
                                <div
                                  key={project.id}
                                  className={`p-4 rounded-lg border ${
                                    isAccepted
                                      ? isDarkMode ? 'bg-emerald-900/20 border-emerald-700' : 'bg-emerald-50 border-emerald-300'
                                      : isRejected
                                        ? isDarkMode ? 'bg-red-900/20 border-red-800 opacity-60' : 'bg-red-50 border-red-200 opacity-60'
                                        : isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <div className="flex items-start gap-4">
                                    {/* Rank Controls */}
                                    <div className="flex flex-col items-center gap-1">
                                      <button
                                        onClick={() => moveProject(phase.id, project.id, 'up')}
                                        disabled={index === 0}
                                        className={`p-1 rounded ${
                                          index === 0
                                            ? 'opacity-30 cursor-not-allowed'
                                            : isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-200'
                                        }`}
                                      >
                                        <ChevronUp className="w-4 h-4" />
                                      </button>
                                      <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                          isRejected
                                            ? 'bg-slate-200 text-slate-400'
                                            : canFullyStaff
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : partiallyStaffed
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                        title={
                                          isRejected
                                            ? 'Project rejected'
                                            : canFullyStaff
                                              ? 'Can be fully staffed'
                                              : partiallyStaffed
                                                ? 'Can be partially staffed'
                                                : 'Cannot be staffed'
                                        }
                                      >
                                        #{project.stackRank}
                                      </div>
                                      <button
                                        onClick={() => moveProject(phase.id, project.id, 'down')}
                                        disabled={index === sortedProjects.length - 1}
                                        className={`p-1 rounded ${
                                          index === sortedProjects.length - 1
                                            ? 'opacity-30 cursor-not-allowed'
                                            : isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-200'
                                        }`}
                                      >
                                        <ChevronDown className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* Project Info */}
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                              {project.name}
                                            </h5>
                                            <button
                                              onClick={() => onProjectSelect?.({
                                                id: project.id,
                                                name: project.name,
                                                client: project.sponsor,
                                                risk: Math.round((5 - project.overallScore) * 20),
                                                status: project.overallScore >= 4 ? 'healthy' : project.overallScore >= 3 ? 'warning' : 'critical',
                                                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                                daysLeft: 30,
                                                gaps: 0,
                                              })}
                                              className={`p-1 rounded transition-colors ${
                                                isDarkMode
                                                  ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-600'
                                                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-200'
                                              }`}
                                              title="View project details"
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => handleEditProject(phase.id, project)}
                                              className={`p-1 rounded transition-colors ${
                                                isDarkMode
                                                  ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-600'
                                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-200'
                                              }`}
                                              title="Edit project"
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                          </div>
                                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {project.description}
                                          </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getScoreColor(project.overallScore)}`}>
                                          <Star className="w-3 h-3 inline mr-1" />
                                          {project.overallScore.toFixed(1)}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-6 mt-3">
                                        <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          <Users className="w-4 h-4" />
                                          {project.totalStaffWeeks} staff-weeks
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          <DollarSign className="w-4 h-4" />
                                          {project.estimatedBudget}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Sponsor: {project.sponsor}
                                        </div>
                                      </div>

                                      {/* Staffing Preview */}
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {project.staffingNeeds.map((need, i) => (
                                          <span
                                            key={i}
                                            className={`px-2 py-1 rounded text-xs ${
                                              isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                                            }`}
                                          >
                                            {need.count}x {need.role} ({need.durationWeeks}w)
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 items-end">
                                      {/* Status Badge */}
                                      {(isAccepted || isRejected) && (
                                        <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                          isAccepted
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                          {isAccepted ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                          {isAccepted ? 'Accepted' : 'Rejected'}
                                        </div>
                                      )}
                                      {isAccepted || isRejected ? (
                                        <button
                                          onClick={() => toggleProjectStatus(phase.id, project.id, project.status)}
                                          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${
                                            isDarkMode
                                              ? 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                          }`}
                                        >
                                          <RotateCcw className="w-4 h-4" />
                                          Undo
                                        </button>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => acceptProject(phase.id, project.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                            Accept
                                          </button>
                                          <button
                                            onClick={() => rejectProject(phase.id, project.id)}
                                            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${
                                              isDarkMode
                                                ? 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                            }`}
                                          >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Accepted Projects Summary */}
                  {phase.projects.filter(p => p.status === 'accepted').length > 0 && (
                    <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-semibold flex items-center gap-2 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Accepted for Tactical Execution ({phase.projects.filter(p => p.status === 'accepted').length})
                        </h4>
                        <button
                          onClick={() => onNavigateToTactical?.(phase.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          View Tactical Phase
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {phase.projects.filter(p => p.status === 'accepted').map((project) => (
                          <div
                            key={project.id}
                            className={`p-3 rounded-lg border ${
                              isDarkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                {project.name}
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                {project.totalStaffWeeks} staff-weeks
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Capacity Runway View */}
                  {showCapacityRunway && <CapacityRunwayView phase={phase} />}
                </div>
              )}
            </div>
          ))}
        </div>

        {phases.length === 0 && (
          <div className={`text-center py-16 rounded-xl border-2 border-dashed ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <Calendar className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              No Planning Phases
            </h3>
            <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Create a planning phase to start adding project ideas
            </p>
            <button
              onClick={() => setIsPhaseFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Create First Phase
            </button>
          </div>
        )}
      </div>

      <PlanningPhaseForm
        isOpen={isPhaseFormOpen}
        onClose={handleClosePhaseForm}
        onSubmit={handleAddPhase}
        phaseToEdit={phaseToEdit}
      />

      <StrategicProjectForm
        isOpen={isProjectFormOpen}
        onClose={handleCloseProjectForm}
        onSubmit={handleAddProject}
        phaseName={phases.find(p => p.id === selectedPhaseId)?.name}
        projectToEdit={projectToEdit}
        phaseStartDate={phases.find(p => p.id === selectedPhaseId)?.startDate}
        phaseEndDate={phases.find(p => p.id === selectedPhaseId)?.endDate}
      />

      <StaffConfigModal />
    </>
  );
};

export default StrategicPlanningScreen;
