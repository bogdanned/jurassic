import * as cdk from '@aws-cdk/core';
import OrderService from './orderService';

export class CdkServerlessStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        new OrderService(this, 'Orders');

    }
}
