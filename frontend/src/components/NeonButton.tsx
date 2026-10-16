import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'purple' | 'blue' | 'gold' | 'red';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'purple',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "relative font-orbitron uppercase tracking-widest font-semibold transition-all duration-300 rounded overflow-hidden group flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base"
  };

  const variantStyles = {
    purple: "border border-[#9B00FF] text-white bg-[#0A0A10] hover:bg-[#9B00FF] hover:shadow-[0_0_25px_rgba(155,0,255,0.8)] shadow-[0_0_10px_rgba(155,0,255,0.4)]",
    blue: "border border-[#00CFFF] text-white bg-[#0A0A10] hover:bg-[#00CFFF] hover:text-black hover:shadow-[0_0_25px_rgba(0,207,255,0.8)] shadow-[0_0_10px_rgba(0,207,255,0.4)]",
    gold: "border border-[#FFD700] text-white bg-[#0A0A10] hover:bg-[#FFD700] hover:text-black hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] shadow-[0_0_10px_rgba(255,215,0,0.4)]",
    red: "border border-[#FF0033] text-white bg-[#0A0A10] hover:bg-[#FF0033] hover:shadow-[0_0_25px_rgba(255,0,51,0.8)] shadow-[0_0_10px_rgba(255,0,51,0.4)]"
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
};
