import React from 'react';

interface LightningHoverProps {
  children: React.ReactNode;
  className?: string;
}

export const LightningHover: React.FC<LightningHoverProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-transparent via-[#00CFFF]/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {children}
    </div>
  );
};
