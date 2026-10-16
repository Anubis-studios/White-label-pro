import React, { useState } from 'react';
import axios from 'axios';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';
import { ShieldCheck, CreditCard, Lock, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  unitLabel: string;
  unitsPerPurchase: number;
  pricePenceTotal: number;
  formattedPrice: string;
  currency: string;
}

interface CheckoutProps {
  product: Product;
  onSuccess: (resultData: any) => void;
  onCancel: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  product,
  onSuccess,
  onCancel
}) => {
  const [quantity, setQuantity] = useState(1);
  const [prompt, setPrompt] = useState('Create a futuristic neon cyberpunk concept');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitTotal = quantity * product.unitsPerPurchase;
  const totalPricePence = quantity * product.pricePenceTotal;
  const formattedTotalPrice = `£${(totalPricePence / 100).toFixed(2)}`;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const intentRes = await axios.post('/api/checkout', {
        productId: product.id,
        quantity,
        payload: { prompt }
      });

      const { paymentIntentId } = intentRes.data;

      const confirmRes = await axios.post('/api/checkout', {
        productId: product.id,
        quantity,
        payload: { prompt },
        paymentIntentId
      });

      onSuccess(confirmRes.data);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Payment or execution error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 font-orbitron text-xs text-[#8E8EA8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Storefront
      </button>

      <GlowCard variant="blue" className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-orbitron text-[#00CFFF] uppercase tracking-widest">
            Secure Cyber Checkout
          </span>
          <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-wider">
            {product.name}
          </h2>
          <p className="font-rajdhani text-sm text-[#8E8EA8]">
            {product.description}
          </p>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-orbitron text-xs uppercase text-[#8E8EA8]">
              Execution Input Prompt / Query
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              required
              className="w-full bg-black/60 border border-white/20 rounded-lg p-3 text-white font-rajdhani text-sm focus:border-[#00CFFF] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
            <div>
              <div className="font-orbitron text-xs text-[#8E8EA8]">Quantity</div>
              <div className="font-rajdhani text-sm text-white font-semibold">
                {quantity} pack(s) ({unitTotal} total {product.unitLabel} units)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded border border-white/20 flex items-center justify-center font-orbitron hover:bg-white/10"
              >
                -
              </button>
              <span className="font-orbitron font-bold w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded border border-white/20 flex items-center justify-center font-orbitron hover:bg-white/10"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-[#00CFFF]/5 border border-[#00CFFF]/20">
            <div className="flex justify-between items-center text-sm font-rajdhani">
              <span className="text-[#8E8EA8]">Unit Price:</span>
              <span className="text-white font-semibold">{product.formattedPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-rajdhani">
              <span className="text-[#8E8EA8]">Payment Provider:</span>
              <span className="text-[#00CFFF] font-semibold flex items-center gap-1">
                <CreditCard className="w-4 h-4" /> Stripe Direct Secure
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-orbitron border-t border-white/10 pt-3">
              <span className="text-white font-bold">Total Amount Due:</span>
              <span className="text-[#FFD700] font-bold">{formattedTotalPrice}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#FF0033]/20 border border-[#FF0033] text-[#FF0033] font-rajdhani text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <NeonButton
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span>PROCESSING SECURE PAYMENT...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Pay {formattedTotalPrice} with Stripe
                </span>
              )}
            </NeonButton>

            <div className="flex items-center justify-center gap-2 text-xs font-rajdhani text-[#8E8EA8]">
              <ShieldCheck className="w-4 h-4 text-[#00CFFF]" /> Encrypted 256-bit SSL Payment Gateway
            </div>
          </div>
        </form>
      </GlowCard>
    </div>
  );
};
