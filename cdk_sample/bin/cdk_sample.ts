#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkSampleStack } from '../lib/cdk_sample-stack';

const app = new cdk.App();
new CdkSampleStack(app, 'CdkSampleStack', {
    env: {
        region: "eu-central-1",
        account: process.env.AWS_ACCOUNT
    }
});

