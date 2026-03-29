import React, { useState, useEffect } from 'react';
import { Plus, Mail, RefreshCw, XCircle, RotateCw, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import InviteForm from './InviteForm';
import { invitationApi } from '../services/api';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  REVOKED: { label: 'Revoked', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  EXPIRED: { label: 'Expired', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const InvitationsScreen = () => {
  const { isDarkMode } = useTheme();
  const [invitations, setInvitations] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invitationApi.getAll();
      setInvitations(data);
    } catch (err) {
      setError(err.message || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCreateInvitations = async (data) => {
    const newInvitations = await invitationApi.create(data);
    setInvitations(prev => [...newInvitations, ...prev]);
  };

  const handleRevoke = async (id) => {
    try {
      await invitationApi.revoke(id);
      setInvitations(prev => prev.map(inv =>
        inv.id === id ? { ...inv, status: 'REVOKED' } : inv
      ));
    } catch (err) {
      console.error('Failed to revoke invitation:', err);
    }
  };

  const handleResend = async (id) => {
    try {
      const updated = await invitationApi.resend(id);
      setInvitations(prev => prev.map(inv =>
        inv.id === id ? updated : inv
      ));
    } catch (err) {
      console.error('Failed to resend invitation:', err);
    }
  };

  const handleCopyLink = (token) => {
    const link = `${window.location.origin}/#accept-invite?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const formatRole = (role) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const pendingCount = invitations.filter(i => i.status === 'PENDING').length;
  const acceptedCount = invitations.filter(i => i.status === 'ACCEPTED').length;

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'} min-h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Member Invitations
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Invite new members to join your organization
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Invite Members
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Mail className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{invitations.length}</p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Invitations</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
              <RefreshCw className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{pendingCount}</p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pending</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <Check className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{acceptedCount}</p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Accepted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-2">{error}</p>
          <button onClick={fetchInvitations} className="text-blue-600 hover:underline text-sm">Retry</button>
        </div>
      ) : invitations.length === 0 ? (
        <div className={`rounded-xl p-12 text-center ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm'}`}>
          <Mail className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            No invitations yet
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Invite members to start building your team
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Send your first invitation
          </button>
        </div>
      ) : (
        <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Role</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Invited By</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sent</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Expires</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                {invitations.map(inv => (
                  <tr key={inv.id} className={isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                    <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {inv.email}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {formatRole(inv.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isDarkMode ? statusConfig[inv.status]?.color.split('dark:').pop() : statusConfig[inv.status]?.color.split(' dark:')[0]
                      }`}>
                        {statusConfig[inv.status]?.label || inv.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {inv.invitedByName}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDate(inv.expiresAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleCopyLink(inv.token)}
                              title="Copy invite link"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                              }`}
                            >
                              {copiedId === inv.token ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleResend(inv.id)}
                              title="Resend invitation"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                              }`}
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRevoke(inv.id)}
                              title="Revoke invitation"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode ? 'hover:bg-slate-600 text-red-400' : 'hover:bg-slate-100 text-red-500'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Form Modal */}
      {isFormOpen && (
        <InviteForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateInvitations}
        />
      )}
    </div>
  );
};

export default InvitationsScreen;
