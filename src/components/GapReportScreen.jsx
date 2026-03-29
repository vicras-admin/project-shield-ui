import React from 'react';
import { useTheme } from '../context/ThemeContext';

const GapReportScreen = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Total Gap Days
          </div>
          <div className="text-3xl font-bold text-red-500">42</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Next 90 days
          </div>
        </div>
        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Developer Shortage
          </div>
          <div className="text-3xl font-bold text-amber-500">120 hrs</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            ~3 FTE weeks
          </div>
        </div>
        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Designer Shortage
          </div>
          <div className="text-3xl font-bold text-amber-500">40 hrs</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            ~1 FTE week
          </div>
        </div>
        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Projects Affected
          </div>
          <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            of 12 active
          </div>
        </div>
      </div>

      <div className={`rounded-xl border ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Staffing Gaps by Role
          </h3>
        </div>

        <div className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
          {[
            { role: 'Frontend Developer', gap: 80, projects: ['Website Redesign', 'Mobile App v2'], urgency: 'critical' },
            { role: 'QA Engineer', gap: 40, projects: ['Website Redesign', 'API Integration'], urgency: 'critical' },
            { role: 'Backend Developer', gap: 24, projects: ['Mobile App v2'], urgency: 'warning' },
            { role: 'Designer', gap: 16, projects: ['Dashboard Analytics'], urgency: 'low' },
          ].map((gap, i) => (
            <div key={i} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-12 rounded-full ${
                    gap.urgency === 'critical' ? 'bg-red-500' :
                    gap.urgency === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {gap.role}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {gap.projects.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {gap.gap} hrs
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    shortage
                  </div>
                </div>
              </div>

              <div className="ml-7">
                <div className={`h-3 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                }`}>
                  <div
                    className={`h-full ${
                      gap.urgency === 'critical' ? 'bg-red-500' :
                      gap.urgency === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(gap.gap, 100)}%` }}
                  />
                </div>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  <span>Jan 1</span>
                  <span>Mar 31</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GapReportScreen;
