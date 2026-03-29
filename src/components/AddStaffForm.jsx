import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Briefcase, Clock, Calendar, DollarSign, Plus, Pencil } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { displayName } from '../utils/nameHelpers';

const AddStaffForm = ({ isOpen, onClose, onSubmit, projectName, staffToEdit, teams = [] }) => {
  const { isDarkMode } = useTheme();
  const isEditMode = !!staffToEdit;

  const getInitialFormData = () => ({
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    phone: '',
    role: 'Frontend Developer',
    domains: [],
    seniority: 'mid',
    teamId: null,
    hoursPerDay: 8,
    startDate: '',
    endDate: '',
    hourlyRate: '',
    skills: [],
    notes: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        firstName: staffToEdit.firstName || '',
        lastName: staffToEdit.lastName || '',
        middleInitial: staffToEdit.middleInitial || '',
        email: staffToEdit.email || '',
        phone: staffToEdit.phone || '',
        role: staffToEdit.role || 'Frontend Developer',
        domains: staffToEdit.domains || [],
        seniority: staffToEdit.seniority || 'mid',
        teamId: staffToEdit.teamId ?? null,
        hoursPerDay: staffToEdit.hoursPerDay || 8,
        startDate: staffToEdit.startDate || '',
        endDate: staffToEdit.endDate || '',
        hourlyRate: staffToEdit.hourlyRate || '',
        skills: staffToEdit.skills || [],
        notes: staffToEdit.notes || '',
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [staffToEdit]);

  const [newSkill, setNewSkill] = useState('');

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'QA Engineer',
    'DevOps Engineer',
    'Project Manager',
    'Data Analyst',
    'Technical Lead',
    'Scrum Master',
  ];

  const seniorityLevels = [
    { value: 'junior', label: 'Junior', description: '0-2 years' },
    { value: 'mid', label: 'Mid-Level', description: '2-5 years' },
    { value: 'senior', label: 'Senior', description: '5-8 years' },
    { value: 'lead', label: 'Lead/Principal', description: '8+ years' },
  ];

  const domains = [
    'Claims Processing',
    'Benefits Administration',
    'Member Services',
    'Provider Network',
    'Eligibility & Enrollment',
    'Care Management',
    'Compliance & Regulatory',
    'Analytics & Reporting',
    'Payment & Billing',
    'Customer Portal',
  ];

  const commonSkills = [
    'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript',
    'Node.js', 'Python', 'Java', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Figma', 'Sketch', 'CSS', 'Tailwind', 'SASS',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const addDomain = (domain) => {
    if (domain && !formData.domains.includes(domain)) {
      setFormData(prev => ({ ...prev, domains: [...prev.domains, domain] }));
    }
  };

  const removeDomain = (domainToRemove) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.filter(domain => domain !== domainToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const initials = `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase();
    const staffData = { ...formData, avatar: initials };
    // Remove UI-only fields before sending to API
    delete staffData.startDate;
    delete staffData.endDate;
    delete staffData.hourlyRate;
    delete staffData.notes;
    onSubmit?.(staffData, isEditMode);
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  if (!isOpen) return null;

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
                <User className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{isEditMode ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isEditMode
                  ? `Editing ${displayName(staffToEdit)}`
                  : projectName
                    ? `Assign to ${projectName}`
                    : 'Add a new team member'}
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
          {/* Personal Information */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Middle Initial</label>
                <input
                  type="text"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  placeholder="M"
                  maxLength={1}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@company.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Role & Experience */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Briefcase className="w-4 h-4" />
              Role & Experience
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Seniority Level</label>
                <select
                  name="seniority"
                  value={formData.seniority}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {seniorityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} ({level.description})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Team</label>
                <select
                  name="teamId"
                  value={formData.teamId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      teamId: value === '' ? null : value
                    }));
                  }}
                  className={inputClass}
                >
                  <option value="">Unassigned</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Domain Expertise</label>

              {/* Selected Domains */}
              {formData.domains.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {domain}
                      <button
                        type="button"
                        onClick={() => removeDomain(domain)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Domain Options */}
              <div className="flex flex-wrap gap-2">
                {domains
                  .filter(domain => !formData.domains.includes(domain))
                  .map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => addDomain(domain)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        isDarkMode
                          ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      + {domain}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              Availability
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Hours per Day *</label>
                <select
                  name="hoursPerDay"
                  value={formData.hoursPerDay}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                    <option key={hours} value={hours}>{hours} hours</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </div>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </div>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Hourly Rate
                </div>
              </label>
              <input
                type="text"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="e.g., $75/hr"
                className={`${inputClass} max-w-[200px]`}
              />
            </div>
          </div>

          {/* Skills */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Skills
            </h3>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Custom Skill */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
                placeholder="Add a skill..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => addSkill(newSkill)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Common Skills */}
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Quick add:
              </p>
              <div className="flex flex-wrap gap-2">
                {commonSkills
                  .filter(skill => !formData.skills.includes(skill))
                  .slice(0, 10)
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        isDarkMode
                          ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this team member..."
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className={`flex items-center justify-end gap-3 pt-6 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
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
                  Add Staff Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffForm;
