import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const passwordRequirements = [
    'At least 12 characters long',
    'Contains uppercase and lowercase letters',
    'Contains at least one number',
    'Contains at least one special character (!@#$%^&*)',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    setErrors([]);
    setShowErrors(false);
  };

  const validateForm = () => {
    const newErrors = [];

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.push('Name must be at least 2 characters long');
    }

    // Email validation
    if (!formData.email) {
      newErrors.push('Email is required');
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }

    // Password validation
    if (!formData.password) {
      newErrors.push('Password is required');
    } else if (formData.password.length < 12) {
      newErrors.push('Password must be at least 12 characters long');
    } else {
      if (!/[a-z]/.test(formData.password)) {
        newErrors.push('Password must contain at least one lowercase letter');
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.push('Password must contain at least one uppercase letter');
      }
      if (!/\\d/.test(formData.password)) {
        newErrors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.push('Password must contain at least one special character');
      }
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    // Phone validation (optional but if provided must be valid)
    if (formData.phone && !/^\\d{10}$/.test(formData.phone)) {
      newErrors.push('Phone number must be 10 digits');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowErrors(true);
      // Show first error as toast
      toast.error(newErrors[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors([]);
    setShowErrors(false);

    // Validate
    if (!validateForm()) {
      return;
    }

    const loadingToast = toast.loading('Creating your account...');

    try {
      setLoading(true);

      const response = await signup(
        formData.name.trim(),
        formData.email.toLowerCase().trim(),
        formData.password,
        formData.phone || undefined
      );

      toast.dismiss(loadingToast);

      if (response && response.success) {
        // State and localStorage are managed by AuthContext

        // Success message
        toast.success(`Welcome to Abaya Clothing, ${response.user?.name}! 🎉`, {
          duration: 3000,
        });

        // Redirect
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 500);
      }

    } catch (error) {
      toast.dismiss(loadingToast);

      console.error('❌ Registration error:', error);

      const newErrors = [];

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            newErrors.push(...data.errors);
          } else if (data.message) {
            newErrors.push(data.message);
          } else {
            newErrors.push('Please check your input and try again');
          }
        } else if (status === 409 || (data.message && data.message.includes('already exists'))) {
          newErrors.push('An account with this email already exists');
        } else {
          newErrors.push(data.message || 'Registration failed. Please try again.');
        }
      } else if (error.isNetworkError) {
        newErrors.push(error.message || 'Cannot connect to server');
      } else {
        newErrors.push('An unexpected error occurred. Please try again.');
      }

      setErrors(newErrors);
      setShowErrors(true);
      toast.error(newErrors[0] || 'Registration failed');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Errors Display */}
        {showErrors && errors.length > 0 && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please correct the following {errors.length === 1 ? 'error' : 'errors'}:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm disabled:bg-gray-100"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm disabled:bg-gray-100"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm disabled:bg-gray-100"
                placeholder="9876543210"
                maxLength={10}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm disabled:bg-gray-100"
                placeholder="Create a strong password"
              />
              <div className="mt-2 text-xs text-gray-600">
                <p className="font-semibold mb-1">Password must have:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {passwordRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm disabled:bg-gray-100"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
