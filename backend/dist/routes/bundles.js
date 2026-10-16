"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workflowEngine_1 = require("../workflows/workflowEngine");
const router = (0, express_1.Router)();
const workflowEngine = new workflowEngine_1.WorkflowEngine();
// POST /bundles - Execute multi-step AI bundle
router.post('/', async (req, res) => {
    try {
        const { steps } = req.body;
        const workflowSteps = steps || [
            { stepId: 'step-1', type: 'SKILL', prompt: 'Create hyper-tech product strategy for quantum AI' },
            { stepId: 'step-2', type: 'IMAGE', prompt: 'Generate glowing cyber neon concept artwork' }
        ];
        const result = await workflowEngine.executeBundleWorkflow(workflowSteps);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
