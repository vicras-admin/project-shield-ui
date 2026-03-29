import React, { useState } from 'react';
import { X, Calendar, Users, DollarSign, Clock, Target, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NewProjectForm = ({ isOpen, onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    deadline: '',
    budget: '',
    hoursEstimate: '',
    description: '',
    priority: 'medium',
    staffingRequirements: [
      { role: 'Frontend Developer', required: 1 },
      { role: 'Backend Developer', required: 1 },
    ],
  });

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Designer',
    'QA Engineer',
    'DevOps Engineer',
    'Project Manager',
    'Data Analyst',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStaffingChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      staffingRequirements: prev.staffingRequirements.map((req, i) =>
        i === index ? { ...req, [field]: field === 'required' ? parseInt(value) || 0 : value } : req
      ),
    }));
  };

  const addStaffingRequirement = () => {
    setFormData(prev => ({
      ...prev,
      staffingRequirements: [...prev.staffingRequirements, { role: 'Designer', required: 1 }],
    }));
  };

  const removeStaffingRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      staffingRequirements: prev.staffingRequirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>New Project</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Create a new project to track
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
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className={labelClass}>
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Website Redesign"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Client *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline *
                </div>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget
                </div>
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., $50,000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Estimated Hours
                </div>
              </label>
              <input
                type="number"
                name="hoursEstimate"
                value={formData.hoursEstimate}
                onChange={handleChange}
                placeholder="e.g., 500"
                className={inputClass}
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>
                Priority
              </label>
              <div className="flex gap-3">
                {['low', 'medium', 'high', 'critical'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      formData.priority === priority
                        ? priority === 'critical'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : priority === 'high'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : priority === 'medium'
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : isDarkMode
                          ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the project scope and goals..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>

          <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <label className={labelClass.replace('mb-2', 'mb-0')}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Staffing Requirements
                </div>
              </label>
              <button
                type="button"
                onClick={addStaffingRequirement}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
            </div>

            <div className="space-y-3">
              {formData.staffingRequirements.map((req, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                  <select
                    value={req.role}
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
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Need:
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={req.required}
                      onChange={(e) => handleStaffingChange(index, 'required', e.target.value)}
                      className={`w-16 p-2 rounded-lg border text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  {formData.staffingRequirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStaffingRequirement(index)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'hover:bg-slate-600 text-slate-400'
                          : 'hover:bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

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
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;
