import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

export let dbEndpoint = "http://localhost:8000";

export const Activity_TABLE_NAME = 'coach-gurus-activities';

export const setProductionEndpoint = (): void => {
    dbEndpoint = "https://dynamodb.ap-south-1.amazonaws.com";
};

export const serviceConfigOptions: ServiceConfigurationOptions = {
    region: "ap-south-1",
    endpoint: dbEndpoint,
};
