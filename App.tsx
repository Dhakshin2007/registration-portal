
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4">
      {isAuthenticated ? (
        <RegistrationPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
