import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountLocked, setAccountLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    setShowError(false);
    setErrorMessage('');
    setAccountLocked(false);
    setRemainingAttempts(null);
  };

  const validateForm = () => {
    // Email validation
    if (!formData.email) {
      const msg = 'Please enter your email address';
      setErrorMessage(msg);
      setShowError(true);
      toast.error(msg);
      return false;
    }

    if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      const msg = 'Please enter a valid email address';
      setErrorMessage(msg);
      setShowError(true);
      toast.error(msg);
      return false;
    }

    // Password validation
    if (!formData.password) {
      const msg = 'Please enter your password';
      setErrorMessage(msg);
      setShowError(true);
      toast.error(msg);
      return false;
    }

    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setErrorMessage(msg);
      setShowError(true);
      toast.error(msg);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error states
    setShowError(false);
    setErrorMessage('');
    setAccountLocked(false);
    setRemainingAttempts(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Logging in...');

    try {
      setLoading(true);

      const response = await login(
        formData.email.toLowerCase().trim(),
        formData.password
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Check response
      if (response && response.success) {
        // State and localStorage are handled by AuthContext

        // Show success message
        toast.success(`Welcome back, ${response.user?.name || 'User'}! 🎉`, {
          duration: 2000,
        });

        // Redirect after short delay
        setTimeout(() => {
          const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectTo);
          window.location.reload(); // Refresh to update auth state
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      console.error('❌ Login error:', error);

      let errorMsg = 'Login failed. Please try again.';
      let showToast = true;

      // Handle different error types
      if (error.response) {
        const { status, data } = error.response;

        // Removed debug logs
        switch (status) {
          case 400:
            // Bad Request - validation error
            errorMsg = data.message || 'Please check your input and try again';
            if (data.errors && Array.isArray(data.errors)) {
              errorMsg = data.errors.join('. ');
            }
            break;

          case 401:
            // Unauthorized - wrong credentials
            errorMsg = data.message || 'Invalid email or password';
            
            // Show remaining attempts if available
            if (data.remainingAttempts !== undefined) {
              setRemainingAttempts(data.remainingAttempts);
              if (data.remainingAttempts > 0) {
                errorMsg = `${errorMsg}. ${data.remainingAttempts} attempt(s) remaining before account lockout.`;
              }
            }
            break;

          case 403:
            // Forbidden - account deactivated
            errorMsg = data.message || 'Your account has been deactivated. Please contact support.';
            break;

          case 423:
            // Locked - account temporarily locked
            setAccountLocked(true);
            setLockUntil(data.lockUntil);
            
            if (data.lockUntil) {
              const lockDate = new Date(data.lockUntil);
              const now = new Date();
              const minutesRemaining = Math.ceil((lockDate.getTime() - now.getTime()) / 60000);
              errorMsg = `Account locked due to too many failed login attempts. Please try again in ${minutesRemaining} minute(s).`;
            } else {
              errorMsg = data.message || 'Account temporarily locked. Please try again later.';
            }
            break;

          case 429:
            // Too Many Requests
            errorMsg = 'Too many login attempts. Please wait a few minutes and try again.';
            break;

          case 500:
          case 502:
          case 503:
            // Server Error
            errorMsg = 'Server error. Please try again later.';
            break;

          default:
            errorMsg = data.message || 'An unexpected error occurred';
        }

      } else if (error.isNetworkError) {
        // Network error
        errorMsg = error.message || 'Cannot connect to server. Please check your internet connection.';
      } else if (error.request) {
        // Request made but no response
        errorMsg = 'No response from server. Please check your internet connection.';
      } else {
        // Other errors
        errorMsg = error.message || 'An unexpected error occurred';
      }

      // Set error state
      setErrorMessage(errorMsg);
      setShowError(true);

      // Show toast notification
      if (showToast) {
        toast.error(errorMsg, {
          duration: accountLocked ? 7000 : 5000,
          style: {
            maxWidth: '500px',
          },
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-black hover:underline"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {showError && errorMessage && (
          <div className={`rounded-md p-4 ${accountLocked ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className={`h-5 w-5 ${accountLocked ? 'text-red-400' : 'text-orange-400'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${accountLocked ? 'text-red-800' : 'text-orange-800'}`}>
                  {accountLocked ? 'Account Locked' : 'Login Failed'}
                </h3>
                <div className={`mt-2 text-sm ${accountLocked ? 'text-red-700' : 'text-orange-700'}`}>
                  <p>{errorMessage}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p className="mt-2 font-semibold">
                      ⚠️ Warning: {remainingAttempts} attempt(s) remaining
                    </p>
                  )}
                  {accountLocked && lockUntil && (
                    <p className="mt-2 text-xs">
                      Locked until: {new Date(lockUntil).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading || accountLocked}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading || accountLocked}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-black hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || accountLocked}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : accountLocked ? (
                '🔒 Account Locked'
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-black hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
