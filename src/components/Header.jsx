import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';
import UserSettings from './UserSettings';

const Header = ({ title, subtitle, onSignOut }) => {
  const { isDarkMode } = useTheme();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    if (onSignOut) {
      onSignOut();
    }
  };

  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <div className={`px-8 py-6 border-b ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{title}</h2>
            {subtitle && (
              <p className={`mt-1 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Search projects..."
                className={`pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
            <button className={`relative p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-slate-400 hover:bg-slate-800'
                : 'text-slate-500 hover:bg-slate-100'
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`relative p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-slate-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>{userInitials}</span>
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>

              {isUserMenuOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg border py-2 z-50 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                }`}>
                  {/* User Info */}
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                        }`}>
                          <span className={`text-sm font-medium ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-600'
                          }`}>{userInitials}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {user?.fullName || 'User'}
                        </p>
                        <p className={`text-xs truncate ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {user?.emailAddresses?.[0]?.emailAddress || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        isDarkMode
                          ? 'text-slate-300 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className={`border-t py-1 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <button
                      onClick={handleSignOut}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        isDarkMode
                          ? 'text-red-400 hover:bg-slate-700'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <UserSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Header;
