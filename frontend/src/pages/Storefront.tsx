import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';
import { HologramAvatar } from '../components/HologramAvatar';
import { LightningHover } from '../components/LightningHover';
import { Sparkles, ShoppingCart, Zap, ArrowRight, Eye } from 'lucide-react';

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

interface StorefrontProps {
  onSelectProduct: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  onSelectProduct,
  onViewProductDetails
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'IMAGE' | 'REQUEST' | 'AUDIO'>('ALL');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/storefront');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch storefront products:', err);
      setProducts([
        { id: 'p1', name: 'Single Image', description: 'Generate 1 ultra-HD artificial intelligence image.', unitLabel: 'image', unitsPerPurchase: 1, pricePenceTotal: 30, formattedPrice: '£0.30', currency: 'GBP' },
        { id: 'p2', name: 'Image Pack (5)', description: 'Generate 5 high quality AI images bundle.', unitLabel: 'image', unitsPerPurchase: 5, pricePenceTotal: 150, formattedPrice: '£1.50', currency: 'GBP' },
        { id: 'p3', name: 'Short Response', description: 'Generate high speed quick text response.', unitLabel: 'request', unitsPerPurchase: 1, pricePenceTotal: 30, formattedPrice: '£0.30', currency: 'GBP' },
        { id: 'p4', name: 'Batch Requests (10)', description: 'Run 10 batch AI prompt requests.', unitLabel: 'request', unitsPerPurchase: 10, pricePenceTotal: 300, formattedPrice: '£3.00', currency: 'GBP' },
        { id: 'p5', name: 'Neural Audio Synthesis', description: 'Convert text into natural neural voice audio.', unitLabel: 'audio', unitsPerPurchase: 1, pricePenceTotal: 35, formattedPrice: '£0.35', currency: 'GBP' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'IMAGE') return p.unitLabel === 'image';
    if (filter === 'REQUEST') return p.unitLabel === 'request';
    if (filter === 'AUDIO') return p.unitLabel === 'audio';
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#9B00FF]/30 bg-gradient-to-r from-[#0A0A10] via-[#120D22] to-[#0A0A10]">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B00FF]/20 border border-[#9B00FF]/50 text-[#00CFFF] text-xs font-orbitron tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" /> CYBER-AI PLATFORM ONLINE
          </div>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-extrabold uppercase text-white tracking-wider leading-tight">
            Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B00FF] via-[#00CFFF] to-[#FFD700]">Next-Gen</span> AI Intelligence
          </h1>
          <p className="font-rajdhani text-lg text-[#8E8EA8]">
            Instant access to high-yield synthetic intelligence, neural art generation, and automated workflows. High performance, zero latency limits.
          </p>
        </div>
      </div>

      <HologramAvatar message="All white-label neural nodes active and operating at peak capacity." />

      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
        {(['ALL', 'IMAGE', 'REQUEST', 'AUDIO'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-orbitron text-xs tracking-widest transition-all duration-300 ${
              filter === tab
                ? 'bg-[#9B00FF] text-white shadow-[0_0_15px_rgba(155,0,255,0.8)]'
                : 'bg-[#0A0A10] text-[#8E8EA8] hover:text-white border border-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 font-orbitron text-[#00CFFF] animate-pulse">
          SYNCHRONIZING NEURAL PRODUCTS...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <LightningHover key={product.id}>
              <GlowCard variant="purple" className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#00CFFF]/10 border border-[#00CFFF]/40 text-[#00CFFF] text-[10px] font-orbitron uppercase tracking-widest">
                      {product.unitLabel} • {product.unitsPerPurchase} Unit(s)
                    </span>
                    <span className="text-xl font-orbitron font-bold text-[#FFD700] tracking-wider">
                      {product.formattedPrice}
                    </span>
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-white tracking-wide">
                    {product.name}
                  </h3>
                  <p className="font-rajdhani text-sm text-[#8E8EA8] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <NeonButton
                    variant="purple"
                    size="sm"
                    className="flex-1"
                    onClick={() => onSelectProduct(product)}
                  >
                    <ShoppingCart className="w-4 h-4" /> Instant Buy
                  </NeonButton>
                  <NeonButton
                    variant="blue"
                    size="sm"
                    onClick={() => onViewProductDetails(product)}
                  >
                    <Eye className="w-4 h-4" /> Run
                  </NeonButton>
                </div>
              </GlowCard>
            </LightningHover>
          ))}
        </div>
      )}
    </div>
  );
};
