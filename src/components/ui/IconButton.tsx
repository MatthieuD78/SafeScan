import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'flex flex-col items-center gap-1 transition-all';
  
  const variants = {
    default: '',
    ghost: 'hover:bg-slate-100 rounded-xl'
  };
  
  const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-[10px]' },
    md: { icon: 'w-6 h-6', text: 'text-[10px]' }
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className={sizes[size].icon}>{icon}</span>
      {label && (
        <span className={`${sizes[size].text} font-black uppercase tracking-tighter`}>
          {label}
        </span>
      )}
    </button>
  );
};
