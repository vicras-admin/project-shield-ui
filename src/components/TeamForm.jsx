import React, { useState, useEffect } from 'react';
import { X, UsersRound, Pencil, Plus, UserPlus, UserMinus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { displayName } from '../utils/nameHelpers';

const TeamForm = ({ isOpen, onClose, onSubmit, teamToEdit, staffRoster }) => {
  const { isDarkMode } = useTheme();
  const isEditMode = !!teamToEdit;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [assignedStaffIds, setAssignedStaffIds] = useState([]);

  useEffect(() => {
    if (teamToEdit) {
      setFormData({
        name: teamToEdit.name || '',
        description: teamToEdit.description || '',
      });
      // Find staff assigned to this team using staff.id
      const assigned = staffRoster
        .filter(staff => staff.teamId === teamToEdit.id)
        .map(staff => staff.id);
      setAssignedStaffIds(assigned);
    } else {
      setFormData({ name: '', description: '' });
      setAssignedStaffIds([]);
    }
  }, [teamToEdit, staffRoster]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignStaff = (staffId) => {
    setAssignedStaffIds(prev => [...prev, staffId]);
  };

  const handleUnassignStaff = (staffId) => {
    setAssignedStaffIds(prev => prev.filter(id => id !== staffId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamData = {
      ...formData,
      id: teamToEdit?.id,
    };
    onSubmit(teamData, isEditMode, assignedStaffIds);
    onClose();
  };

  if (!isOpen) return null;

  // Get available staff (unassigned or assigned to other teams, but not this one when editing)
  const availableStaff = staffRoster.filter(staff => {
    if (assignedStaffIds.includes(staff.id)) return false;
    if (isEditMode) {
      return staff.teamId === null || staff.teamId === undefined || staff.teamId === teamToEdit.id;
    }
    return staff.teamId === null || staff.teamId === undefined;
  });

  // Get currently assigned staff for display
  const assignedStaff = staffRoster.filter(staff => assignedStaffIds.includes(staff.id));

  const inputClass = `w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDarkMode
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
  }`;

  const labelClass = `block text-sm font-medium mb-2 ${
    isDarkMode ? 'text-slate-300' : 'text-slate-700'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isEditMode ? 'bg-blue-100' : 'bg-emerald-100'
            }`}>
              {isEditMode ? (
                <Pencil className="w-5 h-5 text-blue-600" />
              ) : (
                <UsersRound className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{isEditMode ? 'Edit Team' : 'Create Team'}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isEditMode ? `Editing ${teamToEdit?.name}` : 'Create a new team and assign members'}
              </p>
            </div>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Team Details */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <UsersRound className="w-4 h-4" />
              Team Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Team Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Claims Processing Team"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What does this team work on?"
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <UserPlus className="w-4 h-4" />
              Team Members ({assignedStaff.length})
            </h3>

            {/* Assigned Members */}
            {assignedStaff.length > 0 && (
              <div className="mb-4">
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Assigned to this team:
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignedStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {staff.avatar}
                      </div>
                      <span>{displayName(staff)}</span>
                      <button
                        type="button"
                        onClick={() => handleUnassignStaff(staff.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Members */}
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Available staff (click to add):
              </p>
              {availableStaff.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  No available staff members
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableStaff.map((staff) => (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => handleAssignStaff(staff.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        isDarkMode
                          ? 'border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {staff.avatar}
                      </div>
                      <span>{displayName(staff)}</span>
                      <Plus className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center justify-end gap-3 pt-6 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'text-slate-300 hover:bg-slate-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isEditMode ? (
                <>
                  <Pencil className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
