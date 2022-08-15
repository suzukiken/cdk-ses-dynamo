import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Stack, StackProps, Fn, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdksesDbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const table = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
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
    
    new CfnOutput(this, 'TableName', { 
      exportName: this.node.tryGetContext('tablename_exportname'), 
      value: table.tableName,
      description: "Dynamodb table name"
    })
  }
}
