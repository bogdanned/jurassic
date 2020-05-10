import { APIGatewayEvent, Context } from "aws-lambda"
const AWS = require('aws-sdk');


exports.handler = async function (event: APIGatewayEvent, context: Context): Promise<any> {
    try {
        var method = event.httpMethod;

        if (method === "GET") {
            // GET / to get the names of all orders
            if (event.path === "/") {
                return {
                    statusCode: 200,
                    headers: {},
                    body: "success"
                };
            }
        }

        if (method === "POST") {
            // POST /name
            var orderData = {
                userEmail: "default@default.com",
                itemName: "default product",
                itemPrice: 0,
                itemsQuantity: 19,
                ...JSON.parse(event.body || "{}")
            }
            const sqs = new AWS.SQS();

            const queueUrl = process.env.SQS_QUEUE_URL;

            let sqsOrderData = {
                MessageAttributes: {
                    "userEmail": {
                        DataType: "String",
                        StringValue: orderData.userEmail
                    },
                    "itemName": {
                        DataType: "String",
                        StringValue: orderData.itemName
                    },
                    "itemPrice": {
                        DataType: "Number",
                        StringValue: orderData.itemPrice
                    },
                    "itemsQuantity": {
                        DataType: "Number",
                        StringValue: orderData.itemsQuantity
                    }
                },
                MessageBody: JSON.stringify(orderData),
                MessageDeduplicationId: String(new Date().getTime()),
                MessageGroupId: "UserOrders",
                QueueUrl: queueUrl
            };

            let sendSqsMessage = sqs.sendMessage(sqsOrderData).promise();


            sendSqsMessage.then((data: any) => {
                console.log(`OrdersSvc | SUCCESS: ${data.MessageId}`);
                return "Thank you for your order. Check you inbox for the confirmation email.";
            }).catch((err: Error) => {
                console.log(`OrdersSvc | ERROR: ${err}`);

                // Send email to emails API
                return "We ran into an error. Please try again.";
            });
        }

        if (method === "DELETE") {
            // DELETE /name

        }

    } catch (error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
            statusCode: 400,
            headers: {},
            body: body
        }
    }
}


export default exports.handler