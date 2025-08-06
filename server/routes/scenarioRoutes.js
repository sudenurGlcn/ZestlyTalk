import express from 'express';
import scenarioController from '../controllers/scenarioController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, scenarioController.createScenario);
router.get('/', authenticate, scenarioController.getAllScenarios);
router.get('/by-category', authenticate, scenarioController.getScenariosByCategory); 
router.get('/:id', authenticate, scenarioController.getScenarioById);
router.put('/:id', authenticate, scenarioController.updateScenario);
router.delete('/:id', authenticate, scenarioController.deleteScenario);


export default router;
