/* eslint-disable @typescript-eslint/no-misused-promises */
import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import activitiesService from '@services/activity-service';
import { ParamMissingError } from '@shared/errors';
import { IActivity } from '@models/activity-model';

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    get: '/all',
    add: '/add',
    update: '/update',
    delete: '/delete/:id',
    getByUser: '/get/:id'
} as const;

/**
 * Get all activities.
 */
router.get(p.get, async (req: Request, res: Response) => {
    const activities = await activitiesService.getAll();
    return res.status(OK).json({ activities });
}
);

/**
 * Add one activity.
 */
router.post(p.add, async (req: Request, res: Response) => {
    const { activity, createdByUserPk } = req.body;
    console.log(req.body);
    console.log(activity);
    console.log(createdByUserPk);
    // Check param
    if (!activity) {
        throw new ParamMissingError();
    }
    // Fetch data
    await activitiesService.createOne(activity as IActivity, createdByUserPk as string);
    return res.status(CREATED).end();
});

/**
 * Update one activity.
 */
router.put(p.update, async (req: Request, res: Response) => {
    const { activity: activity } = req.body;
    // Check param
    if (!activity) {
        throw new ParamMissingError();
    }
    // Fetch data
    await activitiesService.updateOne(activity as IActivity);
    return res.status(OK).end();
});

/**
 * Delete one activity.
 */
router.delete(p.delete, async (req: Request, res: Response) => {
    const { id } = req.params;
    // Check param
    if (!id) {
        throw new ParamMissingError();
    }
    // Fetch data
    await activitiesService.delete(id);
    return res.status(OK).end();
});

router.get(p.getByUser, async (req: Request, res: Response) => {
    const { id } = req.params;
    // Check param
    if (!id) {
        throw new ParamMissingError();
    }
    const activities = await activitiesService.getByUser(id);
    return res.status(OK).json({ activities });
}
);

// Export default
export default router;
