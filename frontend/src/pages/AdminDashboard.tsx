import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';
import { Server, Database, ShoppingBag, Activity, Plus, RefreshCw, Layers } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REGISTRY' | 'SUPPLIERS' | 'PRODUCTS' | 'BUNDLES'>('REGISTRY');
  const [registry, setRegistry] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderType, setNewProviderType] = useState('LLM');
  const [newApiUrl, setNewApiUrl] = useState('');

  const [bundlePrompt, setBundlePrompt] = useState('Build complete AI strategy with visual concept');
  const [bundleResult, setBundleResult] = useState<any>(null);
  const [bundleExecuting, setBundleExecuting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [regRes, supRes, prodRes] = await Promise.all([
        axios.get('/api/registry').catch(() => ({ data: [] })),
        axios.get('/api/suppliers').catch(() => ({ data: [] })),
        axios.get('/api/products').catch(() => ({ data: [] }))
      ]);
      setRegistry(regRes.data);
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProviderName || !newApiUrl) return;

    try {
      await axios.post('/api/registry', {
        name: newProviderName,
        type: newProviderType,
        apiBaseUrl: newApiUrl,
        metadata: { baseCostPerUnit: 0, tier: 'standard' }
      });
      setNewProviderName('');
      setNewApiUrl('');
      fetchAdminData();
    } catch (err) {
      console.error('Error adding provider:', err);
    }
  };

  const handleExecuteBundle = async () => {
    setBundleExecuting(true);
    setBundleResult(null);
    try {
      const response = await axios.post('/api/bundles', {
        steps: [
          { stepId: 's1', type: 'SKILL', prompt: bundlePrompt },
          { stepId: 's2', type: 'IMAGE', prompt: `Visual representation: ${bundlePrompt}` }
        ]
      });
      setBundleResult(response.data);
    } catch (err) {
      console.error('Bundle error:', err);
    } finally {
      setBundleExecuting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-orbitron text-[#FFD700] uppercase tracking-widest flex items-center gap-1">
            <Activity className="w-4 h-4 text-[#00CFFF]" /> System Control Center
          </span>
          <h1 className="text-3xl font-orbitron font-extrabold text-white uppercase tracking-wider">
            Admin Governance Dashboard
          </h1>
        </div>
        <NeonButton variant="blue" size="sm" onClick={fetchAdminData}>
          <RefreshCw className="w-4 h-4" /> Refresh Telemetry
        </NeonButton>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { id: 'REGISTRY', label: 'Model Registry', icon: <Server className="w-4 h-4" /> },
          { id: 'SUPPLIERS', label: 'Internal Suppliers', icon: <Database className="w-4 h-4" /> },
          { id: 'PRODUCTS', label: 'Products & Markup', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'BUNDLES', label: 'Multi-Step Bundles', icon: <Layers className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl font-orbitron text-xs tracking-widest flex items-center gap-2 transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-[#00CFFF] text-black font-bold shadow-[0_0_20px_rgba(0,207,255,0.8)]'
                : 'bg-[#0A0A10] text-[#8E8EA8] hover:text-white border border-white/10'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center font-orbitron text-[#00CFFF] animate-pulse">
          FETCHING SYSTEM STATE...
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'REGISTRY' && (
            <div className="space-y-6">
              <GlowCard variant="blue">
                <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00CFFF]" /> Register New Model Provider
                </h3>
                <form onSubmit={handleAddProvider} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Provider Name"
                    value={newProviderName}
                    onChange={(e) => setNewProviderName(e.target.value)}
                    required
                    className="bg-black/60 border border-white/20 rounded-lg p-2.5 text-white font-rajdhani text-sm focus:border-[#00CFFF] focus:outline-none"
                  />
                  <select
                    value={newProviderType}
                    onChange={(e) => setNewProviderType(e.target.value)}
                    className="bg-black/60 border border-white/20 rounded-lg p-2.5 text-white font-rajdhani text-sm focus:border-[#00CFFF] focus:outline-none"
                  >
                    <option value="LLM">LLM</option>
                    <option value="IMAGE">IMAGE</option>
                    <option value="TTS">TTS</option>
                    <option value="STT">STT</option>
                    <option value="EMBEDDING">EMBEDDING</option>
                  </select>
                  <input
                    type="text"
                    placeholder="API Base URL"
                    value={newApiUrl}
                    onChange={(e) => setNewApiUrl(e.target.value)}
                    required
                    className="bg-black/60 border border-white/20 rounded-lg p-2.5 text-white font-rajdhani text-sm focus:border-[#00CFFF] focus:outline-none"
                  />
                  <NeonButton variant="blue" type="submit">Register Provider</NeonButton>
                </form>
              </GlowCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registry.map((p) => (
                  <GlowCard key={p.id} variant="purple">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-[#9B00FF]/20 border border-[#9B00FF] text-[10px] font-orbitron text-[#00CFFF]">
                          {p.type}
                        </span>
                        <h4 className="text-lg font-orbitron font-bold text-white mt-1">{p.name}</h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="text-xs font-mono text-[#8E8EA8] truncate mb-3">{p.apiBaseUrl}</div>
                    {p.metrics && p.metrics[0] && (
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center text-xs font-rajdhani">
                        <div>
                          <div className="text-[#8E8EA8]">Latency</div>
                          <div className="text-white font-bold">{p.metrics[0].avgLatencyMs} ms</div>
                        </div>
                        <div>
                          <div className="text-[#8E8EA8]">Success</div>
                          <div className="text-[#00CFFF] font-bold">{(p.metrics[0].successRate * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-[#8E8EA8]">Quality</div>
                          <div className="text-[#FFD700] font-bold">{p.metrics[0].qualityScore}/5</div>
                        </div>
                      </div>
                    )}
                  </GlowCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'SUPPLIERS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suppliers.map((s) => (
                <GlowCard key={s.id} variant="gold">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-orbitron font-bold text-white">{s.name}</h4>
                      <div className="text-xs font-rajdhani text-[#8E8EA8]">Payout ID: {s.payoutAccountId}</div>
                    </div>
                    <span className="text-sm font-orbitron text-[#FFD700]">Cost: {s.baseCostPerUnit}p / unit</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#8E8EA8] flex justify-between">
                    <span>Products Linked: {s.products?.length || 0}</span>
                    <span>Free Provider: {s.isFreeProvider ? 'YES' : 'NO'}</span>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}

          {activeTab === 'PRODUCTS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <GlowCard key={prod.id} variant="purple">
                  <span className="text-[10px] font-orbitron uppercase text-[#00CFFF]">{prod.unitLabel}</span>
                  <h4 className="text-lg font-orbitron font-bold text-white">{prod.name}</h4>
                  <p className="text-xs font-rajdhani text-[#8E8EA8] my-2">{prod.description}</p>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-[#8E8EA8]">Markup Fixed:</span>
                    <span className="font-orbitron font-bold text-[#FFD700]">+{prod.markupValue}p profit</span>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}

          {activeTab === 'BUNDLES' && (
            <GlowCard variant="blue" className="space-y-6">
              <div>
                <h3 className="text-lg font-orbitron font-bold text-white uppercase">
                  Multi-Step Agent Workflow Runner
                </h3>
                <p className="font-rajdhani text-sm text-[#8E8EA8]">
                  Orchestrate skill bundles across multiple agents and generative steps in parallel.
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={bundlePrompt}
                  onChange={(e) => setBundlePrompt(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-lg p-3 text-white font-rajdhani text-sm focus:border-[#00CFFF] focus:outline-none"
                />
                <NeonButton variant="purple" onClick={handleExecuteBundle} disabled={bundleExecuting}>
                  {bundleExecuting ? 'EXECUTING BUNDLE WORKFLOW...' : 'RUN MULTI-STEP BUNDLE'}
                </NeonButton>
              </div>

              {bundleResult && (
                <pre className="p-4 rounded-xl bg-black/90 text-xs font-mono text-emerald-400 overflow-x-auto border border-[#00CFFF]/30">
                  {JSON.stringify(bundleResult, null, 2)}
                </pre>
              )}
            </GlowCard>
          )}
        </div>
      )}
    </div>
  );
};
