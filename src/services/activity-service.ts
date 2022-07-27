import activityRepo from '@repos/activity-repo';
import activityUserMapRepo from '@repos/activity-user-map-repo';
import {
    getActivityPk,
    IActivity,
    getActivitySk,
    IActivityUserMap,
    getActivityUserMapPk,
    getActivityUserMapSk
} from '@models/activity-model';
import { UserNotFoundError } from '@shared/errors';
import { ActivityUserMapStatus, userRole, userType } from '@models/shared/enums';
import { ApplicationModelPrefixes } from '@shared/constants/model-constants';

/**
 * Get all activities.
 * @returns 
 */
function getAll(): Promise<IActivity[]> {
    return activityRepo.getAll();
}

/**
 * Add one activity.
 * @param activity 
 * @returns 
 */
function createOne(activity: IActivity, createdByUserPk: string): Promise<IActivity> {
    if (activity.pk)
        throw Error(`Cannot create activity if pk is already set, 
            do you want to update the activity?`);

    activity.pk = getActivityPk(ApplicationModelPrefixes.Activity_Prefix);
    activity.sk = getActivitySk(activity.pk);

    const activityUserMap: IActivityUserMap = {
        isCreator: true,
        type: userType.Guru,
        role: userRole.Owner,
        currentStatus: ActivityUserMapStatus.Active,
        addDate: new Date(),
        pk: getActivityUserMapPk(ApplicationModelPrefixes.Guru_Prefix, createdByUserPk),
        sk: getActivityUserMapSk(ApplicationModelPrefixes.Activity_Prefix, activity.pk),
    }

    activityUserMapRepo.save(activityUserMap);

    return activityRepo.add(activity);
}

/**
 * Update one activity.
 * @param activity 
 * @returns 
 */
async function updateOne(activity: IActivity): Promise<void> {
    const persists = await activityRepo.persists(activity.pk);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return activityRepo.update(activity);
}

/**
 * Delete a activity by their id.
 * @param pk 
 * @returns 
 */
async function deleteOne(pk: string): Promise<void> {
    const persists = await activityRepo.persists(pk);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return activityRepo.delete(pk);
}

async function getByUser(pk: string) {
    const persists = await activityRepo.persists(pk);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return activityRepo.getByUser(pk);
}

// Export default
export default {
    getAll,
    createOne,
    updateOne,
    delete: deleteOne,
    getByUser
} as const;
