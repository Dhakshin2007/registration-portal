
import React, { useState } from 'react';
import { VALID_CREDENTIALS } from '../constants';
import InteractiveLogo from './InteractiveLogo';
import Input from './Input';
import Button from './Button';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.pass) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <InteractiveLogo />
      <form className="space-y-6" onSubmit={handleLogin}>
        <Input
          id="email"
          label="Email ID"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <Button type="submit">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
