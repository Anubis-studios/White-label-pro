import prisma from '../db/prisma';
import { ProviderType, MarkupType } from '@prisma/client';
import { computeProviderCost, computePlatformProfit } from './pricingAndRoutingService';
import { freeProviders } from '../registry/freeProviders';

export async function syncSuppliersAndProducts() {
  let providers = await prisma.modelProvider.findMany();

  if (providers.length === 0) {
    for (const p of freeProviders) {
      await prisma.modelProvider.create({
        data: p
      });
    }
    providers = await prisma.modelProvider.findMany();
  }

  for (const provider of providers) {
    const cheapestCost = computeProviderCost(provider.metadata);
    const platformProfit = computePlatformProfit(cheapestCost);

    let supplier = await prisma.supplier.findFirst({
      where: { name: provider.name }
    });

    if (!supplier) {
      supplier = await prisma.supplier.create({
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
    } else {
      supplier = await prisma.supplier.update({
        where: { id: supplier.id },
        data: {
          baseCostPerUnit: cheapestCost,
          apiBaseUrl: provider.apiBaseUrl,
          apiKey: provider.apiKey
        }
      });
    }

    if (provider.type === ProviderType.IMAGE) {
      await ensureProduct(supplier.id, `${provider.name} - Single Asset`, `Generate 1 asset using AI engine`, 'image', 1, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - Asset Pack (5)`, `Generate 5 asset pack using AI engine`, 'image', 5, platformProfit);
    } else if (provider.type === ProviderType.LLM) {
      await ensureProduct(supplier.id, `${provider.name} - Prompt Response`, `Generate high speed response using AI engine`, 'request', 1, platformProfit);
    } else if (provider.type === ProviderType.TTS) {
      await ensureProduct(supplier.id, `${provider.name} - Audio Generation`, `Synthesize audio track using AI engine`, 'audio', 1, platformProfit);
    }
  }
}

async function ensureProduct(
  supplierId: string,
  name: string,
  description: string,
  unitLabel: string,
  unitsPerPurchase: number,
  platformProfit: number
) {
  const existing = await prisma.product.findFirst({
    where: { supplierId, name }
  });

  if (!existing) {
    await prisma.product.create({
      data: {
        supplierId,
        name,
        description,
        markupType: MarkupType.FIXED,
        markupValue: platformProfit,
        unitLabel,
        unitsPerPurchase,
        isActive: true
      }
    });
  } else {
    await prisma.product.update({
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
