import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaEventSources from "@aws-cdk/aws-lambda-event-sources";
import * as sqs from "@aws-cdk/aws-sqs";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as dotenv from "dotenv";
dotenv.config();

// import * as s3 from "@aws-cdk/aws-s3";


export default class CdkServerlessStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // bucket to store lambda code
        // const bucket = new s3.Bucket(this, "Lambda Store");

        // queue with orders
        const queue = new sqs.Queue(this, "OrderQueue", {
            fifo: true,
        });

        const orderEventSource = new lambdaEventSources.SqsEventSource(queue);

        // orders lambda handler
        const mailHandler = new lambda.Function(this, "MailHandler", {
            runtime: lambda.Runtime.NODEJS_10_X, // So we can use async in widget.js
            code: lambda.Code.asset("dist/src"),
            functionName: "Jurassic_MailService",
            handler: "mail.handler",
            environment: {
                EMAIL_USER: process.env.MAILER_EMAIL_USER || "",
                EMAIL_PASSWORD: process.env.MAILER_EMAIL_PASSWORD || "",
            },
        });

        mailHandler.addEventSource(orderEventSource);

        // read pemissions on the queue
        queue.grantConsumeMessages(mailHandler);

        // table to store orders
        const table = new dynamodb.Table(this, "Table", {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        });

        // orders lambda handler
        const orderHandler = new lambda.Function(this, "OrderHandler", {
            runtime: lambda.Runtime.NODEJS_10_X, // So we can use async in widget.js
            code: lambda.Code.asset("dist/src"),
            functionName: "Jurassic_OrderService",
            handler: "orders.handler",
            environment: {
                orderTableUrl: table.tableName,
                orderQueueUrl: queue.queueUrl,
            },
        });

        table.grantFullAccess(orderHandler);
        queue.grantSendMessages(orderHandler);

        // bucket.grantReadWrite(handler); // was: handler.role);

        const api = new apigateway.LambdaRestApi(this, "orders-api", {
            restApiName: "Order Service",
            description: "This service manages orders.",
            handler: orderHandler,
        });

        // api.root.addMethod('ANY');

        // const orders = api.root.addResource('orders');
        // orders.addMethod('GET');
        // orders.addMethod('POST');

        // const order = orders.addResource('{order_id}');
        // order.addMethod('GET');
        // order.addMethod('DELETE');
    }
}
