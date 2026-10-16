import { PrismaClient } from '@prisma/client';
import { freeProviders } from '../src/registry/freeProviders';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Populating free model providers...');

  for (const p of freeProviders) {
    const created = await prisma.modelProvider.create({
      data: p
    });

    await prisma.providerMetric.create({
      data: {
        providerId: created.id,
        avgLatencyMs: Math.floor(Math.random() * 200) + 150,
        successRate: 0.99,
        qualityScore: 4.8
      }
    });
  }

  console.log('[Seed] Free model providers successfully seeded.');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
