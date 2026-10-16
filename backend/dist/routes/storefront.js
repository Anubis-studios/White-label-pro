"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../db/prisma"));
const pricingAndRoutingService_1 = require("../services/pricingAndRoutingService");
const secrecy_1 = require("../utils/secrecy");
const router = (0, express_1.Router)();
// GET /storefront - Public active products listing (STRICT SECRECY: ZERO supplier or cost info)
router.get('/', async (req, res) => {
    try {
        const activeProducts = await prisma_1.default.product.findMany({
            where: { isActive: true },
            include: {
                supplier: true
            }
        });
        // Calculate customer visible price per unit
        const customerProducts = activeProducts.map((p) => {
            const baseCost = (0, pricingAndRoutingService_1.computeProviderCost)(p.supplier ? p.supplier.baseCostPerUnit : 0);
            const profit = p.markupType === 'FIXED' ? p.markupValue : (0, pricingAndRoutingService_1.computePlatformProfit)(baseCost);
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
        const sanitized = (0, secrecy_1.sanitizeCustomerOutput)(customerProducts);
        res.json(sanitized);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
