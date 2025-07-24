
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = 'w-full px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
