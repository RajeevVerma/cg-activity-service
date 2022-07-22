import { Router } from 'express';
import userRouter from './activity-router';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/users', userRouter);

// Export default.
export default baseRouter;
