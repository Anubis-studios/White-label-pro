export function sanitizeCustomerOutput(data: any): any {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeCustomerOutput(item));
  }

  const sanitized: Record<string, any> = {};
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
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
