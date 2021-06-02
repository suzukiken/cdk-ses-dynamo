#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdksesRuleStack } from '../lib/cdkses-rule-stack';
import { CdksesDbStack } from '../lib/cdkses-db-stack';
import { CdksesFunctionStack } from '../lib/cdkses-function-stack';

const app = new cdk.App();

const dbStack = new CdksesDbStack(app, 'CdksesDbStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-northeast-1' },
})

const functionStack = new CdksesFunctionStack(app, 'CdksesFunctionStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: 'ap-northeast-1' },
})

const ruleStack = new CdksesRuleStack(app, 'CdksesRuleStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
})

functionStack.addDependency(ruleStack)
functionStack.addDependency(dbStack)