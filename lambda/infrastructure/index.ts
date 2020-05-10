import * as cdk from '@aws-cdk/core';
import OrderService from './orderService';
import * as dotenv from 'dotenv';
dotenv.config()


const app = new cdk.App();

new OrderService(app, 'ServerlessOrderSevice',
    {
        env: {
            region: process.env.AWS_REGION,
            account: process.env.AWS_ACCOUNT
        }
    });