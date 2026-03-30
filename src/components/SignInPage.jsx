import React, { useState, useEffect } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Shield, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SignInPage = ({ onBack, onSignUp, onForgotPassword, registrationData, onClearRegistrationData }) => {
  const { isDarkMode } = useTheme();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [formData, setFormData] = useState({
    email: registrationData?.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(
    registrationData?.registrationSuccess ? 'Account created successfully! Please sign in to continue.' : ''
  );

  // Email verification state
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Clear registration data after showing message
  useEffect(() => {
    if (registrationData && onClearRegistrationData) {
      const timer = setTimeout(() => {
        onClearRegistrationData();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [registrationData, onClearRegistrationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!isLoaded) {
      setError('Authentication is still loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Start sign-in with identifier and password
      let result = await signIn.create({
        identifier: formData.email.trim(),
        password: formData.password,
      });

      // Step 2: If first factor still needed (Clerk didn't auto-attempt password)
      if (result.status === 'needs_first_factor') {
        const passwordFactor = result.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'password'
        );
        const emailFactor = result.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'email_code'
        );

        if (passwordFactor) {
          result = await signIn.attemptFirstFactor({
            strategy: 'password',
            password: formData.password,
          });
        } else if (emailFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
          setVerificationStep(true);
          setSuccessMessage('');
          setError('');
          return;
        } else {
          console.log('Unsupported first factors:', result.supportedFirstFactors);
          setError('No supported sign-in method available.');
          return;
        }
      }

      // Step 3: Handle second factor if needed
      if (result.status === 'needs_second_factor') {
        const secondFactor = result.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code' || factor.strategy === 'totp'
        );

        if (secondFactor?.strategy === 'email_code') {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
          });
          setVerificationStep(true);
          setSuccessMessage('');
          setError('');
          return;
        } else {
          setError('Two-factor authentication required. Please use your authenticator app.');
          return;
        }
      }

      // Step 4: Complete sign-in
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.hash = '#dashboard';
      } else if (result.status === 'needs_client_trust') {
        // Client Trust: Clerk requires device verification via email/phone code.
        // This is NOT bot protection -- it defends against credential stuffing
        // on new/untrusted devices when the user has no MFA enabled.
        const trustFactor = result.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code' || factor.strategy === 'phone_code'
        );

        if (trustFactor) {
          await signIn.prepareSecondFactor({
            strategy: trustFactor.strategy,
          });
          setVerificationStep(true);
          setSuccessMessage('');
          setError('');
          return;
        } else {
          setError('Device verification required but no supported verification method is available. Please contact support.');
        }
      } else {
        console.log('Unexpected sign-in status:', result.status);
        console.log('Sign-in result:', JSON.stringify(result, null, 2));
        setError(`Unable to complete sign in (status: ${result.status}). Please try again.`);
      }

    } catch (err) {
      console.error('Sign in error:', err);
      // Handle Clerk-specific errors
      const clerkError = err.errors?.[0];
      if (clerkError) {
        if (clerkError.code === 'form_identifier_not_found') {
          setError('No account found with this email address.');
        } else if (clerkError.code === 'form_password_incorrect') {
          setError('Incorrect password. Please try again.');
        } else {
          setError(clerkError.message || 'Sign in failed. Please try again.');
        }
      } else {
        setError(err.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Try first factor verification first, then second factor
      let result;
      if (signIn.status === 'needs_first_factor') {
        result = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code: verificationCode.trim(),
        });
      } else {
        result = await signIn.attemptSecondFactor({
          strategy: 'email_code',
          code: verificationCode.trim(),
        });
      }

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.hash = '#dashboard';
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      const clerkError = err.errors?.[0];
      setError(clerkError?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (signIn.status === 'needs_first_factor') {
        const emailFactor = signIn.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'email_code'
        );
        if (emailFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
        }
      } else if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
        const factor = signIn.supportedSecondFactors?.find(
          (f) => f.strategy === 'email_code' || f.strategy === 'phone_code'
        );
        await signIn.prepareSecondFactor({
          strategy: factor?.strategy || 'email_code',
        });
      }
      setSuccessMessage('Verification code resent to your email.');
    } catch (err) {
      console.error('Resend code error:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            Welcome back
          </h1>
          <p className="text-xl text-blue-100">
            Sign in to manage your portfolio and keep your projects on track.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Risk Management</h3>
              <p className="text-blue-100 text-sm">Identify and mitigate project risks before they escalate.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Team Optimization</h3>
              <p className="text-blue-100 text-sm">Allocate resources efficiently across your portfolio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
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

            {/* Form Card */}
            <div className={`rounded-xl p-8 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-xl'
            }`}>
              {verificationStep ? (
                // Email Verification Form
                <>
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                    }`}>
                      <Mail className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Verify your email
                  </h2>
                  <p className={`mb-6 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    We've sent a verification code to<br />
                    <span className="font-medium">{formData.email}</span>
                  </p>

                  {successMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div>
                      <label htmlFor="verificationCode" className={labelClasses}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className={inputClasses('verificationCode')}
                        disabled={isLoading}
                        autoFocus
                        maxLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                        ${isLoading
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                        }
                        flex items-center justify-center gap-2
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Sign In'
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className={`text-sm ${
                          isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
                        } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        Didn't receive the code? <span className="text-blue-600 font-medium">Resend</span>
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationStep(false);
                          setVerificationCode('');
                          setError('');
                        }}
                        className={`text-sm ${
                          isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                // Sign In Form
                <>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Sign in to your account
              </h2>
              <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Enter your credentials to continue
              </p>

              {successMessage && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClasses('email')}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Password
                    </label>
                    {onForgotPassword && (
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={inputClasses('password')}
                      disabled={isLoading}
                      autoComplete="current-password"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                    ${isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }
                    flex items-center justify-center gap-2
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>
                </>
              )}

              {/* Sign Up Link */}
              <div className={`mt-6 pt-6 border-t text-center ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Don't have an account?{' '}
                  <button
                    onClick={onSignUp}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign up
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

export default SignInPage;
