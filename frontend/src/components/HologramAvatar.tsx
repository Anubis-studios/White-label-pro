import React from 'react';
import { Bot, Cpu, Zap, ShieldCheck } from 'lucide-react';

interface HologramAvatarProps {
  status?: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}

export const HologramAvatar: React.FC<HologramAvatarProps> = ({
  status = 'idle',
  message
}) => {
  const statusColors = {
    idle: 'text-[#00CFFF] border-[#00CFFF] shadow-[0_0_20px_rgba(0,207,255,0.6)]',
    processing: 'text-[#FFD700] border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.8)] animate-pulse',
    success: 'text-[#9B00FF] border-[#9B00FF] shadow-[0_0_25px_rgba(155,0,255,0.8)]',
    error: 'text-[#FF0033] border-[#FF0033] shadow-[0_0_25px_rgba(255,0,51,0.8)]'
  };

  const statusIcons = {
    idle: <Bot className="w-8 h-8" />,
    processing: <Cpu className="w-8 h-8 animate-spin" />,
    success: <ShieldCheck className="w-8 h-8" />,
    error: <Zap className="w-8 h-8" />
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0A10]/80 border border-white/10 backdrop-blur-md">
      <div className={`p-3 rounded-xl border ${statusColors[status]} bg-black/50 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-scan" />
        {statusIcons[status]}
      </div>
      <div>
        <div className="font-orbitron text-xs tracking-widest text-[#8E8EA8] uppercase">
          Agent AI Core • {status.toUpperCase()}
        </div>
        <p className="font-rajdhani text-sm font-semibold text-white tracking-wide">
          {message || "Ready to execute autonomous white-label tasks."}
        </p>
      </div>
    </div>
  );
};
