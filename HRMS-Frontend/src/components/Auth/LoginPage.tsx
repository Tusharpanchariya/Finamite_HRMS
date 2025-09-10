import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ForgotPasswordRequest } from '../../types/auth.types';

// The LoginPageProps interface is unchanged
interface LoginPageProps {
  onLoginSuccess: () => void;
  onShowSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onShowSignup }) => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New state for "Remember Me" and "Forgot Password" modal
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Pass the rememberMe state to the setUser function
      const response = await apiService.login(formData);
      setUser(response.user, response.token, rememberMe);
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Login failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    setForgotPasswordMessage(null);

    try {
      const requestData: ForgotPasswordRequest = { email: forgotPasswordEmail };
      const response = await apiService.forgotPassword(requestData);
      setForgotPasswordMessage({ text: response.message, type: 'success' });
      // Clear the email field after a successful request
      setForgotPasswordEmail('');
      // Optionally, close the modal after a delay
      setTimeout(() => {
        setShowForgotPasswordModal(false);
      }, 3000);
    } catch (error) {
      setForgotPasswordMessage({
        text: error instanceof Error ? error.message : 'Failed to send reset link.',
        type: 'error'
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Image */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-blue-100 mb-6">
                  Sign in to access your HRMS dashboard and manage your workforce efficiently.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="text-blue-100">Employee Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="text-blue-100">Attendance Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="text-blue-100">Payroll Management</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="lg:w-1/2 p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <LogIn className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                {/* Message */}
                {message && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>
                    {/* Updated button to show the modal */}
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={onShowSignup}
                      className="text-blue-600 hover:text-blue-700 font-medium"
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

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Forgot Password?</h2>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {forgotPasswordMessage && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                forgotPasswordMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {forgotPasswordMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{forgotPasswordMessage.text}</span>
              </div>
            )}
            
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  name="forgot-email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotPasswordMessage(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isForgotPasswordLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isForgotPasswordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
