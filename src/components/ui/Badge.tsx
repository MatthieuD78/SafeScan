import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-500',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100',
    info: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    danger: 'bg-red-50 text-red-600 border border-red-100'
  };

  const sizes = {
    sm: 'px-2 py-0.5 rounded-lg text-[10px]',
    md: 'px-3 py-1 rounded-xl text-xs'
  };

  return (
    <span className={`font-black ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
