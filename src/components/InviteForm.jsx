import React, { useState } from 'react';
import { X, Mail, Plus, Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
];

const InviteForm = ({ onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [rows, setRows] = useState([{ email: '', role: 'member' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (index, field, value) => {
    setRows(prev => prev.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    ));
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[`${index}-${field}`];
        return next;
      });
    }
    if (error) setError('');
  };

  const addRow = () => {
    setRows(prev => [...prev, { email: '', role: 'member' }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    rows.forEach((row, index) => {
      if (!row.email.trim()) {
        errors[`${index}-email`] = 'Email is required';
      } else if (!emailRegex.test(row.email)) {
        errors[`${index}-email`] = 'Invalid email address';
      }
    });

    // Check for duplicates
    const emails = rows.map(r => r.email.trim().toLowerCase());
    emails.forEach((email, index) => {
      if (email && emails.indexOf(email) !== index) {
        errors[`${index}-email`] = 'Duplicate email';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        invitations: rows.map(row => ({
          email: row.email.trim().toLowerCase(),
          role: row.role,
        })),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send invitations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (key) => `
    w-full px-3 py-2 rounded-lg border transition-colors text-sm
    ${fieldErrors[key]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : isDarkMode
        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-50
  `;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Invite Members
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Send email invitations to join your organization
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                    placeholder="email@example.com"
                    className={inputClasses(`${index}-email`)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors[`${index}-email`] && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors[`${index}-email`]}</p>
                  )}
                </div>
                <div className="w-44">
                  <select
                    value={row.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                    disabled={isSubmitting}
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1 || isSubmitting}
                  className={`p-2 rounded-lg transition-colors ${
                    rows.length === 1
                      ? 'opacity-30 cursor-not-allowed'
                      : isDarkMode
                        ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400'
                        : 'hover:bg-slate-100 text-slate-400 hover:text-red-500'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={isSubmitting}
            className={`mt-3 flex items-center gap-2 text-sm font-medium transition-colors ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add another
          </button>
        </form>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isDarkMode
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg font-medium text-sm text-white transition-colors flex items-center gap-2 ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              `Send ${rows.length === 1 ? 'Invitation' : `${rows.length} Invitations`}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteForm;
