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
* `cdk deploy CdksesRuleStack`
* `cdk deploy CdksesFunctionStack`


## ReceiptRuleSetは手でActivateする

どうやらCDKで作成されるReceiptRuleSetはdisableされているので、それをAWSコンソールなどから手でactiveに切り替える必要がある。
これはCDKではどうにもならないように思われるが、詳しくはわからない。