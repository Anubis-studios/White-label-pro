import React from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  variant?: 'purple' | 'blue' | 'gold' | 'red';
  className?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  variant = 'purple',
  className = ''
}) => {
  const borderGlows = {
    purple: "border-[#9B00FF]/40 hover:border-[#9B00FF] shadow-[0_0_15px_rgba(155,0,255,0.2)] hover:shadow-[0_0_30px_rgba(155,0,255,0.5)]",
    blue: "border-[#00CFFF]/40 hover:border-[#00CFFF] shadow-[0_0_15px_rgba(0,207,255,0.2)] hover:shadow-[0_0_30px_rgba(0,207,255,0.5)]",
    gold: "border-[#FFD700]/40 hover:border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]",
    red: "border-[#FF0033]/40 hover:border-[#FF0033] shadow-[0_0_15px_rgba(255,0,51,0.2)] hover:shadow-[0_0_30px_rgba(255,0,51,0.5)]"
  };

  return (
    <div
      className={`relative bg-[#0A0A10]/90 backdrop-blur-md border rounded-xl p-6 transition-all duration-300 ${borderGlows[variant]} ${className}`}
    >
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-xl pointer-events-none" />
      {children}
    </div>
  );
};
