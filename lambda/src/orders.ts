import { APIGatewayEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";

exports.handler = async function (
  event: APIGatewayEvent,
  context: Context
): Promise<any> {
  try {
    var method = event.httpMethod;

    if (method === "GET") {
      // GET / to get the names of all orders
      if (event.path === "/") {
        return {
          statusCode: 200,
          headers: {},
          body: "success",
        };
      }
    }

    if (method === "POST") {
      // POST /name
      var orderData = {
        id: "XXXX",
        userEmail: "default@default.com",
        itemName: "default product",
        itemPrice: "0",
        itemsQuantity: "19",
        ...JSON.parse(event.body || "{}"),
      };
      const sqs = new AWS.SQS();

      const queueUrl = process.env.orderQueueUrl;

      let sqsOrderData = {
        MessageAttributes: {
          userEmail: {
            DataType: "String",
            StringValue: orderData.userEmail,
          },
          itemName: {
            DataType: "String",
            StringValue: orderData.itemName,
          },
          itemPrice: {
            DataType: "Number",
            StringValue: orderData.itemPrice,
          },
          itemsQuantity: {
            DataType: "Number",
            StringValue: orderData.itemsQuantity,
          },
        },
        MessageBody: JSON.stringify(orderData),
        MessageDeduplicationId: String(new Date().getTime()),
        MessageGroupId: "UserOrders",
        QueueUrl: queueUrl,
      } as AWS.SQS.SendMessageRequest;

      try {
        const sendSqsMessage = await sqs.sendMessage(sqsOrderData);
        const data = await sendSqsMessage.promise();
        console.log(`OrdersSvc | SUCCESS: ${data.MessageId}`);

        return {
          statusCode: 200,
          headers: {},
          body: JSON.stringify({
            message:
              "Thank you for your order. Check you inbox for the confirmation email.",
            eventId: data.MessageId,
          }),
        };
      } catch (err) {
        console.log(`OrdersSvc | ERROR: ${err}`);

        // Send email to emails API
        return {
          statusCode: 500,
          headers: {},
          body: {
            message: "We ran into an error. Please try again.",
          },
        };
      }
    }

    if (method === "DELETE") {
      // DELETE /name
    }
  } catch (error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: body,
    };
  }
};

export default exports.handler;
