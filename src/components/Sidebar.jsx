import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { screens } from '../constants/data';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ activeScreen, setActiveScreen, userRole }) => {
  const { isDarkMode } = useTheme();

  const isAdmin = userRole === 'admin';

  const visibleScreens = screens.filter(screen =>
    !screen.adminOnly || isAdmin
  );

  return (
    <div className={`w-64 flex flex-col h-full ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'
    }`}>
      <div className={`p-6 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-700'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">ProjectShield</h1>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Capacity Planning
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {visibleScreens.map(screen => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeScreen === screen.id
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-slate-400 hover:bg-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <screen.icon className="w-5 h-5" />
              <span className="font-medium">{screen.name}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-700'}`}>
        <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-800'}`}>
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">3 Projects at Risk</span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Review staffing gaps to prevent delays
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
