import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from "constructs";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

export class LambdaConstruct extends Construct {

    public firstLambda: lambda.Function;
    public firstApi: apiGateway.RestApi;
    public secondLambda: lambda.Function;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.firstLambda = new lambda.Function(this, 'FirstLambda', {
            functionName: 'first-lambda',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'first-lambda.handler'
        });

        this.firstApi = new apiGateway.RestApi(this, 'FirstApi', {
            restApiName: 'first-api',
            description: 'API for FirstLambda'
        });
        
        const firstIntegration = new apiGateway.LambdaIntegration(this.firstLambda, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });

        this.firstApi.root.addMethod('GET', firstIntegration);

        this.secondLambda = new lambda.Function(this, 'SecondLambda', {
            functionName: 'second-lambda',
            runtime:lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'second-lambda.handler'
        });
    }
}