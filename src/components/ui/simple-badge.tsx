import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '', 
  children 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  
  const variants = {
    default: 'bg-teal-600 text-white',
    secondary: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};