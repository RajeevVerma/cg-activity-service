/* eslint-disable @typescript-eslint/no-misused-promises */
import { getActivitySk, IActivity } from '@models/activity-model';
import { getRandomInt } from '@shared/functions';
import orm from './mock-orm';
import { Activity_TABLE_NAME, serviceConfigOptions } from "@shared/constants/aws-config";
import AWS from "aws-sdk";

AWS.config.update(serviceConfigOptions);

const dbClient = new AWS.DynamoDB.DocumentClient();


/**
 * Get one activity.
 * @param id
 * @returns
 */
async function getOne(pk: string): Promise<IActivity> {
    console.log('Activity getOne pk', pk);

    let result: IActivity | undefined;
    return new Promise((resolve, error) => {
        dbClient.get(
            {
                TableName: Activity_TABLE_NAME,
                Key: {
                    pk: pk,
                    sk: getActivitySk(pk)
                },
            }, function (err, data) {
                result = data as IActivity;
                if (err) {

                    console.error(err);
                    error(err);
                } else {
                    console.log("GetItem succeeded:", data);
                    resolve(result);
                }
            });
    });
}

/**
 * Save a user.
 * @param activity
 * @returns
 */
const save = async (activity: IActivity): Promise<any> => {
    console.log("user-repo", activity);

    return new Promise((resolve, error) => {
        dbClient.put(
            {
                TableName: Activity_TABLE_NAME,
                Item: activity,
            },
            function (err, data) {
                if (err) {
                    console.error(err);
                    error(err);
                } else {
                    console.debug("PutItem succeeded:", data);
                    resolve(activity);
                }
            }
        );

    });
};


/**
 * See if a activity with the given id exists.
 * 
 * @param id 
 */
async function persists(id: string): Promise<boolean> {
    const db = await orm.openDb();
    for (const activity of db.activities) {
        if (activity.id === id) {
            return true;
        }
    }
    return false;
}

/**
 * Get all activities.
 * 
 * @returns 
 */
async function getAll(): Promise<IActivity[]> {
    const db = await orm.openDb();
    return db.activities as IActivity[];
}

/**
 * Add one activity.
 * 
 * @param activity 
 * @returns 
 */
async function add(activity: IActivity): Promise<IActivity> {
    console.log("activity-repo", activity);

    return new Promise((resolve, error) => {
        dbClient.put(
            {
                TableName: Activity_TABLE_NAME,
                Item: activity,
            },
            function (err, data) {
                if (err) {
                    console.error(err);
                    error(err);
                } else {
                    console.debug("PutItem succeeded:", data);
                    resolve(activity);
                }
            }
        );

    });
}

/**
 * Update a activity.
 * 
 * @param activity 
 * @returns 
 */
async function update(activity: IActivity): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.activities.length; i++) {
        if (db.activities[i].pk === activity.pk) {
            db.activities[i] = activity;
            return orm.saveDb(db);
        }
    }
}

/**
 * Delete one activity.
 * 
 * @param pk 
 * @returns 
 */
async function deleteOne(pk: string): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.activities.length; i++) {
        if (db.activities[i].pk === pk) {
            //   db.activities.splice(i, 1);
            return orm.saveDb(db);
        }
    }
}

/**
 * Get activities by user pk.
 * @param pk
 * @returns
 */
 async function getByUser(pk: string): Promise<IActivity[]> {
    console.log('Activity getByUser pk', pk);

    let result: IActivity[] | undefined;
    return new Promise((resolve, error) => {
        dbClient.get(
            {
                TableName: Activity_TABLE_NAME,
                Key: {
                    pk: pk
                },
            }, function (err, data) {
                result = data as IActivity[];
                if (err) {

                    console.error(err);
                    error(err);
                } else {
                    console.log("GetItem succeeded:", data);
                    resolve(result);
                }
            });
    });
}

// Export default
export default {
    getOne,
    save,
    persists,
    getAll,
    add,
    update,
    delete: deleteOne,
    getByUser
} as const;
