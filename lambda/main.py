import boto3
import botocore
import os
import json
from pprint import pprint
from datetime import datetime, timedelta

TABLE_NAME = os.environ.get('TABLE_NAME')

config = botocore.config.Config(retries={'max_attempts': 10, 'mode': 'standard'})
resource = boto3.resource('dynamodb', config=config)
table = resource.Table(TABLE_NAME)

def lambda_handler(event, context):
  print(event)
    
  for record in event['Records']:
    message = json.loads(record['Sns']['Message'])
    timestamp = message['mail']['timestamp']
    dt = datetime.fromisoformat(timestamp.replace('Z', ''))
    source = message['mail']['source']
    message_id = message['mail']['messageId']
    destinations = message['mail']['destination']
    subject = message['mail']['commonHeaders']['subject']
    froms = message['mail']['commonHeaders']['from']
    tos = message['mail']['commonHeaders']['date']
    
    
    print(subject)
    
    expire = int((datetime.utcnow() + timedelta(minutes=3)).timestamp())

    item = {
      'id': message_id,
      'timestamp': timestamp,
      'epoch': int(dt.timestamp() * 1000),
      'source': source,
      'message_id': message_id,
      'destinations': destinations,
      'subject': subject,
      'froms': froms,
      'tos': tos,
      'expire': expire
    }
    response = table.put_item(Item=item)

