import { Router } from 'express';
import { WorkflowEngine } from '../workflows/workflowEngine';

const router = Router();
const workflowEngine = new WorkflowEngine();

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
