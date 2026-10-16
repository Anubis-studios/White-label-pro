import { Router } from 'express';
import prisma from '../db/prisma';
import { MarkupType } from '@prisma/client';

const router = Router();

// GET /products - List all products for admin
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { supplier: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /products - Admin create product
router.post('/', async (req, res) => {
  try {
    const { supplierId, name, description, markupType, markupValue, unitLabel, unitsPerPurchase } = req.body;
    const product = await prisma.product.create({
      data: {
        supplierId,
        name,
        description,
        markupType: markupType as MarkupType || MarkupType.FIXED,
        markupValue: markupValue || 25,
        unitLabel: unitLabel || 'request',
        unitsPerPurchase: unitsPerPurchase || 1,
        isActive: true
      }
    });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /products/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
