import boto3
import botocore
import os
import subprocess
import json
import sys
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("-o", "--outoutsjson_filepath", default="test/outputs.json")

args = parser.parse_args()

print(args.outoutsjson_filepath)

filepath = None

if 1 < len(sys.argv):
    filepath = sys.argv[1]

# list stacks names in this app

compproc = subprocess.run(["cdk", "list"], capture_output=True)
stacknames = compproc.stdout.decode().split('\n')
stacknames.remove('')

print ('{} Stack names found : {}'.format(len(stacknames), stacknames))

# list Cloudformation outputs in this app

cloudformation = boto3.resource('cloudformation')

outputs = {}

for stackname in stacknames:
    # stack if not deployed nor stacks in different region
    try:
        stack = cloudformation.Stack(stackname)
        for output in stack.outputs:
            if 'ExportName' in output:
                outputs[output['ExportName']] = output['OutputValue']
    except botocore.exceptions.ClientError as e:
        print(e)

for key in outputs:
    print (key)
    print (outputs[key])

if args.outoutsjson_filepath:
    with open(args.outoutsjson_filepath, mode='w') as f:
        f.write(json.dumps(outputs, indent=4))
