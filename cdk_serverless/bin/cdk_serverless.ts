#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkServerlessStack } from '../lib/cdk_serverless-stack';

const app = new cdk.App();
new CdkServerlessStack(app, 'CdkServerlessStack',
    {
        env: {
            region: "eu-central-1",
            account: process.env.AWS_ACCOUNT
        }
    });
