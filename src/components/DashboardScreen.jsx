import React, { useMemo } from 'react';
import { Filter, ChevronRight } from 'lucide-react';
import { getRiskColor, getRiskBg, getStatusBadge } from '../utils/riskHelpers';
import { useTheme } from '../context/ThemeContext';

const DashboardScreen = ({ phases, onProjectSelect }) => {
  const { isDarkMode } = useTheme();

  // Derive projects from phases data
  const projects = useMemo(() => {
    const allProjects = [];
    for (const phase of phases) {
      if (phase.projects) {
        for (const project of phase.projects) {
          // Calculate risk based on project status and days until deadline
          const endDate = new Date(project.endDate);
          const today = new Date();
          const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

          let risk = 0;
          let status = 'healthy';

          if (project.status === 'rejected') {
            risk = 10;
            status = 'healthy';
          } else if (daysLeft < 0) {
            risk = 95;
            status = 'critical';
          } else if (daysLeft < 14) {
            risk = 85;
            status = 'critical';
          } else if (daysLeft < 30) {
            risk = 60;
            status = 'warning';
          } else if (daysLeft < 60) {
            risk = 40;
            status = 'warning';
          } else {
            risk = 20;
            status = 'healthy';
          }

          // Adjust risk based on staffing needs
          const totalStaffNeeded = (project.staffingNeeds || []).reduce(
            (sum, need) => sum + (need.count || 0),
            0
          );
          if (totalStaffNeeded > 5) risk = Math.min(100, risk + 10);

          allProjects.push({
            id: project.id,
            name: project.name,
            client: project.sponsor || 'No Sponsor',
            risk,
            status,
            deadline: new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            daysLeft: Math.max(0, daysLeft),
            gaps: totalStaffNeeded, // Use staffing needs as a proxy for gaps
            ...project, // Include all original project data
          });
        }
      }
    }
    // Sort by risk descending
    return allProjects.sort((a, b) => b.risk - a.risk);
  }, [phases]);

  // Calculate stats from actual data
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const atRisk = projects.filter(p => p.status === 'critical' || p.status === 'warning').length;
    const totalGaps = projects.reduce((sum, p) => sum + (p.gaps || 0), 0);
    const accepted = projects.filter(p => p.status !== 'rejected').length;
    const utilizationPercent = totalProjects > 0 ? Math.round((accepted / totalProjects) * 100) : 0;

    return [
      { label: 'Total Projects', value: String(totalProjects), change: '', trend: 'up', color: 'blue' },
      { label: 'At Risk', value: String(atRisk), change: '', trend: atRisk > 0 ? 'up' : 'down', color: 'red' },
      { label: 'Staffing Needs', value: String(totalGaps), change: '', trend: 'down', color: 'amber' },
      { label: 'Accepted Rate', value: `${utilizationPercent}%`, change: '', trend: 'up', color: 'emerald' },
    ];
  }, [projects]);

  if (projects.length === 0) {
    return (
      <div className="p-8">
        <div className={`rounded-xl border p-12 text-center ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`text-6xl mb-4`}>📊</div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            No Projects Yet
          </h3>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            Create phases and add strategic projects to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`rounded-xl border p-6 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {stat.label}
              </span>
            </div>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-xl border ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Projects by Risk
          </h3>
          <button className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-lg ${
            isDarkMode
              ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
              : 'border-slate-200 hover:bg-slate-50'
          }`}>
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
          {projects.map(project => (
            <div
              key={project.id}
              className={`p-6 cursor-pointer transition-colors ${
                isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
              }`}
              onClick={() => onProjectSelect(project)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getRiskBg(project.risk)}`}>
                    <span className={`text-lg font-bold ${
                      project.risk >= 70 ? 'text-red-700' :
                      project.risk >= 40 ? 'text-amber-700' : 'text-emerald-700'
                    }`}>{project.risk}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {project.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                        {project.status === 'critical' ? 'Critical' : project.status === 'warning' ? 'At Risk' : 'On Track'}
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {project.client}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {project.deadline}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {project.daysLeft} days left
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-medium ${project.gaps > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {project.gaps} gaps
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      staffing
                    </div>
                  </div>

                  <div className="w-32">
                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <div
                        className={`h-full ${getRiskColor(project.risk)} transition-all`}
                        style={{ width: `${project.risk}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
