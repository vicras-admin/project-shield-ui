import React from 'react';
import { X, Moon, Sun, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const UserSettings = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className={`text-sm font-medium mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Appearance</h3>

            <div className={`flex items-center justify-between p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-slate-600'}`} />
                ) : (
                  <Sun className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-amber-500'}`} />
                )}
                <div>
                  <div className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>Dark Mode</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {isDarkMode ? 'Currently enabled' : 'Currently disabled'}
                  </div>
                </div>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-medium mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Account</h3>

            <div className="space-y-2">
              {[
                { icon: User, label: 'Profile', description: 'Manage your account details' },
                { icon: Bell, label: 'Notifications', description: 'Configure alert preferences' },
                { icon: Shield, label: 'Security', description: 'Password and authentication' },
                { icon: HelpCircle, label: 'Help & Support', description: 'Get help or contact us' },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-300'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>{item.label}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className={`text-sm text-center ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            ProjectShield v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
