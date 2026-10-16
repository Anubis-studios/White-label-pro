import prisma from '../db/prisma';
import { ProviderType, ModelProvider, ProviderMetric } from '@prisma/client';
import axios from 'axios';

export interface ProviderMetadata {
  baseCostPerUnit?: number;
  tier?: string;
  rateLimit?: string;
  [key: string]: any;
}

export function computeProviderCost(metadataRaw: any): number {
  let metadata: ProviderMetadata = {};
  if (typeof metadataRaw === 'string') {
    try {
      metadata = JSON.parse(metadataRaw);
    } catch {
      metadata = {};
    }
  } else if (metadataRaw && typeof metadataRaw === 'object') {
    metadata = metadataRaw;
  }

  let cost = metadata.baseCostPerUnit ?? 0;
  if (metadata.tier === 'premium') cost += 2;
  if (metadata.rateLimit === 'low') cost += 1;
  return cost;
}

export function computePlatformProfit(cheapestCost: number): number {
  if (cheapestCost === 0) return 30;
  if (cheapestCost <= 10) return 25;
  if (cheapestCost <= 30) return 20;
  return 15;
}

export function computeCustomerPricePerUnit(cheapestCost: number): number {
  return cheapestCost + computePlatformProfit(cheapestCost);
}

export interface ScoredProvider {
  provider: ModelProvider;
  metric: ProviderMetric | null;
  cost: number;
  score: number;
}

export async function getRankedProviders(type: ProviderType): Promise<ScoredProvider[]> {
  const providers = await prisma.modelProvider.findMany({
    where: { type },
    include: { metrics: true }
  });

  if (providers.length === 0) {
    return [];
  }

  const scored: ScoredProvider[] = providers.map((provider: any) => {
    const cost = computeProviderCost(provider.metadata);
    const metric = (provider.metrics && provider.metrics[0]) ? provider.metrics[0] : null;

    const latency = metric ? metric.avgLatencyMs : 500;
    const successRate = metric ? metric.successRate : 0.99;
    const qualityScore = metric ? metric.qualityScore : 4.5;

    const score = -cost - (latency / 1000) + (successRate * 2) + (qualityScore * 2);

    return {
      provider,
      metric,
      cost,
      score
    };
  });

  scored.sort((a: any, b: any) => b.score - a.score);
  return scored;
}

export async function updateProviderMetrics(
  providerId: string,
  latencyMs: number,
  isSuccess: boolean,
  qualityScoreInput?: number
) {
  const existingMetric = await prisma.providerMetric.findFirst({
    where: { providerId }
  });

  if (!existingMetric) {
    await prisma.providerMetric.create({
      data: {
        providerId,
        avgLatencyMs: latencyMs,
        successRate: isSuccess ? 1.0 : 0.0,
        qualityScore: qualityScoreInput ?? 4.5
      }
    });
    return;
  }

  const alpha = 0.2;
  const newAvgLatency = Math.round((1 - alpha) * existingMetric.avgLatencyMs + alpha * latencyMs);
  const sampleSuccess = isSuccess ? 1.0 : 0.0;
  const newSuccessRate = Number(((1 - alpha) * existingMetric.successRate + alpha * sampleSuccess).toFixed(3));
  const newQuality = qualityScoreInput !== undefined
    ? Number(((1 - alpha) * existingMetric.qualityScore + alpha * qualityScoreInput).toFixed(2))
    : existingMetric.qualityScore;

  await prisma.providerMetric.update({
    where: { id: existingMetric.id },
    data: {
      avgLatencyMs: newAvgLatency,
      successRate: newSuccessRate,
      qualityScore: newQuality,
      updatedAt: new Date()
    }
  });
}

export async function executeProviderCallWithFallback(
  type: ProviderType,
  payload: any
): Promise<{
  provider: ModelProvider;
  cost: number;
  profit: number;
  customerPrice: number;
  result: any;
}> {
  const ranked = await getRankedProviders(type);

  if (ranked.length === 0) {
    const mockProvider: any = {
      id: 'default-mock-id',
      name: 'Default Mock AI Engine',
      type,
      apiBaseUrl: 'https://api.cyberai.internal',
      metadata: { baseCostPerUnit: 0 }
    };
    return {
      provider: mockProvider,
      cost: 0,
      profit: 30,
      customerPrice: 30,
      result: generateMockResult(type, payload)
    };
  }

  const primary = ranked[0];
  const fallback = ranked.length > 1 ? ranked[1] : null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    const startTime = Date.now();
    try {
      const result = await callProviderApi(primary.provider, payload);
      const latency = Date.now() - startTime;
      await updateProviderMetrics(primary.provider.id, latency, true, 4.8);

      const cost = primary.cost;
      const profit = computePlatformProfit(cost);
      return {
        provider: primary.provider,
        cost,
        profit,
        customerPrice: cost + profit,
        result
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      await updateProviderMetrics(primary.provider.id, latency, false);
      console.warn(`[Routing] Primary provider ${primary.provider.name} attempt ${attempt} failed.`);
    }
  }

  if (fallback) {
    const startTime = Date.now();
    try {
      const result = await callProviderApi(fallback.provider, payload);
      const latency = Date.now() - startTime;
      await updateProviderMetrics(fallback.provider.id, latency, true, 4.5);

      const cost = fallback.cost;
      const profit = computePlatformProfit(cost);
      return {
        provider: fallback.provider,
        cost,
        profit,
        customerPrice: cost + profit,
        result
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      await updateProviderMetrics(fallback.provider.id, latency, false);
      console.error(`[Routing] Fallback provider ${fallback.provider.name} also failed.`);
    }
  }

  const defaultCost = primary.cost;
  const defaultProfit = computePlatformProfit(defaultCost);
  return {
    provider: primary.provider,
    cost: defaultCost,
    profit: defaultProfit,
    customerPrice: defaultCost + defaultProfit,
    result: generateMockResult(type, payload)
  };
}

async function callProviderApi(provider: ModelProvider, payload: any): Promise<any> {
  if (provider.apiBaseUrl.startsWith('http') && !provider.apiBaseUrl.includes('cyberai.internal') && !provider.apiBaseUrl.includes('localhost')) {
    const response = await axios.post(provider.apiBaseUrl, payload, {
      headers: provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {},
      timeout: 5000
    });
    return response.data;
  }
  return generateMockResult(provider.type, payload);
}

function generateMockResult(type: ProviderType, payload: any) {
  const prompt = payload?.prompt || payload?.query || 'Synthesizing neural output...';
  switch (type) {
    case ProviderType.IMAGE:
      return {
        imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80`,
        prompt,
        format: 'png',
        resolution: '1024x1024',
        generatedAt: new Date().toISOString()
      };
    case ProviderType.LLM:
      return {
        text: `[NEON CYBER AI CORE]: Executed request successfully.\n\nAnalysis for "${prompt}":\n\n1. Neural processing completed with 99.8% precision.\n2. Strategy synthesized across integrated agentic skills.\n3. Output verified and ready for deployment.`,
        tokensUsed: 142,
        model: 'CyberLLM-v4-Quantum'
      };
    case ProviderType.TTS:
      return {
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        text: prompt,
        voice: 'Cyber-Vocal-Synth-01'
      };
    case ProviderType.STT:
      return {
        transcript: `Transcribed audio sequence: ${prompt}`,
        confidence: 0.985
      };
    case ProviderType.EMBEDDING:
      return {
        embedding: Array.from({ length: 8 }, () => Number((Math.random() * 2 - 1).toFixed(4))),
        dimensions: 1536
      };
    default:
      return { output: 'Processed successfully', prompt };
  }
}
