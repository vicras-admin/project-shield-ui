import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Check, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { invitationApi } from '../services/api';

const AcceptInvitePage = ({ onBack, onSignIn }) => {
  const { isDarkMode } = useTheme();

  const [token, setToken] = useState('');
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const tokenParam = params.get('token');

    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setValidating(false);
      setValidation({ valid: false });
    }
  }, []);

  const validateToken = async (t) => {
    try {
      const result = await invitationApi.validate(t);
      setValidation(result);
    } catch (err) {
      setValidation({ valid: false });
    } finally {
      setValidating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await invitationApi.accept({
        token,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
      });

      onSignIn({
        registrationSuccess: true,
        email: validation.email,
      });
    } catch (err) {
      setError(err.message || 'Failed to accept invitation. Please try again.');
      setIsLoading(false);
    }
  };

  const formatRole = (role) => {
    if (!role) return '';
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${fieldErrors[fieldName]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : isDarkMode
        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-50
  `;

  const labelClasses = `block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;

  // Loading state
  if (validating) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Validating invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid/expired/revoked state
  if (!validation?.valid) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
        <div className={`max-w-md w-full mx-4 rounded-xl p-8 text-center ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-xl'}`}>
          <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${validation?.expired ? 'text-amber-500' : 'text-red-500'}`} />
          <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {validation?.expired ? 'Invitation Expired' : 'Invalid Invitation'}
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {validation?.expired
              ? 'This invitation has expired. Please ask the admin to send a new one.'
              : 'This invitation link is invalid or has already been used.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Left side - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 flex-col justify-between p-12 ${
        isDarkMode ? 'bg-gradient-to-br from-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-600 to-blue-800'
      }`}>
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Project Shield</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            You've been invited!
          </h1>
          <p className="text-xl text-blue-100">
            Join <strong>{validation.organizationName}</strong> as a <strong>{formatRole(validation.role)}</strong>.
          </p>
        </div>
        <div className="space-y-4">
          {[
            'Collaborate with your team in real-time',
            'Track projects and capacity',
            'Identify staffing gaps early',
            'Plan scenarios for better outcomes',
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-100">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Accept Form */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden p-6">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Project Shield
              </span>
            </div>

            {/* Form Card */}
            <div className={`rounded-xl p-8 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-xl'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Accept Invitation
              </h2>
              <p className={`mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Create your account to join <strong>{validation.organizationName}</strong>
              </p>

              {/* Invitation info */}
              <div className={`mb-6 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-blue-50'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Email: </span>
                  <strong>{validation.email}</strong>
                </div>
                <div className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Role: </span>
                  <strong>{formatRole(validation.role)}</strong>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className={labelClasses}>First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={inputClasses('firstName')}
                      disabled={isLoading}
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={inputClasses('lastName')}
                      disabled={isLoading}
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className={labelClasses}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={inputClasses('password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={inputClasses('confirmPassword')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Accept & Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className={`mt-6 pt-6 border-t text-center ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Already have an account?{' '}
                  <button
                    onClick={() => onSignIn()}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
