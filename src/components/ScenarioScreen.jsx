import React from 'react';
import { Zap, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { getRiskColor } from '../utils/riskHelpers';
import { useTheme } from '../context/ThemeContext';

const ScenarioScreen = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-8">
        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Build Scenario
          </h3>

          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Scenario Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['Person Leave', 'New Hire', 'Project Delay'].map((type, i) => (
                  <button
                    key={i}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      i === 0
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : isDarkMode
                          ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Select Person</label>
              <select className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'border-slate-200'
              }`}>
                <option>Sarah Chen (Frontend Developer)</option>
                <option>Mike Ross (Backend Developer)</option>
                <option>Lisa Park (Backend Developer)</option>
                <option>Tom Wilson (Designer)</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Date Range</label>
              <div className="flex gap-3">
                <input
                  type="date"
                  className={`flex-1 p-3 border rounded-lg ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'border-slate-200'
                  }`}
                  defaultValue="2025-01-13"
                />
                <input
                  type="date"
                  className={`flex-1 p-3 border rounded-lg ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'border-slate-200'
                  }`}
                  defaultValue="2025-01-24"
                />
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Run Scenario
            </button>
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Impact Analysis
          </h3>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Scenario: Sarah Chen takes PTO (Jan 13-24)
            </div>
            <p className="text-sm text-amber-600">3 projects will be affected</p>
          </div>

          <div className="space-y-4">
            <h4 className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Projects Impacted
            </h4>

            {[
              { name: 'Website Redesign', before: 85, after: 95, change: '+10' },
              { name: 'Mobile App v2', before: 62, after: 78, change: '+16' },
              { name: 'API Integration', before: 45, after: 52, change: '+7' },
            ].map((project, i) => (
              <div key={i} className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {project.name}
                  </span>
                  <span className="text-sm text-red-500 font-medium">{project.change} risk</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className={`flex items-center justify-between text-xs mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span>Before</span>
                      <span>{project.before}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
                    }`}>
                      <div className={`h-full ${getRiskColor(project.before)}`} style={{ width: `${project.before}%` }} />
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <div className="flex-1">
                    <div className={`flex items-center justify-between text-xs mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span>After</span>
                      <span>{project.after}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
                    }`}>
                      <div className={`h-full ${getRiskColor(project.after)}`} style={{ width: `${project.after}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Recommendations
            </h4>
            <div className="space-y-2">
              {[
                'Assign Mike Ross to cover frontend tasks',
                'Consider contractor for Jan 15-20 sprint',
                'Prioritize critical path items before PTO',
              ].map((rec, i) => (
                <div key={i} className={`flex items-start gap-2 text-sm ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioScreen;
