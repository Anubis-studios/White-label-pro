import React from 'react';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';
import { Sparkles, ArrowLeft, Music, Video, CheckCircle2 } from 'lucide-react';

interface ProductViewProps {
  product: any;
  executionResult: any;
  onBack: () => void;
}

export const ProductView: React.FC<ProductViewProps> = ({
  product,
  executionResult,
  onBack
}) => {
  const result = executionResult?.result || executionResult;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 font-orbitron text-xs text-[#8E8EA8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Storefront
      </button>

      <GlowCard variant="purple" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-orbitron text-[#9B00FF] uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#00CFFF]" /> Execution Complete
            </span>
            <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-wider mt-1">
              {product?.name || "AI Output Stream"}
            </h2>
          </div>
          <div className="px-3 py-1 rounded bg-[#9B00FF]/20 border border-[#9B00FF] text-xs font-orbitron text-[#00CFFF]">
            ID: {executionResult?.transactionId?.slice(0, 8) || "TX-SUCCESS"}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-black/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-orbitron text-[#8E8EA8] uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#FFD700]" /> Generated Result Payload
          </div>

          {result?.imageUrl ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-[#9B00FF]/50 shadow-[0_0_30px_rgba(155,0,255,0.4)]">
                <img
                  src={result.imageUrl}
                  alt="Generated AI artwork"
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-xs font-rajdhani text-[#8E8EA8]">
                Prompt: <span className="text-white font-semibold">{result.prompt}</span>
              </div>
            </div>
          ) : result?.videoUrl ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-[#00CFFF]/50 shadow-[0_0_30px_rgba(0,207,255,0.4)] bg-black">
                <div className="flex items-center gap-2 p-3 bg-black/60 border-b border-white/10 text-xs font-orbitron text-[#00CFFF]">
                  <Video className="w-4 h-4" /> AI Synthetic Video Frame
                </div>
                <video controls autoPlay loop className="w-full h-auto max-h-[500px]">
                  <source src={result.videoUrl} type="video/mp4" />
                  Your browser does not support video tag playback.
                </video>
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-xs font-rajdhani text-[#8E8EA8]">
                Prompt: <span className="text-white font-semibold">{result.prompt || "Synthetic AI Video Stream"}</span>
              </div>
            </div>
          ) : result?.audioUrl ? (
            <div className="space-y-4 p-6 rounded-xl bg-[#0A0A10] border border-[#FFD700]/40 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <div className="flex items-center gap-3 text-white font-orbitron text-sm">
                <Music className="w-6 h-6 text-[#FFD700]" /> Synthesized Audio & Voice Output
              </div>
              <audio controls className="w-full">
                <source src={result.audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : result?.text ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/90 border border-[#00CFFF]/40 text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-[0_0_20px_rgba(0,207,255,0.2)]">
                {result.text}
              </div>
              <div className="flex items-center justify-between text-xs font-rajdhani text-[#8E8EA8]">
                <span>Model: {result.model || 'CyberLLM-v4'}</span>
                <span>Tokens Used: {result.tokensUsed || 120}</span>
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-black/90 text-xs font-mono text-white overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <NeonButton variant="purple" onClick={onBack}>
            Return to Storefront
          </NeonButton>
        </div>
      </GlowCard>
    </div>
  );
};
