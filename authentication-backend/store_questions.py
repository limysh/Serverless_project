import json
import boto3

TABLE_NAME = 'questions'

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        print(event,">>>>>>>")
        # Store the JSON input in the DynamoDB table
        response = table.put_item(Item=event)
        return {
            'statusCode': 200,
            'body': 'JSON input stored in DynamoDB successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error storing JSON input in DynamoDB: {}'.format(str(e)))
        }
