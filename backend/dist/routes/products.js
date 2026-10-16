"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../db/prisma"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// GET /products - List all products for admin
router.get('/', async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            include: { supplier: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /products - Admin create product
router.post('/', async (req, res) => {
    try {
        const { supplierId, name, description, markupType, markupValue, unitLabel, unitsPerPurchase } = req.body;
        const product = await prisma_1.default.product.create({
            data: {
                supplierId,
                name,
                description,
                markupType: markupType || client_1.MarkupType.FIXED,
                markupValue: markupValue || 25,
                unitLabel: unitLabel || 'request',
                unitsPerPurchase: unitsPerPurchase || 1,
                isActive: true
            }
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /products/:id
router.patch('/:id', async (req, res) => {
    try {
        const updated = await prisma_1.default.product.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
