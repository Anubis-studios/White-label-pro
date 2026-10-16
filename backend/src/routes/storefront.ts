import { Router } from 'express';
import prisma from '../db/prisma';
import { computeProviderCost, computePlatformProfit } from '../services/pricingAndRoutingService';
import { sanitizeCustomerOutput } from '../utils/secrecy';

const router = Router();

// GET /storefront - Public active products listing (STRICT SECRECY: ZERO supplier or cost info)
router.get('/', async (req, res) => {
  try {
    const activeProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        supplier: true
      }
    });

    // Calculate customer visible price per unit
    const customerProducts = activeProducts.map((p: any) => {
      const baseCost = computeProviderCost(p.supplier ? p.supplier.baseCostPerUnit : 0);
      const profit = p.markupType === 'FIXED' ? p.markupValue : computePlatformProfit(baseCost);
      const pricePerUnitPence = baseCost + profit;
      const pricePenceTotal = pricePerUnitPence * p.unitsPerPurchase;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        unitLabel: p.unitLabel,
        unitsPerPurchase: p.unitsPerPurchase,
        pricePenceTotal,
        currency: 'GBP',
        formattedPrice: `£${(pricePenceTotal / 100).toFixed(2)}`
      };
    });

    // Enforce secrecy filtering
    const sanitized = sanitizeCustomerOutput(customerProducts);
    res.json(sanitized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
