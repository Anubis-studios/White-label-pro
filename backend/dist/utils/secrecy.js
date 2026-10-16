"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCustomerOutput = sanitizeCustomerOutput;
function sanitizeCustomerOutput(data) {
    if (!data || typeof data !== 'object')
        return data;
    if (Array.isArray(data)) {
        return data.map((item) => sanitizeCustomerOutput(item));
    }
    const sanitized = {};
    const forbiddenKeys = [
        'supplier',
        'supplierId',
        'supplierSharePence',
        'baseCostPerUnit',
        'markupType',
        'markupValue',
        'isFreeProvider',
        'payoutAccountId',
        'payouts',
        'provider',
        'providerId',
        'apiKey',
        'apiBaseUrl',
        'internalCost',
        'cost'
    ];
    for (const [key, value] of Object.entries(data)) {
        if (forbiddenKeys.includes(key)) {
            continue;
        }
        if (value && typeof value === 'object') {
            sanitized[key] = sanitizeCustomerOutput(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
