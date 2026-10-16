import { PrismaClient, ProviderType, MarkupType, TransactionStatus, PayoutStatus } from '@prisma/client';

class MockPrisma {
  modelProviders: any[] = [
    {
      id: 'p-1',
      name: 'HuggingFace Free Inference API',
      type: ProviderType.IMAGE,
      apiBaseUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      apiKey: 'hf_mock',
      metadata: { baseCostPerUnit: 0, tier: 'standard' },
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: [{ id: 'm-1', avgLatencyMs: 220, successRate: 0.99, qualityScore: 4.8 }]
    },
    {
      id: 'p-2',
      name: 'Local Ollama Llama 3 Core',
      type: ProviderType.LLM,
      apiBaseUrl: 'http://localhost:11434/api/generate',
      apiKey: null,
      metadata: { baseCostPerUnit: 0, tier: 'standard' },
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: [{ id: 'm-2', avgLatencyMs: 180, successRate: 0.99, qualityScore: 4.9 }]
    }
  ];

  suppliers: any[] = [
    {
      id: 's-1',
      name: 'HuggingFace Free Inference API',
      baseCostPerUnit: 0,
      currency: 'GBP',
      apiBaseUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      apiKey: 'hf_mock',
      payoutAccountId: 'FREE_PROVIDER',
      isFreeProvider: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 's-2',
      name: 'Local Ollama Llama 3 Core',
      baseCostPerUnit: 0,
      currency: 'GBP',
      apiBaseUrl: 'http://localhost:11434/api/generate',
      apiKey: null,
      payoutAccountId: 'FREE_PROVIDER',
      isFreeProvider: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  products: any[] = [
    {
      id: 'prod-1',
      supplierId: 's-1',
      supplier: { id: 's-1', baseCostPerUnit: 0, name: 'HuggingFace Free' },
      name: 'Single Image',
      description: 'Generate 1 ultra-HD artificial intelligence image.',
      markupType: MarkupType.FIXED,
      markupValue: 30,
      unitLabel: 'image',
      unitsPerPurchase: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'prod-2',
      supplierId: 's-2',
      supplier: { id: 's-2', baseCostPerUnit: 0, name: 'Local Ollama' },
      name: 'Short Response',
      description: 'Generate high speed quick text response.',
      markupType: MarkupType.FIXED,
      markupValue: 30,
      unitLabel: 'request',
      unitsPerPurchase: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  transactions: any[] = [];
  payouts: any[] = [];
  metrics: any[] = [];

  modelProvider = {
    findMany: async (args?: any) => this.modelProviders,
    findUnique: async (args: any) => this.modelProviders.find(p => p.id === args?.where?.id),
    create: async (args: any) => {
      const newP = { id: 'p-' + Date.now(), ...args.data, createdAt: new Date(), updatedAt: new Date(), metrics: [] };
      this.modelProviders.push(newP);
      return newP;
    },
    delete: async (args: any) => {
      this.modelProviders = this.modelProviders.filter(p => p.id !== args.where.id);
      return { success: true };
    }
  };

  supplier = {
    findMany: async (args?: any) => this.suppliers,
    findFirst: async (args: any) => this.suppliers.find(s => s.name === args?.where?.name),
    create: async (args: any) => {
      const newS = { id: 's-' + Date.now(), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      this.suppliers.push(newS);
      return newS;
    },
    update: async (args: any) => args.data
  };

  product = {
    findMany: async (args?: any) => this.products,
    findUnique: async (args: any) => this.products.find(p => p.id === args?.where?.id),
    findFirst: async (args: any) => this.products.find(p => p.name === args?.where?.name),
    create: async (args: any) => {
      const newProd = { id: 'prod-' + Date.now(), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      this.products.push(newProd);
      return newProd;
    },
    update: async (args: any) => args.data
  };

  transaction = {
    create: async (args: any) => {
      const tx = { id: 'tx-' + Date.now(), ...args.data, createdAt: new Date() };
      this.transactions.push(tx);
      return tx;
    }
  };

  payout = {
    create: async (args: any) => {
      const po = { id: 'po-' + Date.now(), ...args.data, createdAt: new Date() };
      this.payouts.push(po);
      return po;
    }
  };

  providerMetric = {
    findFirst: async (args: any) => this.metrics.find(m => m.providerId === args?.where?.providerId),
    create: async (args: any) => {
      const m = { id: 'm-' + Date.now(), ...args.data, updatedAt: new Date() };
      this.metrics.push(m);
      return m;
    },
    update: async (args: any) => args.data
  };

  $disconnect = async () => {};
}

let prismaInstance: any;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
    prismaInstance = new PrismaClient();
  } else {
    prismaInstance = new MockPrisma();
  }
} catch {
  prismaInstance = new MockPrisma();
}

export const prisma = prismaInstance;
export default prisma;
