import React, { useState, useEffect } from 'react';
import { X, Lightbulb, Plus, Trash2, DollarSign, Shield, Wrench, TrendingUp, Users, Star, Calendar, AlertTriangle, Pencil } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StrategicProjectForm = ({ isOpen, onClose, onSubmit, phaseName, projectToEdit, phaseStartDate, phaseEndDate }) => {
  const { isDarkMode } = useTheme();
  const isEditMode = !!projectToEdit;

  const getInitialFormData = () => ({
    name: '',
    description: '',
    justification: '',
    sponsor: '',
    estimatedBudget: '',
    startDate: phaseStartDate || '',
    endDate: phaseEndDate || '',
    ratings: {
      revenue: 3,
      technicalDebt: 3,
      security: 3,
      customerSatisfaction: 3,
      strategicAlignment: 3,
    },
    staffingNeeds: [
      { role: 'Frontend Developer', count: 1, durationWeeks: 4 },
    ],
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [dateErrors, setDateErrors] = useState({ startDate: '', endDate: '' });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        description: projectToEdit.description || '',
        justification: projectToEdit.justification || '',
        sponsor: projectToEdit.sponsor || '',
        estimatedBudget: projectToEdit.estimatedBudget || '',
        startDate: projectToEdit.startDate || phaseStartDate || '',
        endDate: projectToEdit.endDate || phaseEndDate || '',
        ratings: projectToEdit.ratings || {
          revenue: 3,
          technicalDebt: 3,
          security: 3,
          customerSatisfaction: 3,
          strategicAlignment: 3,
        },
        staffingNeeds: projectToEdit.staffingNeeds || [
          { role: 'Frontend Developer', count: 1, durationWeeks: 4 },
        ],
      });
      setDateErrors({ startDate: '', endDate: '' });
    } else if (!isEditMode) {
      setFormData(getInitialFormData());
      setDateErrors({ startDate: '', endDate: '' });
    }
  }, [isEditMode, projectToEdit, phaseStartDate, phaseEndDate]);

  const ratingCategories = [
    { key: 'revenue', label: 'Revenue Impact', icon: DollarSign, color: 'emerald' },
    { key: 'technicalDebt', label: 'Technical Debt Reduction', icon: Wrench, color: 'blue' },
    { key: 'security', label: 'Security Improvement', icon: Shield, color: 'red' },
    { key: 'customerSatisfaction', label: 'Customer Satisfaction', icon: Star, color: 'amber' },
    { key: 'strategicAlignment', label: 'Strategic Alignment', icon: TrendingUp, color: 'indigo' },
  ];

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
    'Security Engineer',
  ];

  const validateDates = (startDate, endDate) => {
    const errors = { startDate: '', endDate: '' };

    if (startDate && phaseStartDate && startDate < phaseStartDate) {
      errors.startDate = `Start date cannot be before phase start (${formatDateDisplay(phaseStartDate)})`;
    }

    if (endDate && phaseEndDate && endDate > phaseEndDate) {
      errors.endDate = `End date cannot be after phase end (${formatDateDisplay(phaseEndDate)})`;
    }

    if (startDate && endDate && startDate > endDate) {
      errors.endDate = 'End date must be after start date';
    }

    return errors;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    // Parse as local date to avoid timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate dates when they change
    if (name === 'startDate' || name === 'endDate') {
      const newFormData = { ...formData, [name]: value };
      const errors = validateDates(newFormData.startDate, newFormData.endDate);
      setDateErrors(errors);
    }
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value },
    }));
  };

  const handleStaffingChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      staffingNeeds: prev.staffingNeeds.map((need, i) =>
        i === index
          ? { ...need, [field]: field === 'role' ? value : parseInt(value) || 0 }
          : need
      ),
    }));
  };

  const addStaffingNeed = () => {
    setFormData(prev => ({
      ...prev,
      staffingNeeds: [...prev.staffingNeeds, { role: 'Backend Developer', count: 1, durationWeeks: 4 }],
    }));
  };

  const removeStaffingNeed = (index) => {
    setFormData(prev => ({
      ...prev,
      staffingNeeds: prev.staffingNeeds.filter((_, i) => i !== index),
    }));
  };

  const calculateOverallScore = () => {
    const values = Object.values(formData.ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const calculateTotalStaffWeeks = () => {
    return formData.staffingNeeds.reduce((sum, need) => sum + (need.count * need.durationWeeks), 0);
  };

  const hasDateErrors = () => {
    return dateErrors.startDate || dateErrors.endDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final date validation
    const errors = validateDates(formData.startDate, formData.endDate);
    if (errors.startDate || errors.endDate) {
      setDateErrors(errors);
      return;
    }

    const projectData = {
      ...formData,
      id: isEditMode ? projectToEdit.id : Date.now(),
      overallScore: parseFloat(calculateOverallScore()),
      totalStaffWeeks: calculateTotalStaffWeeks(),
      status: isEditMode ? projectToEdit.status : 'strategic',
      stackRank: isEditMode ? projectToEdit.stackRank : undefined,
      createdAt: isEditMode ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit?.(projectData, isEditMode);
    onClose();
  };

  const handleClose = () => {
    setFormData(getInitialFormData());
    setDateErrors({ startDate: '', endDate: '' });
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl m-auto ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isEditMode ? 'bg-blue-100' : 'bg-amber-100'
            }`}>
              {isEditMode ? (
                <Pencil className="w-5 h-5 text-blue-600" />
              ) : (
                <Lightbulb className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isEditMode ? 'Edit Project' : 'New Project Idea'}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {phaseName ? `${isEditMode ? 'Editing in' : 'Adding to'} ${phaseName}` : 'Strategic planning proposal'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Project Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Customer Portal Redesign"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Project Sponsor</label>
              <input
                type="text"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                placeholder="e.g., VP of Engineering"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Estimated Budget</label>
              <input
                type="text"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                placeholder="e.g., $150,000"
                className={inputClass}
              />
            </div>
          </div>

          {/* Project Dates */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Project Timeline
              </span>
              {phaseStartDate && phaseEndDate && (
                <span className={`text-xs ml-auto ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Phase: {formatDateDisplay(phaseStartDate)} - {formatDateDisplay(phaseEndDate)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={phaseStartDate}
                  max={phaseEndDate}
                  className={`${inputClass} ${dateErrors.startDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {dateErrors.startDate && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    {dateErrors.startDate}
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={phaseStartDate}
                  max={phaseEndDate}
                  className={`${inputClass} ${dateErrors.endDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {dateErrors.endDate && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    {dateErrors.endDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the project scope and deliverables..."
              rows={3}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Business Justification *</label>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              placeholder="Why is this project needed? What problem does it solve? What is the expected ROI?"
              rows={4}
              className={inputClass}
              required
            />
          </div>

          {/* Ratings */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Strategic Value Ratings
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                parseFloat(calculateOverallScore()) >= 4 ? 'bg-emerald-100 text-emerald-700' :
                parseFloat(calculateOverallScore()) >= 3 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                Overall: {calculateOverallScore()}/5
              </div>
            </div>

            <div className="space-y-4">
              {ratingCategories.map((category) => (
                <div key={category.key} className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <category.icon className={`w-4 h-4 text-${category.color}-500`} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {category.label}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {formData.ratings[category.key]}/5
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange(category.key, value)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.ratings[category.key] >= value
                            ? `bg-${category.color}-500 text-white`
                            : isDarkMode
                              ? 'bg-slate-600 text-slate-400 hover:bg-slate-500'
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                        }`}
                        style={{
                          backgroundColor: formData.ratings[category.key] >= value
                            ? category.color === 'emerald' ? '#10b981'
                              : category.color === 'blue' ? '#3b82f6'
                              : category.color === 'red' ? '#ef4444'
                              : category.color === 'amber' ? '#f59e0b'
                              : '#6366f1'
                            : undefined
                        }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staffing Needs */}
          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Users className="w-4 h-4" />
                Staffing Requirements
              </h3>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Total: {calculateTotalStaffWeeks()} staff-weeks
                </span>
                <button
                  type="button"
                  onClick={addStaffingNeed}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Role
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.staffingNeeds.map((need, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                  <select
                    value={need.role}
                    onChange={(e) => handleStaffingChange(index, 'role', e.target.value)}
                    className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Count:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={need.count}
                      onChange={(e) => handleStaffingChange(index, 'count', e.target.value)}
                      className={`w-16 p-2 rounded-lg border text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weeks:</span>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      value={need.durationWeeks}
                      onChange={(e) => handleStaffingChange(index, 'durationWeeks', e.target.value)}
                      className={`w-16 p-2 rounded-lg border text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  {formData.staffingNeeds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStaffingNeed(index)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center justify-end gap-3 pt-6 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={handleClose}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasDateErrors()}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                hasDateErrors()
                  ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                  : isEditMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {isEditMode ? (
                <>
                  <Pencil className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Project Idea
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StrategicProjectForm;
