import React from 'react';
import { XCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-white w-full ${sizes[size]} rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-20 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          {title && <h3 className="text-2xl font-black text-slate-800">{title}</h3>}
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors ml-auto"
          >
            <XCircle className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div>{children}</div>
        
        {footer && <div>{footer}</div>}
      </div>
    </div>
  );
};
