import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoDbConstruct extends Construct {
    public firstTable: dynamoDb.Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.firstTable = new dynamoDb.Table(this, 'FirstTable', {
            partitionKey: { name: 'id', type: dynamoDb.AttributeType.STRING },
            tableName: 'first-table'
        })
    }
}