import { Router } from 'express';
import prisma from '../db/prisma';

const router = Router();

// GET /suppliers - Manage internal suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { products: true, payouts: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /suppliers
router.post('/', async (req, res) => {
  try {
    const { name, baseCostPerUnit, currency, apiBaseUrl, apiKey, payoutAccountId, isFreeProvider } = req.body;
    const supplier = await prisma.supplier.create({
      data: {
        name,
        baseCostPerUnit: baseCostPerUnit ?? 0,
        currency: currency || 'GBP',
        apiBaseUrl,
        apiKey,
        payoutAccountId: payoutAccountId || 'FREE_PROVIDER',
        isFreeProvider: isFreeProvider ?? false
      }
    });
    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
