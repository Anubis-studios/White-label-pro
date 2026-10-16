"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const registry_1 = __importDefault(require("./routes/registry"));
const suppliers_1 = __importDefault(require("./routes/suppliers"));
const products_1 = __importDefault(require("./routes/products"));
const storefront_1 = __importDefault(require("./routes/storefront"));
const checkout_1 = __importDefault(require("./routes/checkout"));
const bundles_1 = __importDefault(require("./routes/bundles"));
const autoCreationService_1 = require("./services/autoCreationService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Register API Routes
app.use('/registry', registry_1.default);
app.use('/suppliers', suppliers_1.default);
app.use('/products', products_1.default);
app.use('/storefront', storefront_1.default);
app.use('/checkout', checkout_1.default);
app.use('/bundles', bundles_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Run initial supplier and product sync on launch
(0, autoCreationService_1.syncSuppliersAndProducts)().catch((err) => {
    console.error('[AutoCreation] Initial sync error:', err);
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`[CyberAI Backend] Server running on port ${PORT}`);
    });
}
exports.default = app;
