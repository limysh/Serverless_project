import json
import boto3
import uuid
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime, timedelta

TABLE_NAME = 'leaderboard'

# Create a DynamoDB resource
dynamodb = boto3.resource('dynamodb')
# Retrieve the DynamoDB table
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You can restrict this to specific domains if needed
                'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
        return response
    body = json.loads(event.get('body', "{}"))
    
    if body == {}:
        return get_game_stats(None)
    
    
    entity_type = body.get('entity_type', None)
    entity_name = body.get('name', None)
    category = body.get('category', None)
    game_id = body.get('game_id', None)
    time_frame = body.get('time_frame', None)
    
    
    # Set the filter expression for the query
    filter_expression = Attr('entity_type').eq(entity_type)
    
    
    if game_id is not None and entity_type is None:
        return get_game_stats(Attr('game_id').eq(game_id))
    elif game_id is not None:
        filter_expression = filter_expression & Attr('game_id').eq(game_id)
        

    create_date = None

    if category is not None:
        print("category")
        print(category)
        # Set the filter expression for the query
        filter_expression = filter_expression & Attr('category').eq(category)

    # Set the default time frame to all-time
    current_time = datetime.now()
    current_time = datetime(current_time.year, current_time.month, current_time.day)
    if time_frame == 'daily':
        create_date = current_time    
    elif time_frame == 'weekly':
        create_date = current_time - timedelta(days=current_time.weekday())
    elif time_frame == 'monthly':
        create_date = current_time.replace(day=1)

    if create_date is not None:
        filter_expression = filter_expression & Attr('create_time').gte(int(datetime.timestamp(create_date)))


    if entity_name is not None:
        filter_expression = filter_expression & Attr('entity_name').eq(entity_name)
        return get_entity_stats(filter_expression)
    else:
        return get_leaderboard(filter_expression)

    
def get_leaderboard(filter_expression):
    # Query the leaderboard data from DynamoDB
    response = table.scan(
        FilterExpression=filter_expression,
        ProjectionExpression='entity_name, entity_id, score, right_answers, wrong_answers, game_id',
        Select='SPECIFIC_ATTRIBUTES'
    )
    
    # Extract all the entities' data
    leaderboard_data = response['Items']

    # Create a dictionary to aggregate data for each entity
    entity_data = {}
    for entity in leaderboard_data:
        entity_name = entity['entity_name']
        if entity_name not in entity_data:
            entity_data[entity_name] = {
                'name': entity_name,
                'total_games': 0,
                'total_score': 0,
                'total_right_answers': 0,
                'total_wrong_answers': 0
            }
        entity_data[entity_name]['total_games'] += 1
        entity_data[entity_name]['id'] = entity['entity_id']
        entity_data[entity_name]['total_score'] += entity['score']
        entity_data[entity_name]['total_right_answers'] += entity['right_answers']
        entity_data[entity_name]['total_wrong_answers'] += entity['wrong_answers']

    # Calculate the efficiency for each entity
    for entity_name in entity_data:
        entity = entity_data[entity_name]
        entity['efficiency'] = int(entity['total_right_answers'] * 100 / (entity['total_right_answers'] + entity['total_wrong_answers'])) if entity['total_games'] > 0 else 0

    # Sort the leaderboard data by total score in descending order
    leaderboard_data = sorted(entity_data.values(), key=lambda x: x['total_score'], reverse=True)

    # Get the rank for each entity
    for i, entity in enumerate(leaderboard_data):   
        entity['rank'] = i + 1

    response = {
        'statusCode': 200,
        'body': json.dumps(leaderboard_data, default=str),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # You can restrict this to specific domains if needed
            'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    }
    
    print("response")
    print(response)

    return response


def get_entity_stats(filter_expression):
    # Query the leaderboard data from DynamoDB
    response = table.scan(
        FilterExpression=filter_expression,
        ProjectionExpression='entity_name, entity_id, score, right_answers, wrong_answers, category, entity_type, create_time, game_id',
        Select='SPECIFIC_ATTRIBUTES'
    )

    # Get the data for the specified entity
    entity_data = response['Items']

    response = {
        'statusCode': 200,
        'body': json.dumps(entity_data, default=str),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # You can restrict this to specific domains if needed
            'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    }

    return response
    
def get_game_stats(filter_expression):
    # Query the leaderboard data from DynamoDB
    
    
    if filter_expression:
        response = table.scan(
            FilterExpression=filter_expression,
            ProjectionExpression='entity_name, entity_id, score, right_answers, wrong_answers, category, entity_type, create_time, game_id',
            Select='SPECIFIC_ATTRIBUTES'
        )
    else:
        response = table.scan(
            ProjectionExpression='entity_name, entity_id, score, right_answers, wrong_answers, category, entity_type, create_time, game_id',
            Select='SPECIFIC_ATTRIBUTES'
        )        

    # Get the data for the specified entity
    entity_data = response['Items']

    response = {
        'statusCode': 200,
        'body': json.dumps(entity_data, default=str),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # You can restrict this to specific domains if needed
            'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    }

    return response
