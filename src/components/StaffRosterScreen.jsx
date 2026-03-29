import React, { useState } from 'react';
import { Plus, Users, Briefcase, Clock, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { displayName, getInitials } from '../utils/nameHelpers';
import AddStaffForm from './AddStaffForm';

const StaffRosterScreen = ({ staffRoster, teams = [], onAddStaff, onEditStaff, onDeleteStaff }) => {
  const { isDarkMode } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const handleOpenAdd = () => {
    setStaffToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setStaffToEdit(staff);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (staffData, isEditMode) => {
    try {
      if (isEditMode) {
        await onEditStaff(staffData, staffToEdit.id);
      } else {
        await onAddStaff(staffData);
      }
      setIsFormOpen(false);
      setStaffToEdit(null);
    } catch (err) {
      console.error('Error saving staff:', err);
      // Keep form open on error
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setStaffToEdit(null);
  };

  const handleConfirmDelete = async () => {
    if (staffToDelete) {
      try {
        await onDeleteStaff(staffToDelete.id);
      } catch (err) {
        console.error('Error deleting staff:', err);
      }
      setStaffToDelete(null);
    }
  };

  // Calculate role counts
  const roleCounts = staffRoster.reduce((acc, staff) => {
    acc[staff.role] = (acc[staff.role] || 0) + 1;
    return acc;
  }, {});

  const seniorityLabels = {
    junior: 'Junior',
    mid: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
  };

  const getTeamName = (teamId) => {
    if (teamId === null || teamId === undefined) return null;
    const team = teams.find(t => t.id === teamId);
    return team?.name || null;
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'} min-h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {staffRoster.length} team member{staffRoster.length !== 1 ? 's' : ''} in your organization
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {staffRoster.length}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Staff
              </p>
            </div>
          </div>
        </div>

        {Object.entries(roleCounts).slice(0, 3).map(([role, count]) => (
          <div key={role} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {count}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            All Staff Members
          </h2>
        </div>

        {staffRoster.length === 0 ? (
          <div className="p-12 text-center">
            <Users className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              No staff members yet
            </p>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Add your first team member to get started
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Staff Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Name
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Role
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Team
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Domain
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Seniority
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Availability
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Skills
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {staffRoster.map((staff) => (
                  <tr key={staff.id} className={isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                          {staff.avatar}
                        </div>
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {displayName(staff)}
                          </p>
                          {staff.email && (
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {staff.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTeamName(staff.teamId) ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getTeamName(staff.teamId)}
                        </span>
                      ) : (
                        <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(staff.domains || []).length > 0 ? (
                          <>
                            {staff.domains.slice(0, 2).map((domain) => (
                              <span
                                key={domain}
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                  isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {domain}
                              </span>
                            ))}
                            {staff.domains.length > 2 && (
                              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                +{staff.domains.length - 2} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {seniorityLabels[staff.seniority] || staff.seniority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {staff.hoursPerDay}h/day
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(staff.skills || []).slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {(staff.skills || []).length > 3 && (
                          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            +{staff.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(staff)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            isDarkMode
                              ? 'text-slate-300 hover:bg-slate-700'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => setStaffToDelete(staff)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            isDarkMode
                              ? 'text-slate-300 hover:bg-slate-700 hover:text-red-400'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setStaffToDelete(null)} />
          <div className={`relative w-full max-w-md rounded-xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Delete Staff Member
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Are you sure you want to delete <span className="font-medium">{displayName(staffToDelete)}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStaffToDelete(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      <AddStaffForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        staffToEdit={staffToEdit}
        teams={teams}
      />
    </div>
  );
};

export default StaffRosterScreen;
