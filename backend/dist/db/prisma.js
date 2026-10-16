"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
class MockPrisma {
    modelProviders = [
        {
            id: 'p-1',
            name: 'HuggingFace Free Inference API',
            type: client_1.ProviderType.IMAGE,
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
            type: client_1.ProviderType.LLM,
            apiBaseUrl: 'http://localhost:11434/api/generate',
            apiKey: null,
            metadata: { baseCostPerUnit: 0, tier: 'standard' },
            createdAt: new Date(),
            updatedAt: new Date(),
            metrics: [{ id: 'm-2', avgLatencyMs: 180, successRate: 0.99, qualityScore: 4.9 }]
        }
    ];
    suppliers = [
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
    products = [
        {
            id: 'prod-1',
            supplierId: 's-1',
            supplier: { id: 's-1', baseCostPerUnit: 0, name: 'HuggingFace Free' },
            name: 'Single Image',
            description: 'Generate 1 ultra-HD artificial intelligence image.',
            markupType: client_1.MarkupType.FIXED,
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
            markupType: client_1.MarkupType.FIXED,
            markupValue: 30,
            unitLabel: 'request',
            unitsPerPurchase: 1,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    transactions = [];
    payouts = [];
    metrics = [];
    modelProvider = {
        findMany: async (args) => this.modelProviders,
        findUnique: async (args) => this.modelProviders.find(p => p.id === args?.where?.id),
        create: async (args) => {
            const newP = { id: 'p-' + Date.now(), ...args.data, createdAt: new Date(), updatedAt: new Date(), metrics: [] };
            this.modelProviders.push(newP);
            return newP;
        },
        delete: async (args) => {
            this.modelProviders = this.modelProviders.filter(p => p.id !== args.where.id);
            return { success: true };
        }
    };
    supplier = {
        findMany: async (args) => this.suppliers,
        findFirst: async (args) => this.suppliers.find(s => s.name === args?.where?.name),
        create: async (args) => {
            const newS = { id: 's-' + Date.now(), ...args.data, createdAt: new Date(), updatedAt: new Date() };
            this.suppliers.push(newS);
            return newS;
        },
        update: async (args) => args.data
    };
    product = {
        findMany: async (args) => this.products,
        findUnique: async (args) => this.products.find(p => p.id === args?.where?.id),
        findFirst: async (args) => this.products.find(p => p.name === args?.where?.name),
        create: async (args) => {
            const newProd = { id: 'prod-' + Date.now(), ...args.data, createdAt: new Date(), updatedAt: new Date() };
            this.products.push(newProd);
            return newProd;
        },
        update: async (args) => args.data
    };
    transaction = {
        create: async (args) => {
            const tx = { id: 'tx-' + Date.now(), ...args.data, createdAt: new Date() };
            this.transactions.push(tx);
            return tx;
        }
    };
    payout = {
        create: async (args) => {
            const po = { id: 'po-' + Date.now(), ...args.data, createdAt: new Date() };
            this.payouts.push(po);
            return po;
        }
    };
    providerMetric = {
        findFirst: async (args) => this.metrics.find(m => m.providerId === args?.where?.providerId),
        create: async (args) => {
            const m = { id: 'm-' + Date.now(), ...args.data, updatedAt: new Date() };
            this.metrics.push(m);
            return m;
        },
        update: async (args) => args.data
    };
    $disconnect = async () => { };
}
let prismaInstance;
try {
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
        prismaInstance = new client_1.PrismaClient();
    }
    else {
        prismaInstance = new MockPrisma();
    }
}
catch {
    prismaInstance = new MockPrisma();
}
exports.prisma = prismaInstance;
exports.default = exports.prisma;
