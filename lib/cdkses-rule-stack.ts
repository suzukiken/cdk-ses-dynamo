import * as s3 from "aws-cdk-lib/aws-s3"
import * as ses from "aws-cdk-lib/aws-ses"
import * as sns from "aws-cdk-lib/aws-sns"
import * as actions from "aws-cdk-lib/aws-ses-actions"
import { Stack, StackProps, Fn, CfnOutput, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class CdksesRuleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    })
    
    const topic = new sns.Topic(this, 'Topic', { topicName: this.node.tryGetContext('topicname') })
    
    const s3_action = new actions.S3({
      bucket,
      objectKeyPrefix: this.node.tryGetContext('s3_keyprefix')
    })
    
    const sns_action = new actions.Sns({topic: topic})
    
    const rule = new ses.ReceiptRuleSet(this, 'RuleSet', {
      rules: [
        {
          recipients: [
            this.node.tryGetContext('domain')
          ],
          actions: [
            sns_action,
            s3_action
          ],
          enabled: true
        }
      ]
    })

    new CfnOutput(this, 'TopicArn', {
      value: topic.topicArn,
      description: "SNS topic arn"
    })
    
    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: "S3 bucket name"
    })
    
  }
}
