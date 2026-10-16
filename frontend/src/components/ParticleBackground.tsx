import React from 'react';

export const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202]">
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-[#9B00FF]/15 rounded-full blur-[130px]" />
      <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] bg-[#00CFFF]/15 rounded-full blur-[150px]" />
      <div className="absolute -bottom-[20%] left-[20%] w-[650px] h-[650px] bg-[#FF0033]/10 rounded-full blur-[140px]" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#9B00FF 1px, transparent 1px), linear-gradient(90deg, #9B00FF 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: i % 2 === 0 ? '#9B00FF' : '#00CFFF',
              boxShadow: i % 2 === 0 ? '0 0 10px #9B00FF' : '0 0 10px #00CFFF',
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${Math.random() * 5 + 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
