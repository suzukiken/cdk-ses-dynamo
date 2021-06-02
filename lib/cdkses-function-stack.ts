import * as cdk from '@aws-cdk/core';
import * as sns from "@aws-cdk/aws-sns";
import * as lambda from "@aws-cdk/aws-lambda";
import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import { SnsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CdksesFunctionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    
    const table = dynamodb.Table.fromTableName(this, "Table", 
      cdk.Fn.importValue(this.node.tryGetContext('tablename_exportname'))
    )
    
    const topicname = this.node.tryGetContext('topicname')
    
    // TODO maybe stop running if account is not retrieved
    let account = ''
    if (props && props.env && props.env.account) {
      account = props.env.account
    }

    const topic = sns.Topic.fromTopicArn(this, 'Topic', `arn:aws:sns:us-east-1:${account}:${topicname}`)
    
    const lambda_function = new PythonFunction(this, "Function", {
      entry: "lambda",
      index: "main.py",
      handler: "lambda_handler",
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: table.tableName
      }
    })
    
    lambda_function.addEventSource(new SnsEventSource(topic))
    
    table.grantReadWriteData(lambda_function)
    
    new cdk.CfnOutput(this, 'FunctionArn', { 
      value: lambda_function.functionArn,
      exportName: this.node.tryGetContext('functionarn_exportname')
    })
  }
}
