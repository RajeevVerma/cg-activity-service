import userRepo from '@repos/activity-repo';
import { IActivity } from '@models/activity-model';
import { UserNotFoundError } from '@shared/errors';

/**
 * Get all users.
 * 
 * @returns 
 */
function getAll(): Promise<IActivity[]> {
    return userRepo.getAll();
}

/**
 * Add one user.
 * @param user 
 * @returns 
 */
function addOne(user: IActivity): Promise<void> {
    return userRepo.add(user);
}

/**
 * Update one user.
 * 
 * @param user 
 * @returns 
 */
async function updateOne(user: IActivity): Promise<void> {
    const persists = await userRepo.persists(user.pk);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return userRepo.update(user);
}

/**
 * Delete a user by their id.
 * @param pk 
 * @returns 
 */
async function deleteOne(pk: string): Promise<void> {
    const persists = await userRepo.persists(pk);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return userRepo.delete(pk);
}


// Export default
export default {
    getAll,
    addOne,
    updateOne,
    delete: deleteOne,
} as const;
