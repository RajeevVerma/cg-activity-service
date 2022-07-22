import * as awsConfig from "../../shared/constants/aws-config";
import * as AWS from "aws-sdk";
import commandLineArgs from "command-line-args";
import { Activity_TABLE_NAME } from "../../shared/constants/aws-config";

const options = commandLineArgs([
    {
        name: "env",
        alias: "e",
        defaultValue: "development",
        type: String,
    },
]);

console.log("options", options);

if (options.env === "prod") {
    awsConfig.setProductionEndpoint();
    console.debug("dbEndpoint set", awsConfig.dbEndpoint);
}
console.debug('DynamoDb config.', awsConfig.serviceConfigOptions);
AWS.config.update(awsConfig.serviceConfigOptions);

const dynamodb = new AWS.DynamoDB();
const params = {
    TableName: Activity_TABLE_NAME,
    AttributeDefinitions: [
        {
            "AttributeName": "pk",
            "AttributeType": "S"
        },
        {
            "AttributeName": "sk",
            "AttributeType": "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "pk",
            KeyType: "HASH"
        }, //Partition key
        {
            AttributeName: "sk",
            KeyType: "RANGE"
        }

    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
};


dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error(
            "Unable to create table. Error JSON:",
            JSON.stringify(err, null, 2)
        );
    } else {
        console.log(
            "Created table. Table description JSON:",
            JSON.stringify(data, null, 2)
        );
    }
});
