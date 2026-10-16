import { Router } from 'express';
import prisma from '../db/prisma';
import { ProviderType } from '@prisma/client';
import { syncSuppliersAndProducts } from '../services/autoCreationService';

const router = Router();

// GET /registry - List all internal model providers
router.get('/', async (req, res) => {
  try {
    const providers = await prisma.modelProvider.findMany({
      include: { metrics: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /registry - Create or seed a model provider
router.post('/', async (req, res) => {
  try {
    const { name, type, apiBaseUrl, apiKey, metadata } = req.body;
    const provider = await prisma.modelProvider.create({
      data: {
        name,
        type: type as ProviderType,
        apiBaseUrl,
        apiKey,
        metadata: metadata ? metadata : {}
      }
    });

    // Auto update metrics default
    await prisma.providerMetric.create({
      data: {
        providerId: provider.id,
        avgLatencyMs: 250,
        successRate: 0.99,
        qualityScore: 4.8
      }
    });

    // Trigger auto creation sync
    await syncSuppliersAndProducts();

    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /registry/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.modelProvider.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
