import React, { useState } from 'react';

// Define a type for the message box state
type Message = {
  text: string;
  type: 'success' | 'error';
};

// LoginPage component
const LoginPage: React.FC = () => {
  // State for email and password input fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // State for password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // State for the message box
  const [message, setMessage] = useState<Message | null>(null);

  // Function to show a message box
  const showMessageBox = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    // Hide the message box after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle login form submission
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    // Default login credentials
    const defaultUsername = 'Admin';
    const defaultPassword = '123456';

    // Simple authentication logic
    if (email === defaultUsername && password === defaultPassword) {
      showMessageBox('Login successful!', 'success');
      // In a real application, you would redirect the user to the dashboard
      // For now, we'll just show the success message.
      // You might want to pass a prop like onLoginSuccess to the parent App component
      // to handle navigation after successful login.
      console.log('Login successful! Redirecting to dashboard...');
      // If this LoginPage is part of a larger app, you would typically call a prop
      // like `props.onLoginSuccess()` here to signal to the parent component.
      // For this isolated example, we'll just log.
    } else {
      showMessageBox('Invalid username or password.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Message Box */}
      {message && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 px-8 py-4 rounded-lg shadow-xl z-50 font-semibold text-white text-center transition-all duration-300 ease-in-out
            ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full transform transition-all duration-300 hover:scale-[1.01]">
        {/* Left Section (Image and Text) */}
        <div
          className="relative w-full md:w-1/2 bg-cover bg-center p-8 flex flex-col justify-end rounded-l-2xl"
          style={{ backgroundImage: 'url("https://placehold.co/800x600/34495e/ffffff?text=HRDashboard+Image")', minHeight: '400px' }}
        >
          {/* Using a more reliable placeholder image. Replace with your actual image if available */}
          <img
            src="https://www.zinghr.com/wp-content/uploads/2016/01/Know-How-Recruitment-Management-Software-Is-Helpful-For-HR-1-1.jpg"
            alt="Team collaborating"
            className="absolute inset-0 w-full h-full object-cover rounded-l-2xl"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/cccccc/333333?text=Image+Not+Found'; }} // Fallback image
          />
          <div className="relative z-10 bg-gray-900 bg-opacity-80 p-6 rounded-lg text-white backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-2">HRDashboard</h2>
            <h1 className="text-3xl font-bold mb-4">Let's empower your employees today.</h1>
            <p className="text-gray-300">We help to complete all your conveyancing needs easily</p>
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Login to your account</h2>
            <p className="text-gray-600 text-sm">Welcome back! Please enter your credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Input your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Input your password account"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out shadow-sm"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {/* Eye icon for show/hide password */}
                  <svg
                    className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={togglePasswordVisibility}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .986-3.11 3.24-5.6 6.095-7.14M12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.875 2.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPassword ? "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                  Remember Me
                </label>
              </div>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition duration-200">
                Forgot Password
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-[1.005]"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 font-medium">Or login with</div>

          <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 ease-in-out w-full sm:w-auto transform hover:scale-[1.005]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="h-5 w-5 mr-2" />
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 ease-in-out w-full sm:w-auto transform hover:scale-[1.005]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-5 w-5 mr-2" />
              Apple
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            You're new here?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition duration-200">
              Create Account
            </a>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © 2023 HRDashboard. All rights reserved.{' '}
            <a href="#" className="underline hover:text-gray-700">
              Terms & Conditions
            </a>{' '}
            <a href="#" className="underline ml-2 hover:text-gray-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
