"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRegistry = void 0;
class SkillRegistry {
    static instance;
    skills = new Map();
    constructor() {
        this.registerDefaultSkills();
    }
    static getInstance() {
        if (!SkillRegistry.instance) {
            SkillRegistry.instance = new SkillRegistry();
        }
        return SkillRegistry.instance;
    }
    registerSkill(skill) {
        this.skills.set(skill.id, skill);
    }
    getSkill(id) {
        return this.skills.get(id);
    }
    listSkills() {
        return Array.from(this.skills.values()).map(({ id, name, category, description, version }) => ({
            id,
            name,
            category,
            description,
            version
        }));
    }
    registerDefaultSkills() {
        this.registerSkill({
            id: 'neon-copywriting',
            name: 'Cyber Copywriting Engine',
            category: 'marketing',
            description: 'Generates hyper-engaging cyberpunk and high-tech product copy.',
            version: '1.0.0',
            execute: async (input) => {
                return {
                    headline: `NEXT-GEN ${(input.topic || 'AI').toUpperCase()} ACTIVATED`,
                    body: `Experience ultra-high efficiency with our specialized ${input.topic || 'AI'} framework. Optimized for maximum performance and hyper-scale growth.`,
                    keywords: [input.topic || 'AI', 'cyber-tech', 'agentic-ai', 'high-yield']
                };
            }
        });
        this.registerSkill({
            id: 'code-architect',
            name: 'Full-Stack Code Synthesizer',
            category: 'engineering',
            description: 'Synthesizes clean TypeScript code and API architecture definitions.',
            version: '1.0.0',
            execute: async (input) => {
                return {
                    snippet: `// Synthesized for: ${input.task}\nexport async function executeTask() {\n  console.log("Executing high-speed task: ${input.task}");\n  return { status: "SUCCESS", timestamp: new Date().toISOString() };\n}`,
                    language: input.language || 'typescript',
                    status: 'SYNTHESIZED'
                };
            }
        });
        this.registerSkill({
            id: 'visual-concept-gen',
            name: 'Visual Concept & Design Synthesizer',
            category: 'design',
            description: 'Creates hyper-detailed neon visual prompt definitions and style guidelines.',
            version: '1.0.0',
            execute: async (input) => {
                return {
                    prompt: `Ultra-detailed, 8k resolution, volumetric neon lighting, cyber aesthetic of ${input.concept}, vibrant purple and electric blue glow, cinematic composition.`,
                    palette: ['#9B00FF', '#00CFFF', '#FFD700', '#020202', '#FF0033'],
                    aspectRatio: '16:9'
                };
            }
        });
    }
}
exports.SkillRegistry = SkillRegistry;
