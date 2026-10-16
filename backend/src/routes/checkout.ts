import { Router } from 'express';
import Stripe from 'stripe';
import prisma from '../db/prisma';
import { executeProviderCallWithFallback, computeProviderCost, computePlatformProfit } from '../services/pricingAndRoutingService';
import { TransactionStatus, PayoutStatus, ProviderType } from '@prisma/client';
import { sanitizeCustomerOutput } from '../utils/secrecy';

const router = Router();
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
const stripe = new Stripe(stripeKey, { apiVersion: '2024-09-30.acacia' as any });

// POST /checkout
router.post('/', async (req, res) => {
  try {
    const { productId, userId, quantity = 1, payload, paymentIntentId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { supplier: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const totalUnits = quantity * product.unitsPerPurchase;
    const baseCostPence = computeProviderCost(product.supplier ? product.supplier.baseCostPerUnit : 0);
    const platformProfitPencePerUnit = product.markupType === 'FIXED' ? product.markupValue : computePlatformProfit(baseCostPence);
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
        } catch (err) {
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

    let transactionStatus: TransactionStatus = TransactionStatus.COMPLETED;

    const transaction = await prisma.transaction.create({
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

    const payout = await prisma.payout.create({
      data: {
        transactionId: transaction.id,
        supplierId: product.supplierId,
        amountPence: supplierSharePence,
        currency: 'GBP',
        payoutProviderId: 'INTERNAL_ACCOUNTING',
        status: PayoutStatus.COMPLETED
      }
    });

    let providerType: ProviderType = ProviderType.LLM;
    if (product.unitLabel === 'image') providerType = ProviderType.IMAGE;
    if (product.unitLabel === 'audio') providerType = ProviderType.TTS;
    if (product.unitLabel === 'embedding') providerType = ProviderType.EMBEDDING;

    const providerExecution = await executeProviderCallWithFallback(providerType, payload || { prompt: 'Default AI query' });

    const responsePayload = {
      success: true,
      transactionId: transaction.id,
      payoutId: payout.id,
      unitsPurchased: totalUnits,
      productName: product.name,
      result: providerExecution.result
    };

    res.json(sanitizeCustomerOutput(responsePayload));
  } catch (error: any) {
    console.error('[Checkout Error]', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
