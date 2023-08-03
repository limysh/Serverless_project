import boto3

def lambda_handler(event, context):
    uid = event.get('uid')

    if not uid:
        return {
            'statusCode': 400,
            'body': 'Missing uid in the request input.'
        }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('questions')

    try:
        response = table.get_item(Key={'uid': uid})

        if 'Item' in response:
            item = response['Item']
            return {
                'statusCode': 200,
                'body': item
            }
        else:
            return {
                'statusCode': 404,
                'body': 'Item not found.'
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }