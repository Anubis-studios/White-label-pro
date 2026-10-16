import prisma from '../db/prisma';
import { freeProviders } from '../registry/freeProviders';

export async function seedFreeProviders() {
  for (const providerData of freeProviders) {
    const existing = await prisma.modelProvider.findFirst({
      where: { name: providerData.name }
    });

    if (!existing) {
      await prisma.modelProvider.create({
        data: {
          name: providerData.name,
          type: providerData.type,
          apiBaseUrl: providerData.apiBaseUrl,
          apiKey: providerData.apiKey,
          metadata: providerData.metadata,
        }
      });
    } else {
      await prisma.modelProvider.update({
        where: { id: existing.id },
        data: {
          type: providerData.type,
          apiBaseUrl: providerData.apiBaseUrl,
          apiKey: providerData.apiKey,
          metadata: providerData.metadata,
        }
      });
    }
  }
}
