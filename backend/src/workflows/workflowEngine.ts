import { AgentOrchestrator } from '../agents/core/agentOrchestrator';

export interface WorkflowStep {
  stepId: string;
  type: 'SKILL' | 'LLM' | 'IMAGE' | 'TRANSFORM';
  prompt: string;
}

export class WorkflowEngine {
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
  }

  public async executeBundleWorkflow(steps: WorkflowStep[]) {
    const results: any[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const result = await this.orchestrator.processTask(
        `BundleWorkerStep-${i + 1}`,
        step.prompt
      );
      results.push({
        stepId: step.stepId,
        type: step.type,
        output: result
      });
    }

    return {
      bundleStatus: 'COMPLETED',
      stepsCount: steps.length,
      executedSteps: results,
      timestamp: new Date().toISOString()
    };
  }
}
