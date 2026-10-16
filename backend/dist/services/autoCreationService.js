"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSuppliersAndProducts = syncSuppliersAndProducts;
const prisma_1 = __importDefault(require("../db/prisma"));
const client_1 = require("@prisma/client");
const pricingAndRoutingService_1 = require("./pricingAndRoutingService");
const freeProviders_1 = require("../registry/freeProviders");
async function syncSuppliersAndProducts() {
    let providers = await prisma_1.default.modelProvider.findMany();
    if (providers.length === 0) {
        for (const p of freeProviders_1.freeProviders) {
            await prisma_1.default.modelProvider.create({
                data: p
            });
        }
        providers = await prisma_1.default.modelProvider.findMany();
    }
    for (const provider of providers) {
        const cheapestCost = (0, pricingAndRoutingService_1.computeProviderCost)(provider.metadata);
        const platformProfit = (0, pricingAndRoutingService_1.computePlatformProfit)(cheapestCost);
        let supplier = await prisma_1.default.supplier.findFirst({
            where: { name: provider.name }
        });
        if (!supplier) {
            supplier = await prisma_1.default.supplier.create({
                data: {
                    name: provider.name,
                    baseCostPerUnit: cheapestCost,
                    currency: 'GBP',
                    apiBaseUrl: provider.apiBaseUrl,
                    apiKey: provider.apiKey,
                    payoutAccountId: 'FREE_PROVIDER',
                    isFreeProvider: true
                }
            });
        }
        else {
            supplier = await prisma_1.default.supplier.update({
                where: { id: supplier.id },
                data: {
                    baseCostPerUnit: cheapestCost,
                    apiBaseUrl: provider.apiBaseUrl,
                    apiKey: provider.apiKey
                }
            });
        }
        if (provider.type === client_1.ProviderType.IMAGE) {
            await ensureProduct(supplier.id, `${provider.name} - Single Asset`, `Generate 1 asset using AI engine`, 'image', 1, platformProfit);
            await ensureProduct(supplier.id, `${provider.name} - Asset Pack (5)`, `Generate 5 asset pack using AI engine`, 'image', 5, platformProfit);
        }
        else if (provider.type === client_1.ProviderType.LLM) {
            await ensureProduct(supplier.id, `${provider.name} - Prompt Response`, `Generate high speed response using AI engine`, 'request', 1, platformProfit);
        }
        else if (provider.type === client_1.ProviderType.TTS) {
            await ensureProduct(supplier.id, `${provider.name} - Audio Generation`, `Synthesize audio track using AI engine`, 'audio', 1, platformProfit);
        }
    }
}
async function ensureProduct(supplierId, name, description, unitLabel, unitsPerPurchase, platformProfit) {
    const existing = await prisma_1.default.product.findFirst({
        where: { supplierId, name }
    });
    if (!existing) {
        await prisma_1.default.product.create({
            data: {
                supplierId,
                name,
                description,
                markupType: client_1.MarkupType.FIXED,
                markupValue: platformProfit,
                unitLabel,
                unitsPerPurchase,
                isActive: true
            }
        });
    }
    else {
        await prisma_1.default.product.update({
            where: { id: existing.id },
            data: {
                description,
                markupValue: platformProfit,
                unitLabel,
                unitsPerPurchase,
                isActive: true
            }
        });
    }
}
