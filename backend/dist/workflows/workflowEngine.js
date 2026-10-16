"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngine = void 0;
const agentOrchestrator_1 = require("../agents/core/agentOrchestrator");
class WorkflowEngine {
    orchestrator;
    constructor() {
        this.orchestrator = new agentOrchestrator_1.AgentOrchestrator();
    }
    async executeBundleWorkflow(steps) {
        const results = [];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const result = await this.orchestrator.processTask(`BundleWorkerStep-${i + 1}`, step.prompt);
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
exports.WorkflowEngine = WorkflowEngine;
