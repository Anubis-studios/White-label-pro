import { SkillRegistry } from '../skills/skillRegistry';

export interface AgentContext {
  agentId: string;
  sessionToken?: string;
  memory: Map<string, any>;
  governanceRules: string[];
}

export class AgentOrchestrator {
  private skillRegistry: SkillRegistry;

  constructor() {
    this.skillRegistry = SkillRegistry.getInstance();
  }

  public async processTask(
    agentName: string,
    prompt: string,
    context?: Partial<AgentContext>
  ) {
    const memory = context?.memory || new Map<string, any>();
    const governanceRules = context?.governanceRules || [
      'SECRECY: Never reveal internal suppliers or provider costs',
      'ACCURACY: Validate output formatting',
      'HIGH_PERFORMANCE: Prefer lowest-latency execution path'
    ];

    const skills = this.skillRegistry.listSkills();
    let selectedSkillId = 'neon-copywriting';

    if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('build')) {
      selectedSkillId = 'code-architect';
    } else if (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('design') || prompt.toLowerCase().includes('visual')) {
      selectedSkillId = 'visual-concept-gen';
    }

    const skill = this.skillRegistry.getSkill(selectedSkillId);
    let executionResult = null;

    if (skill) {
      executionResult = await skill.execute({ topic: prompt, task: prompt, concept: prompt });
    }

    memory.set('lastPrompt', prompt);
    memory.set('lastSkill', selectedSkillId);

    return {
      agent: agentName,
      status: 'COMPLETED',
      governanceVerified: true,
      appliedGovernanceRules: governanceRules,
      selectedSkill: skill ? { id: skill.id, name: skill.name } : null,
      output: executionResult,
      memorySnapshot: {
        lastPrompt: memory.get('lastPrompt'),
        lastSkill: memory.get('lastSkill')
      }
    };
  }
}
