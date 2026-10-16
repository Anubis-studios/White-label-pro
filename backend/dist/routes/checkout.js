"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = __importDefault(require("../db/prisma"));
const pricingAndRoutingService_1 = require("../services/pricingAndRoutingService");
const client_1 = require("@prisma/client");
const secrecy_1 = require("../utils/secrecy");
const router = (0, express_1.Router)();
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
const stripe = new stripe_1.default(stripeKey, { apiVersion: '2024-09-30.acacia' });
// POST /checkout
router.post('/', async (req, res) => {
    try {
        const { productId, userId, quantity = 1, payload, paymentIntentId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }
        const product = await prisma_1.default.product.findUnique({
            where: { id: productId },
            include: { supplier: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const totalUnits = quantity * product.unitsPerPurchase;
        const baseCostPence = (0, pricingAndRoutingService_1.computeProviderCost)(product.supplier ? product.supplier.baseCostPerUnit : 0);
        const platformProfitPencePerUnit = product.markupType === 'FIXED' ? product.markupValue : (0, pricingAndRoutingService_1.computePlatformProfit)(baseCostPence);
        const customerPricePerUnitPence = baseCostPence + platformProfitPencePerUnit;
        const totalPricePence = customerPricePerUnitPence * totalUnits;
        const supplierSharePence = baseCostPence * totalUnits;
        const platformProfitPence = totalPricePence - supplierSharePence;
        if (!paymentIntentId) {
            let clientSecret = 'mock_client_secret_xyz123';
            let intentId = 'pi_mock_' + Date.now();
            if (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_real_')) {
                try {
                    const intent = await stripe.paymentIntents.create({
                        amount: totalPricePence,
                        currency: 'gbp',
                        metadata: { productId, userId: userId || 'anonymous', totalUnits: totalUnits.toString() }
                    });
                    clientSecret = intent.client_secret || clientSecret;
                    intentId = intent.id;
                }
                catch (err) {
                    console.warn('[Stripe] Failed real PaymentIntent create, using seamless mock payment mode');
                }
            }
            return res.json({
                paymentIntentId: intentId,
                clientSecret,
                totalPricePence,
                formattedTotal: `£${(totalPricePence / 100).toFixed(2)}`,
                units: totalUnits,
                currency: 'GBP'
            });
        }
        let transactionStatus = client_1.TransactionStatus.COMPLETED;
        const transaction = await prisma_1.default.transaction.create({
            data: {
                productId: product.id,
                userId: userId || 'anonymous_user',
                units: totalUnits,
                totalPricePence,
                supplierSharePence,
                platformProfitPence,
                currency: 'GBP',
                status: transactionStatus,
                paymentProviderId: paymentIntentId
            }
        });
        const payout = await prisma_1.default.payout.create({
            data: {
                transactionId: transaction.id,
                supplierId: product.supplierId,
                amountPence: supplierSharePence,
                currency: 'GBP',
                payoutProviderId: 'INTERNAL_ACCOUNTING',
                status: client_1.PayoutStatus.COMPLETED
            }
        });
        let providerType = client_1.ProviderType.LLM;
        if (product.unitLabel === 'image')
            providerType = client_1.ProviderType.IMAGE;
        if (product.unitLabel === 'audio')
            providerType = client_1.ProviderType.TTS;
        if (product.unitLabel === 'embedding')
            providerType = client_1.ProviderType.EMBEDDING;
        const providerExecution = await (0, pricingAndRoutingService_1.executeProviderCallWithFallback)(providerType, payload || { prompt: 'Default AI query' });
        const responsePayload = {
            success: true,
            transactionId: transaction.id,
            payoutId: payout.id,
            unitsPurchased: totalUnits,
            productName: product.name,
            result: providerExecution.result
        };
        res.json((0, secrecy_1.sanitizeCustomerOutput)(responsePayload));
    }
    catch (error) {
        console.error('[Checkout Error]', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
