import * as cdk from '@aws-cdk/core';
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CdksesDbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const table = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'expire'
    })
    
    table.addGlobalSecondaryIndex({
      indexName: "source-timestamp-index",
      partitionKey: {
        name: "source",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
    })
    
    
    table.addGlobalSecondaryIndex({
      indexName: "source-epoch-index",
      partitionKey: {
        name: "source",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "epoch",
        type: dynamodb.AttributeType.NUMBER,
      },
    })
    
    new cdk.CfnOutput(this, 'TableName', { 
      exportName: this.node.tryGetContext('tablename_exportname'), 
      value: table.tableName,
    })
  }
}
