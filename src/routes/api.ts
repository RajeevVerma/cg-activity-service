import { Router } from 'express';
import activityRouter from './activity-router';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/activity', activityRouter);

// Export default.
export default baseRouter;
