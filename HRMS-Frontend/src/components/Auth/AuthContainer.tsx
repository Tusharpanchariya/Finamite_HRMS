import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

interface AuthContainerProps {
  onLoginSuccess: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLoginSuccess }) => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {showSignup ? (
        <SignupPage onBackToLogin={() => setShowSignup(false)} />
      ) : (
        <LoginPage 
          onLoginSuccess={onLoginSuccess}
          onShowSignup={() => setShowSignup(true)}
        />
      )}
    </>
  );
};

export default AuthContainer;