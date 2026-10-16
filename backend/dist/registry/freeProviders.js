"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeProviders = void 0;
const client_1 = require("@prisma/client");
exports.freeProviders = [
    {
        name: "Makko AI",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.makko.ai",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "150/month",
            tier: "standard",
            category: "game_art",
        },
    },
    {
        name: "Rapid Assets",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.rapidassets.ai",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "10_credits_signup",
            tier: "standard",
            category: "game_art_3d_video",
        },
    },
    {
        name: "PixelLab.ai",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.pixellab.ai",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_tier",
            tier: "standard",
            category: "pixel_sprites",
        },
    },
    {
        name: "Pixelcut Sprite Generator",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.pixelcut.ai/sprites",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_tier",
            tier: "standard",
            category: "sprite_sheets",
        },
    },
    {
        name: "Meshy",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.meshy.ai",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "10_downloads_month",
            tier: "standard",
            category: "3d_models",
        },
    },
    {
        name: "RunwayML",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.runwayml.com",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_credits",
            tier: "premium",
            category: "video_generation",
        },
    },
    {
        name: "Luma AI",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.luma.ai",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_tier",
            tier: "premium",
            category: "3d_generation",
        },
    },
    {
        name: "AIVA",
        type: client_1.ProviderType.TTS,
        apiBaseUrl: "https://api.aiva.ai",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_tier",
            tier: "standard",
            category: "music",
        },
    },
    {
        name: "ElevenLabs",
        type: client_1.ProviderType.TTS,
        apiBaseUrl: "https://api.elevenlabs.io",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "10k_chars_month",
            tier: "standard",
            category: "voice",
        },
    },
    {
        name: "Stable Diffusion",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.stable-diffusion.example",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "local_or_free_cloud",
            tier: "standard",
            category: "general_image",
        },
    },
    {
        name: "HuggingFace Image",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api-inference.huggingface.co/models",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_models",
            tier: "standard",
            category: "general_image",
        },
    },
    {
        name: "Replicate Image",
        type: client_1.ProviderType.IMAGE,
        apiBaseUrl: "https://api.replicate.com/v1/predictions",
        apiKey: null,
        metadata: {
            baseCostPerUnit: 0,
            rateLimit: "free_tier",
            tier: "standard",
            category: "general_image",
        },
    },
];
