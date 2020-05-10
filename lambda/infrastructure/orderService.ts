import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
// import * as s3 from "@aws-cdk/aws-s3";

// import * as dynamodb from '@aws-cdk/aws-dynamodb';


export default class CdkServerlessStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // bucket to store lambda code
        // const bucket = new s3.Bucket(this, "Lambda Store");

        // table to store orders
        // const table = new dynamodb.Table(this, 'Table', {
        //     partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
        // });

        // orders lambda handler
        const handler = new lambda.Function(this, "OrderHandler", {
            runtime: lambda.Runtime.NODEJS_10_X, // So we can use async in widget.js
            code: lambda.Code.asset("dist/src"),
            handler: "orders.handler",
            // environment: {
            //     BUCKET: bucket.bucketName
            // }
        });

        // bucket.grantReadWrite(handler); // was: handler.role);

        const api = new apigateway.LambdaRestApi(this, "orders-api", {
            restApiName: "Order Service",
            description: "This service manages orders.",
            handler
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
