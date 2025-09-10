import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface SignupPageProps {
  onBackToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
      const response = await apiService.register(formData);
      setMessage({ 
        text: 'Registration successful! Check your email for login credentials.', 
        type: 'success' 
      });
      
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Registration failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Image */}
            <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 flex flex-col justify-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Join Our Team!</h2>
                <p className="text-green-100 mb-6">
                  Create your account and start managing your workforce with our comprehensive HRMS platform.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Easy Setup Process</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Secure Data Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="lg:w-1/2 p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <UserPlus className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                  <p className="text-gray-600">Fill in your details to get started</p>
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Account Setup</p>
                        <p>After registration, you'll receive login credentials via email. Please check your inbox and change your password after first login.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={onBackToLogin}
                      className="text-green-600 hover:text-green-700 font-medium"
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
    </div>
  );
};

export default SignupPage;