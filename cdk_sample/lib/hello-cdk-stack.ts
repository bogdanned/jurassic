import * as core from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class HelloCdkStack extends core.Stack {
    constructor(scope: core.App, id: string, props?: core.StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, 'MyFirstBucket', {
            versioned: true
        });
    }
}