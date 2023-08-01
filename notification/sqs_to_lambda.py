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
    print(event)
    body = json.loads(event['body'])
    id = body.get('id')
    print(id)

    if not id:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Missing ID parameter in the request body'}),
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }

    queues = [
        "AchievementUnlocked",
        "RankChange",
        "GameInvite",
        "TeamUpdates",
        "NewTriviaGame",
    ]
    matching_notifications = []

    try:
        for queue in queues:
            messages = receive_messages_from_queue(queue)
            for message in messages:
                print(message)
                message_body = json.loads(message['Body'])
                if message_body['id'] == id:
                    matching_notifications.append(message_body['message'])
                    delete_message_from_queue(queue, message['ReceiptHandle'])

        return {
            'statusCode': 200,
            'body': json.dumps({'notifications': matching_notifications}),
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    except Exception as e:
        print("Error processing notifications:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error processing notifications'}),
        }

def receive_messages_from_queue(queue_name):
    queue_url = f'https://sqs.us-east-1.amazonaws.com/488330261059/{queue_name}'
    params = {
        'QueueUrl': queue_url,
        'MaxNumberOfMessages': 10,
        'WaitTimeSeconds': 5,
    }

    response = sqs.receive_message(**params)
    messages = response.get('Messages', [])
    return messages

def delete_message_from_queue(queue_name, receipt_handle):
    queue_url = f'https://sqs.us-east-1.amazonaws.com/488330261059/{queue_name}'
    params = {
        'QueueUrl': queue_url,
        'ReceiptHandle': receipt_handle,
    }

    sqs.delete_message(**params)
