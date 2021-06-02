# CDK Project to create SES Rule which saves mail to S3 and Lambda which make record to table along with S3 content.

## Resources to be created

* SES Ruleset
* DynamoDB table
* S3 Bucket
* Lambda Function

## Purpose

For testing sending email.

## Commands

* `npm install`
* `cdk deploy CdksesDbStack`
* `cdk deploy CdksesFunctionStack`
* `cdk deploy CdksesRuleStack`

## Parameters

Defined in cdk.json 

