import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import registryRouter from './routes/registry';
import suppliersRouter from './routes/suppliers';
import productsRouter from './routes/products';
import storefrontRouter from './routes/storefront';
import checkoutRouter from './routes/checkout';
import bundlesRouter from './routes/bundles';
import { syncSuppliersAndProducts } from './services/autoCreationService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/registry', registryRouter);
app.use('/suppliers', suppliersRouter);
app.use('/products', productsRouter);
app.use('/storefront', storefrontRouter);
app.use('/checkout', checkoutRouter);
app.use('/bundles', bundlesRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run initial supplier and product sync on launch
syncSuppliersAndProducts().catch((err) => {
  console.error('[AutoCreation] Initial sync error:', err);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CyberAI Backend] Server running on port ${PORT}`);
  });
}

export default app;
