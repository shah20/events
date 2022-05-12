import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Events } from '../constructs/event-construct';
import { LambdaConstruct } from '../constructs/lambda-constructs';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as events from "aws-cdk-lib/aws-events";
import { DynamoDbConstruct } from '../constructs/dynamo-db';

export class EventsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamoDbtable = new DynamoDbConstruct(this, 'FirstTable');
    const rule = new Events(this, 'FirstRule');
    const lambda = new LambdaConstruct(this, 'First', { dynamoDbTableName: dynamoDbtable.firstTable.tableName});

    rule.firstRule.addTarget(
      new targets.LambdaFunction(lambda.secondLambda, {
        event: events.RuleTargetInput.fromObject({
          customData: events.EventField.fromPath('$.ole')
        }),
        
      })
    );

    rule.firstBus.grantPutEventsTo(lambda.firstLambda);

    targets.addLambdaPermission(rule.firstRule, lambda.secondLambda);

    // rule.firstRule.addEventPattern({
    //   source: ['custom-source']
    // });
    
    dynamoDbtable.firstTable.grantFullAccess(lambda.firstLambda);
  }
}
