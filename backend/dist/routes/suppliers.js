"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../db/prisma"));
const router = (0, express_1.Router)();
// GET /suppliers - Manage internal suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await prisma_1.default.supplier.findMany({
            include: { products: true, payouts: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /suppliers
router.post('/', async (req, res) => {
    try {
        const { name, baseCostPerUnit, currency, apiBaseUrl, apiKey, payoutAccountId, isFreeProvider } = req.body;
        const supplier = await prisma_1.default.supplier.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
