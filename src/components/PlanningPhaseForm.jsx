import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Pencil } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PlanningPhaseForm = ({ isOpen, onClose, onSubmit, phaseToEdit }) => {
  const { isDarkMode } = useTheme();
  const isEditMode = !!phaseToEdit;

  const getInitialFormData = () => ({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'quarter',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && phaseToEdit) {
      setFormData({
        name: phaseToEdit.name || '',
        description: phaseToEdit.description || '',
        startDate: phaseToEdit.startDate || '',
        endDate: phaseToEdit.endDate || '',
        type: phaseToEdit.type || 'quarter',
      });
    } else if (!isEditMode) {
      setFormData(getInitialFormData());
    }
  }, [isEditMode, phaseToEdit]);

  const phaseTypes = [
    { value: 'quarter', label: 'Quarterly', examples: 'Q1 2025, Q2 2025' },
    { value: 'half', label: 'Half-Year', examples: 'H1 2025, H2 2025' },
    { value: 'annual', label: 'Annual', examples: 'FY 2025' },
    { value: 'custom', label: 'Custom', examples: 'Sprint 1, Release 2.0' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      // Keep existing projects when editing
      onSubmit?.({
        ...phaseToEdit,
        ...formData,
      }, true);
    } else {
      onSubmit?.({
        ...formData,
        id: Date.now(),
        projects: [],
        tacticalProjects: [],
      }, false);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData(getInitialFormData());
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
      <div className={`relative w-full max-w-lg rounded-xl shadow-2xl m-auto ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isEditMode ? 'bg-blue-100' : 'bg-indigo-100'
            }`}>
              {isEditMode ? (
                <Pencil className="w-5 h-5 text-blue-600" />
              ) : (
                <Calendar className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {isEditMode ? 'Edit Planning Phase' : 'New Planning Phase'}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isEditMode ? 'Update phase details' : 'Create a strategic planning period'}
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
          <div>
            <label className={labelClass}>Phase Type</label>
            <div className="grid grid-cols-2 gap-3">
              {phaseTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.type === type.value
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : isDarkMode
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className={`text-xs mt-1 ${
                    formData.type === type.value ? 'text-indigo-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>{type.examples}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Phase Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Q1 2025"
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
              placeholder="Goals and focus areas for this planning phase..."
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
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
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isEditMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
                  Create Phase
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanningPhaseForm;
