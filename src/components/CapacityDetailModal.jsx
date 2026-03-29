import React from 'react';
import { X, Users, AlertTriangle, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { displayName } from '../utils/nameHelpers';

const CapacityDetailModal = ({ isOpen, onClose, project, day, dayInfo, staffRoster = [] }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !project || !dayInfo) return null;

  const { assigned, required, gap, assignedStaff = [], requiredRoles = [] } = dayInfo;

  // Get assigned staff details
  const assignedStaffDetails = assignedStaff
    .map(staffIndex => staffRoster[staffIndex])
    .filter(Boolean);

  // Find understaffed roles
  const roleCounts = assignedStaffDetails.reduce((acc, staff) => {
    acc[staff.role] = (acc[staff.role] || 0) + 1;
    return acc;
  }, {});

  const understaffedRoles = requiredRoles.filter(req => {
    const currentCount = roleCounts[req.role] || 0;
    return currentCount < req.count;
  }).map(req => ({
    ...req,
    currentCount: roleCounts[req.role] || 0,
    shortage: req.count - (roleCounts[req.role] || 0)
  }));

  // Find available staff who could fill gaps (not already assigned)
  const availableStaff = staffRoster
    .map((staff, index) => ({ ...staff, index }))
    .filter(staff => !assignedStaff.includes(staff.index))
    .filter(staff => {
      // Match by role needed
      return understaffedRoles.some(ur => ur.role === staff.role);
    });

  // Status: green = fully staffed, yellow = partial, red = no staff
  const isFullyStaffed = assigned >= required;
  const isNoStaff = assigned === 0 && required > 0;
  const isPartial = !isFullyStaffed && !isNoStaff;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl m-auto ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {project.name}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {day.dayName}, {day.formattedDate || day.dateDisplay}
            </p>
          </div>
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

        <div className="p-4 space-y-4">
          {/* Status Summary */}
          <div className={`p-4 rounded-lg ${
            isFullyStaffed
              ? 'bg-emerald-50 border border-emerald-200'
              : isNoStaff
                ? 'bg-red-50 border border-red-200'
                : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isFullyStaffed ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 ${isNoStaff ? 'text-red-600' : 'text-amber-600'}`} />
                )}
                <span className={`font-semibold ${
                  isFullyStaffed ? 'text-emerald-700' : isNoStaff ? 'text-red-700' : 'text-amber-700'
                }`}>
                  {isFullyStaffed ? 'Fully Staffed' : isNoStaff ? 'No Staff Assigned' : `Partially Staffed (${gap} needed)`}
                </span>
              </div>
              <div className={`text-2xl font-bold ${
                isFullyStaffed ? 'text-emerald-700' : isNoStaff ? 'text-red-700' : 'text-amber-700'
              }`}>
                {assigned}/{required}
              </div>
            </div>
          </div>

          {/* Assigned Staff */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Users className="w-4 h-4" />
              Assigned Staff ({assignedStaffDetails.length})
            </h3>
            {assignedStaffDetails.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                No staff assigned for this day
              </p>
            ) : (
              <div className="space-y-2">
                {assignedStaffDetails.map((staff, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {staff.avatar}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {displayName(staff)}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {staff.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className={`w-3 h-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                        {staff.hoursPerDay}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Understaffed Roles */}
          {understaffedRoles.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Roles Needed
              </h3>
              <div className="space-y-2">
                {understaffedRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isDarkMode
                        ? 'bg-red-900/20 border-red-800/50'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <span className={`font-medium text-sm ${
                      isDarkMode ? 'text-red-300' : 'text-red-700'
                    }`}>
                      {role.role}
                    </span>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Need {role.shortage} more ({role.currentCount}/{role.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Staff to Fill Gaps */}
          {understaffedRoles.length > 0 && availableStaff.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <UserPlus className="w-4 h-4 text-emerald-500" />
                Available Staff to Fill Gaps
              </h3>
              <div className="space-y-2">
                {availableStaff.slice(0, 5).map((staff, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isDarkMode
                        ? 'bg-emerald-900/20 border-emerald-800/50'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {staff.avatar}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {displayName(staff)}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {staff.role} • {staff.hoursPerDay}h/day
                        </p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}>
                      Assign
                    </button>
                  </div>
                ))}
                {availableStaff.length > 5 && (
                  <p className={`text-xs text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    +{availableStaff.length - 5} more available
                  </p>
                )}
              </div>
            </div>
          )}

          {understaffedRoles.length > 0 && availableStaff.length === 0 && (
            <div className={`p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <UserPlus className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                No available staff with matching roles
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 p-4 border-t ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapacityDetailModal;
