import React, { useState } from 'react';
import { Storefront } from './pages/Storefront';
import { Checkout } from './pages/Checkout';
import { ProductView } from './pages/ProductView';
import { AdminDashboard } from './pages/AdminDashboard';
import { ParticleBackground } from './components/ParticleBackground';
import { Shield, LayoutDashboard, Store } from 'lucide-react';

export function App() {
  const [view, setView] = useState<'STOREFRONT' | 'CHECKOUT' | 'RESULT' | 'ADMIN'>('STOREFRONT');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setView('CHECKOUT');
  };

  const handleViewProductDetails = (product: any) => {
    setSelectedProduct(product);
    setExecutionResult({
      transactionId: 'TX-PREVIEW-001',
      result: {
        imageUrl: product.unitLabel === 'image' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80' : undefined,
        text: product.unitLabel === 'request' ? `[NEON AI STREAM]: Processed request for ${product.name}.\n\nAutonomous reasoning engine initialized.\nKey findings:\n- High efficiency throughput achieved\n- Dynamic margin verified` : undefined,
        audioUrl: product.unitLabel === 'audio' ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : undefined,
        prompt: `Demo run for ${product.name}`
      }
    });
    setView('RESULT');
  };

  const handleCheckoutSuccess = (resultData: any) => {
    setExecutionResult(resultData);
    setView('RESULT');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-rajdhani relative selection:bg-[#9B00FF] selection:text-white">
      <ParticleBackground />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020202]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => setView('STOREFRONT')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9B00FF] to-[#00CFFF] p-0.5 shadow-[0_0_20px_rgba(155,0,255,0.6)] group-hover:shadow-[0_0_30px_rgba(0,207,255,0.8)] transition-all">
              <div className="w-full h-full bg-[#020202] rounded-[10px] flex items-center justify-center font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-[#9B00FF] to-[#00CFFF]">
                AI
              </div>
            </div>
            <div>
              <span className="font-orbitron font-extrabold text-xl tracking-wider text-white">
                CYBER<span className="text-[#00CFFF]">.AI</span>
              </span>
              <span className="block text-[10px] font-orbitron tracking-widest text-[#8E8EA8]">
                WHITE-LABEL ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('STOREFRONT')}
              className={`px-4 py-2 rounded-xl font-orbitron text-xs tracking-widest flex items-center gap-2 transition-all ${
                view === 'STOREFRONT' || view === 'CHECKOUT' || view === 'RESULT'
                  ? 'bg-[#9B00FF]/20 border border-[#9B00FF] text-white shadow-[0_0_15px_rgba(155,0,255,0.4)]'
                  : 'text-[#8E8EA8] hover:text-white'
              }`}
            >
              <Store className="w-4 h-4 text-[#00CFFF]" /> Storefront
            </button>

            <button
              onClick={() => setView('ADMIN')}
              className={`px-4 py-2 rounded-xl font-orbitron text-xs tracking-widest flex items-center gap-2 transition-all ${
                view === 'ADMIN'
                  ? 'bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-[#8E8EA8] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Admin Controls
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {view === 'STOREFRONT' && (
          <Storefront
            onSelectProduct={handleSelectProduct}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {view === 'CHECKOUT' && selectedProduct && (
          <Checkout
            product={selectedProduct}
            onSuccess={handleCheckoutSuccess}
            onCancel={() => setView('STOREFRONT')}
          />
        )}

        {view === 'RESULT' && (
          <ProductView
            product={selectedProduct}
            executionResult={executionResult}
            onBack={() => setView('STOREFRONT')}
          />
        )}

        {view === 'ADMIN' && <AdminDashboard />}
      </main>

      <footer className="border-t border-white/10 py-8 relative z-10 text-center text-xs font-orbitron text-[#8E8EA8]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00CFFF]" /> Protected by Cyber White-Label Secrecy Engine
          </div>
          <div>© {new Date().getFullYear()} CYBER-AI PLATFORM. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
