import { EventBridge } from 'aws-sdk/clients/all';
import * as AWS from 'aws-sdk';
import { GetItemInput, PutItemInput, ScanInput } from 'aws-sdk/clients/dynamodb';

const handler = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
    const ebClient = new EventBridge();
    const putEventsResponse = await ebClient.putEvents(
        {
            Entries: [
                { Source: 'custom-source', EventBusName: 'first-bus', DetailType: 'first-detailType', Detail: JSON.stringify({'ole':'first-detail'}) }
            ]
        }
    ).promise()
    if (putEventsResponse.FailedEntryCount) {
        console.error("Event bus failure: ", putEventsResponse);
    }
    console.log('event sent successfully => ', putEventsResponse);

    const dynamoClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    const method = event.httpMethod;
    let data: any = { result: '' };

    switch(method) {
        case 'GET':
            const getParams: ScanInput = {
                TableName: process.env.dynamoDbTableName || ''
              };
            data = await dynamoClient.scan(getParams).promise();
            break;
        case 'POST':
            console.log('post event', event)
            const params: PutItemInput = {
                TableName: process.env.dynamoDbTableName || '',
                Item: JSON.parse(event.body)
              };
            await dynamoClient.putItem(params).promise();
            data = { result: 'added successfully' };
            break;
        case 'PATCH':
        
            break;
        case 'DELETE':
            break;
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };
}

export {
    handler
}