import prisma from '../db/prisma';
import { ProviderType, MarkupType } from '@prisma/client';
import { computeProviderCost, computePlatformProfit } from './pricingAndRoutingService';
import { seedFreeProviders } from './seedProvidersService';

export async function syncSuppliersAndProducts() {
  await seedFreeProviders();
  const providers = await prisma.modelProvider.findMany();

  for (const provider of providers) {
    const meta = (provider.metadata as Record<string, any>) || {};
    const category = meta.category || '';
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

    if (category === 'video_generation' || provider.name === 'RunwayML' || provider.name === 'Luma AI') {
      await ensureProduct(supplier.id, `${provider.name} - Short Trailer`, `Generate cinematic short AI trailer`, 'video', 1, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - Promo Clip`, `Generate promotional short AI video clip`, 'video', 1, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - Cutscene`, `Generate high quality game cutscene`, 'video', 1, platformProfit);
    } else if (category === 'music' || category === 'voice' || provider.name === 'AIVA' || provider.name === 'ElevenLabs') {
      await ensureProduct(supplier.id, `${provider.name} - Voice Line`, `Synthesize custom NPC dialogue voice line`, 'audio', 1, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - Audio Pack (5)`, `Generate 5 audio dialogue or SFX tracks`, 'audio', 5, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - Theme Track`, `Compose soundtrack or ambient theme music`, 'audio', 1, platformProfit);
    } else {
      await ensureProduct(supplier.id, `${provider.name} - Single Asset`, `Generate 1 2D/3D asset using AI engine`, 'image', 1, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - Asset Pack (5)`, `Generate 5 2D/3D asset pack using AI engine`, 'image', 5, platformProfit);
      await ensureProduct(supplier.id, `${provider.name} - HD / Cinematic`, `Generate HD render asset using AI engine`, 'image', 1, platformProfit);
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
