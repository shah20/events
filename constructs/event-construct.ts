import * as cdk from 'aws-cdk-lib'
import * as event from 'aws-cdk-lib/aws-events';
import { Construct } from "constructs";

export class Events extends Construct {

    public firstRule: event.Rule;
    public firstBus: event.EventBus;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.firstBus = new event.EventBus(this, 'FirstBus', {
            eventBusName: 'first-bus'
          });

        new cdk.CfnOutput(this, 'BusName', {value: this.firstBus.eventBusName})

        this.firstRule = new event.Rule(this, 'FirstRule', {
            eventBus: this.firstBus,
            eventPattern: {
                source: ['custom-source']
            }
        });
    }
}