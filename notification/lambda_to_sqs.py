import json
import boto3

sqs = boto3.client('sqs')

def lambda_handler(event, context):
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
        return response
    try:
        body = json.loads(event['body'])
        queue_name = body.get('queue_name', None)
        message = body.get('message', None)
        print(queue_name)
        print(message)

        if not queue_name or not message:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing queue_name or message in the request body'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*', 
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }

        queue_url = f'https://sqs.us-east-1.amazonaws.com/488330261059/{queue_name}'
        response = sqs.send_message(QueueUrl=queue_url, MessageBody=json.dumps(message))

        return {
            'statusCode': 200,
            'body': 'Message sent successfully to the specified SQS queue',
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    except Exception as e:
        print("Error sending message:", e)
        return {
            'statusCode': 500,
            'body': 'Error sending message to the specified SQS queue',
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
