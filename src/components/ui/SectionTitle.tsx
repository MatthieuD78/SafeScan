import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  icon: Icon, 
  children,
  className = ''
}) => (
  <h4 className={`px-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ${className}`}>
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </h4>
);
