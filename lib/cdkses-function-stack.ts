import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as sns from "aws-cdk-lib/aws-sns"
import * as lambda from "aws-cdk-lib/aws-lambda"
import { SnsEventSource } from "aws-cdk-lib/aws-lambda-event-sources"
import { Stack, StackProps, Fn, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdksesFunctionStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    
    const table = dynamodb.Table.fromTableName(this, "Table", 
      Fn.importValue(this.node.tryGetContext('tablename_exportname'))
    )
    
    const topicname = this.node.tryGetContext('topicname')
    
    // TODO maybe stop running if account is not retrieved
    let account = ''
    if (props && props.env && props.env.account) {
      account = props.env.account
    }

    const topic = sns.Topic.fromTopicArn(this, 'Topic', `arn:aws:sns:us-east-1:${account}:${topicname}`)
    
    const lambda_function = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'main.lambda_handler',
      environment: {
        TABLE_NAME: table.tableName
      },
    })
    
    lambda_function.addEventSource(new SnsEventSource(topic))
    
    table.grantReadWriteData(lambda_function)
    
    new CfnOutput(this, 'FunctionArn', { 
      value: lambda_function.functionArn,
      exportName: this.node.tryGetContext('functionarn_exportname'),
      description: "Lambda Function arn"
    })
  }
}
