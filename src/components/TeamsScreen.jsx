import React, { useState } from 'react';
import { Plus, UsersRound, Users, UserX, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { displayName } from '../utils/nameHelpers';
import TeamForm from './TeamForm';

const TeamsScreen = ({ teams, staffRoster, onAddTeam, onEditTeam, onDeleteTeam }) => {
  const { isDarkMode } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const handleOpenAdd = () => {
    setTeamToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (team) => {
    setTeamToEdit(team);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (teamData, isEditMode, assignedStaffIds) => {
    if (isEditMode) {
      onEditTeam(teamData, assignedStaffIds);
    } else {
      onAddTeam(teamData, assignedStaffIds);
    }
    setIsFormOpen(false);
    setTeamToEdit(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setTeamToEdit(null);
  };

  const handleConfirmDelete = async () => {
    if (teamToDelete) {
      try {
        await onDeleteTeam(teamToDelete.id);
      } catch (err) {
        console.error('Error deleting team:', err);
      }
      setTeamToDelete(null);
    }
  };

  const toggleExpand = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  // Calculate stats
  const getTeamMembers = (teamId) => {
    return staffRoster.filter(staff => staff.teamId === teamId);
  };

  const assignedStaffCount = staffRoster.filter(staff => staff.teamId !== null && staff.teamId !== undefined).length;
  const unassignedStaffCount = staffRoster.length - assignedStaffCount;

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'} min-h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {teams.length} team{teams.length !== 1 ? 's' : ''} in your organization
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersRound className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {teams.length}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Teams
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {assignedStaffCount}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Assigned Staff
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {unassignedStaffCount}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Unassigned Staff
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className={`rounded-xl p-12 text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
          <UsersRound className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
          <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            No teams yet
          </p>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Create your first team to start organizing staff
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => {
            const members = getTeamMembers(team.id);
            const isExpanded = expandedTeamId === team.id;

            return (
              <div
                key={team.id}
                className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}
              >
                {/* Team Header */}
                <div
                  className={`p-4 flex items-center justify-between cursor-pointer ${
                    isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => toggleExpand(team.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <UsersRound className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {team.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Member Avatars */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {members.slice(0, 4).map((member, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-slate-800"
                            title={displayName(member)}
                          >
                            {member.avatar}
                          </div>
                        ))}
                        {members.length > 4 && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                            isDarkMode
                              ? 'bg-slate-700 text-slate-300 border-slate-800'
                              : 'bg-slate-200 text-slate-600 border-white'
                          }`}>
                            +{members.length - 4}
                          </div>
                        )}
                      </div>
                      <span className={`ml-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {members.length} member{members.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(team);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTeamToDelete(team);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'text-slate-400 hover:bg-slate-700 hover:text-red-400'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-red-600'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    )}
                  </div>
                </div>

                {/* Expanded Member List */}
                {isExpanded && (
                  <div className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    {members.length === 0 ? (
                      <div className={`p-4 text-center ${isDarkMode ? 'bg-slate-900/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                        No members assigned to this team
                      </div>
                    ) : (
                      <div className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                        {members.map((member, idx) => (
                          <div
                            key={idx}
                            className={`px-4 py-3 flex items-center justify-between border-l-4 ${
                              isDarkMode
                                ? 'border-l-blue-500 hover:bg-slate-800/50'
                                : 'border-l-blue-500 hover:bg-slate-100'
                            } ${idx !== members.length - 1 ? (isDarkMode ? 'border-b border-b-slate-700/50' : 'border-b border-b-slate-200') : ''}`}
                          >
                            <div className="flex items-center gap-3 ml-2">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {member.avatar}
                              </div>
                              <div>
                                <p className={`font-medium text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                  {displayName(member)}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                  {member.role}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {(member.domains || []).slice(0, 2).map((domain) => (
                                <span
                                  key={domain}
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                    isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                                  }`}
                                >
                                  {domain}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {teamToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setTeamToDelete(null)} />
          <div className={`relative w-full max-w-md rounded-xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Delete Team
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Are you sure you want to delete <span className="font-medium">{teamToDelete.name}</span>? Members will be unassigned but not deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTeamToDelete(null)}
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

      {/* Team Form Modal */}
      <TeamForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        teamToEdit={teamToEdit}
        staffRoster={staffRoster}
      />
    </div>
  );
};

export default TeamsScreen;
