const { EventBridge } = require('aws-sdk/clients/all');
exports.handler = async function (event) {
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
    console.log('event sent successfully => ', putEventsResponse)
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `First Called`,
    };
}