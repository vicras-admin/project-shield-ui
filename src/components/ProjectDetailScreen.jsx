import React, { useState } from 'react';
import { Edit3, Zap, AlertTriangle } from 'lucide-react';
import { getRiskColor, getRiskBg, getStatusBadge } from '../utils/riskHelpers';
import { useTheme } from '../context/ThemeContext';
import AddStaffForm from './AddStaffForm';
import { displayName } from '../utils/nameHelpers';

const defaultProject = {
  name: 'No Project Selected',
  client: 'N/A',
  risk: 0,
  status: 'on-track',
  deadline: 'N/A',
  daysLeft: 0,
};

const ProjectDetailScreen = ({ selectedProject }) => {
  const { isDarkMode } = useTheme();
  const project = selectedProject || defaultProject;
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Sarah Chen', role: 'Frontend Dev', hours: '8h/day', avatar: 'SC' },
    { name: 'Mike Ross', role: 'Backend Dev', hours: '8h/day', avatar: 'MR' },
    { name: 'Lisa Park', role: 'Backend Dev', hours: '4h/day', avatar: 'LP' },
    { name: 'Tom Wilson', role: 'Designer', hours: '6h/day', avatar: 'TW' },
  ]);

  const handleAddStaff = (staffData) => {
    const newMember = {
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      middleInitial: staffData.middleInitial,
      role: staffData.role.replace(' Developer', ' Dev').replace('UI/UX ', ''),
      hours: `${staffData.hoursPerDay}h/day`,
      avatar: staffData.avatar,
    };
    setTeamMembers(prev => [...prev, newMember]);
    console.log('Staff added:', staffData);
  };

  const totalCapacity = teamMembers.reduce((sum, member) => {
    const hours = parseInt(member.hours) || 0;
    return sum + hours;
  }, 0);

  return (
    <>
      <div className="p-8">
        <div className={`rounded-xl border p-6 mb-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center ${getRiskBg(project.risk)}`}>
                <span className={`text-2xl font-bold ${
                  project.risk >= 70 ? 'text-red-700' :
                  project.risk >= 40 ? 'text-amber-700' : 'text-emerald-700'
                }`}>{project.risk}</span>
                <span className="text-xs text-slate-500">Risk Score</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {project.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(project.status)}`}>
                    {project.status === 'critical' ? 'Critical Risk' : project.status === 'warning' ? 'At Risk' : 'On Track'}
                  </span>
                </div>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{project.client}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
                isDarkMode
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Run Scenario
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Project Details
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Deadline', value: project.deadline },
                  { label: 'Days Remaining', value: `${project.daysLeft} days` },
                  { label: 'Budget', value: '$125,000' },
                  { label: 'Hours Budgeted', value: '1,200 hrs' },
                  { label: 'Hours Used', value: '680 hrs (57%)' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Staffing Requirements
              </h4>
              <div className="space-y-3">
                {[
                  { role: 'Frontend Developer', required: 2, assigned: 1 },
                  { role: 'Backend Developer', required: 2, assigned: 2 },
                  { role: 'Designer', required: 1, assigned: 1 },
                  { role: 'QA Engineer', required: 1, assigned: 0 },
                ].map((role, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {role.role}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        role.assigned < role.required ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                        {role.assigned}/{role.required}
                      </span>
                      {role.assigned < role.required && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Risk Factors
              </h4>
              <div className="space-y-4">
                {[
                  { factor: 'Staffing gaps in next 14 days', severity: 'high', value: '8 days' },
                  { factor: 'Missing QA Engineer', severity: 'high', value: 'Critical role' },
                  { factor: 'Deadline proximity', severity: 'medium', value: '19 days' },
                  { factor: 'Budget burn rate', severity: 'low', value: 'On track' },
                ].map((risk, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    risk.severity === 'high' ? 'bg-red-50 border-red-200' :
                    risk.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{risk.factor}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                        risk.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>{risk.severity}</span>
                    </div>
                    <span className="text-sm text-slate-500">{risk.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Risk Trend
              </h4>
              <div className="h-32 flex items-end gap-2">
                {[45, 52, 58, 62, 71, 78, 85].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${getRiskColor(val)}`}
                      style={{ height: `${val}%` }}
                    />
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      W{i+1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-6 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Assigned Team
              </h4>
              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {displayName(member)}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {member.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between text-sm">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Total Daily Capacity</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalCapacity} hours</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Required</span>
                <span className="font-semibold text-red-500">32 hours</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Gap</span>
                <span className={`font-semibold ${totalCapacity >= 32 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {totalCapacity >= 32 ? '+' : ''}{totalCapacity - 32} hours/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddStaffForm
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSubmit={handleAddStaff}
        projectName={project.name}
      />
    </>
  );
};

export default ProjectDetailScreen;
