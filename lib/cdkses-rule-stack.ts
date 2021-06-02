import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as ses from '@aws-cdk/aws-ses';
import * as sns from '@aws-cdk/aws-sns';
import * as actions from '@aws-cdk/aws-ses-actions';

export class CdksesRuleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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
            s3_action,
            sns_action
          ],
          enabled: true
        }
      ]
    })
    
    /*
    // if you use existing bucket 
    // allow ses write content to the bucket
    
    const role = new iam.Role(this, "Role", {
      assumedBy: new iam.ServicePrincipal("ses.amazonaws.com")
    })

    const policy_statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    })

    policy_statement.addActions("s3:PutObject");

    policy_statement.addResources(
      bucket.bucketArn + "/" + this.node.tryGetContext('s3_keyprefix') + "*"
    )

    const policy = new iam.Policy(this, "appsync_es_policy", {
      statements: [policy_statement],
    })
    
    role.attachInlinePolicy(policy);
    */
    new cdk.CfnOutput(this, 'TopicArn', {
      value: topic.topicArn
    })
    
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName
    })
    
  }
}
