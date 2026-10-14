import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import cropRoutes from './cropRoutes.js';
import diseaseRoutes from './diseaseRoutes.js';
import predictRoutes from './predictRoutes.js';
import historyRoutes from './historyRoutes.js';
import assistantRoutes from './assistantRoutes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/crops', cropRoutes);
apiRouter.use('/diseases', diseaseRoutes);
apiRouter.use('/predict', predictRoutes);
apiRouter.use('/history', historyRoutes);
apiRouter.use('/assistant', assistantRoutes);

export default apiRouter;
