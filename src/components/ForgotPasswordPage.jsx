import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Shield, Mail, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ForgotPasswordPage = ({ onBack, onSignIn }) => {
  const { isDarkMode } = useTheme();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'success'

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isLoaded) return;

    setIsLoading(true);

    try {
      // Start the password reset flow
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep('code');
    } catch (err) {
      console.error('Password reset error:', err);
      const clerkError = err.errors?.[0];
      if (clerkError?.code === 'form_identifier_not_found') {
        setError('No account found with this email address.');
      } else {
        setError(clerkError?.message || 'Failed to send reset code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isLoaded) return;

    setIsLoading(true);

    try {
      // Attempt to reset the password with the code
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code,
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setStep('success');
      } else if (result.status === 'needs_second_factor') {
        setError('Your account requires 2FA. Please contact support.');
      } else {
        console.log('Reset status:', result.status);
        setError('Unable to complete password reset. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const clerkError = err.errors?.[0];
      if (clerkError?.code === 'form_code_incorrect') {
        setError('Invalid verification code. Please check and try again.');
      } else if (clerkError?.code === 'form_password_pwned') {
        setError('This password has been found in a data breach. Please choose a different password.');
      } else {
        setError(clerkError?.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg border transition-colors ${
    isDarkMode
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500'
  } focus:outline-none focus:ring-2 focus:ring-opacity-50`;

  const labelClasses = `block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;

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
            Back to sign in
          </button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Project Shield</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Reset your password
          </h1>
          <p className="text-xl text-blue-100">
            We'll help you get back into your account safely.
          </p>
        </div>
        <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/10'}`}>
          <h3 className="text-white font-semibold mb-2">Need help?</h3>
          <p className="text-blue-100 text-sm">
            If you're having trouble accessing your account, contact our support team for assistance.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col">
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

            {step === 'success' ? (
              // Success state
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <CheckCircle className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Password reset successful
                </h2>
                <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Your password has been successfully reset. You are now signed in.
                </p>
                <button
                  onClick={() => window.location.hash = '#dashboard'}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : step === 'code' ? (
              // Verification code + new password step
              <div className={`rounded-xl p-8 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-xl'
              }`}>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Enter verification code
                </h2>
                <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  We've sent a code to <span className="font-medium">{email}</span>
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Verification Code */}
                  <div>
                    <label htmlFor="code" className={labelClasses}>
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className={inputClasses}
                      disabled={isLoading}
                      autoComplete="one-time-code"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className={labelClasses}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className={inputClasses}
                        disabled={isLoading}
                        autoComplete="new-password"
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
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className={labelClasses}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className={inputClasses}
                        disabled={isLoading}
                        autoComplete="new-password"
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
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                      ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                      flex items-center justify-center gap-2
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </button>
                </form>

                <p className={`text-center mt-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Didn't receive the code?{' '}
                  <button
                    onClick={() => {
                      setStep('email');
                      setCode('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setError('');
                    }}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              // Email input step
              <div className={`rounded-xl p-8 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-xl'
              }`}>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Forgot your password?
                </h2>
                <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  No worries! Enter your email and we'll send you a reset code.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`} />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`${inputClasses} pl-11`}
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                      ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                      flex items-center justify-center gap-2
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send reset code'
                    )}
                  </button>
                </form>

                <div className={`mt-6 pt-6 border-t text-center ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Remember your password?{' '}
                    <button
                      onClick={onSignIn}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
