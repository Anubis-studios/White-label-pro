"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../db/prisma"));
const autoCreationService_1 = require("../services/autoCreationService");
const router = (0, express_1.Router)();
// GET /registry - List all internal model providers
router.get('/', async (req, res) => {
    try {
        const providers = await prisma_1.default.modelProvider.findMany({
            include: { metrics: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(providers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /registry - Create or seed a model provider
router.post('/', async (req, res) => {
    try {
        const { name, type, apiBaseUrl, apiKey, metadata } = req.body;
        const provider = await prisma_1.default.modelProvider.create({
            data: {
                name,
                type: type,
                apiBaseUrl,
                apiKey,
                metadata: metadata ? metadata : {}
            }
        });
        // Auto update metrics default
        await prisma_1.default.providerMetric.create({
            data: {
                providerId: provider.id,
                avgLatencyMs: 250,
                successRate: 0.99,
                qualityScore: 4.8
            }
        });
        // Trigger auto creation sync
        await (0, autoCreationService_1.syncSuppliersAndProducts)();
        res.json(provider);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE /registry/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma_1.default.modelProvider.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
