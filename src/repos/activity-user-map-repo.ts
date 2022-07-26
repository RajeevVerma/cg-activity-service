/* eslint-disable @typescript-eslint/no-misused-promises */
import { IActivityUserMap } from '@models/activity-model';
import { Activity_TABLE_NAME, serviceConfigOptions } from "@shared/constants/aws-config";
import AWS from "aws-sdk";

AWS.config.update(serviceConfigOptions);

const dbClient = new AWS.DynamoDB.DocumentClient();

/**
 * Save a user.
 * @param activity
 * @returns
 */
const save = async (activity: IActivityUserMap): Promise<any> => {
    console.log("activity-user-map-repo", activity);

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

export default {
    save
}