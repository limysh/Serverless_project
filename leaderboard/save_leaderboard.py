import json
import boto3
import uuid
import requests
from boto3.dynamodb.conditions import Attr
from datetime import datetime

LEADERBOARD_TABLE_NAME = "leaderboard"
RANKS_TABLE_NAME = "ranks"
TOP_ENTITIES_COUNT = 3  # Number of top entities to notify

# Create a DynamoDB resource
dynamodb = boto3.resource("dynamodb")
# Retrieve the DynamoDB tables
leaderboard_table = dynamodb.Table(LEADERBOARD_TABLE_NAME)
ranks_table = dynamodb.Table(RANKS_TABLE_NAME)
sns = boto3.client("sns")


def calculate_rank(entity_type, data):
    # Aggregate the scores for each entity
    entity_scores = {}
    entity_names = {}  # Store entity names corresponding to entity_id
    for entry in data:
        entity_id = entry["entity_id"]
        entity_name = entry["entity_name"]
        score = entry["score"]
        if entity_id in entity_scores:
            entity_scores[entity_id] += score
        else:
            entity_scores[entity_id] = score
            entity_names[entity_id] = entity_name

    # Sort the entities based on the aggregated scores in descending order
    sorted_entities = sorted(entity_scores.items(), key=lambda x: x[1], reverse=True)

    # Calculate rank for each entity
    ranks = []
    for idx, (entity_id, score) in enumerate(sorted_entities, start=1):
        ranks.append(
            {
                "entity_type": entity_type,
                "entity_id": entity_id,
                "entity_name": entity_names[entity_id],
                "rank": idx,
            }
        )
    return ranks


def save_ranks_to_dynamodb(ranks):
    with ranks_table.batch_writer() as batch:
        for rank in ranks:
            ranks_table.put_item(Item=rank)


def get_previous_ranks(entity_type):
    # Retrieve previous ranks from the ranks table for the specified entity_type
    response = ranks_table.scan(FilterExpression=Attr("entity_type").eq(entity_type))
    data_for_entity_type = response["Items"]

    # Create a dictionary to store previous ranks for each entity
    previous_ranks = {}
    for entry in data_for_entity_type:
        entity_id = entry["entity_id"]
        rank = entry["rank"]
        previous_ranks[entity_id] = rank

    return previous_ranks


def send_notification(entity_id, message):
    api_endpoint = (
        "https://ktucyenactcgyuulepml6kgitq0nyxib.lambda-url.us-east-1.on.aws/"
    )

    payload = {
        "queue_name": "RankChange",
        "message": {"id": entity_id, "message": message},
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(
            api_endpoint, data=json.dumps(payload), headers=headers
        )
        response_data = response.json()
        if response.status_code == 200:
            print(f"Notification sent to {entity_id}: {message}")
        else:
            print(
                f"Failed to send notification to {entity_id}. Error: {response_data.get('message')}"
            )
    except requests.exceptions.RequestException as e:
        print(f"Failed to send notification to {entity_id}. Error: {str(e)}")


def lambda_handler(event, context):
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        }
        return response

    data = json.loads(event["body"])

    entity_type = data["type"]
    entity_id = data["id"]
    game_id = data["game_id"]
    
    response = leaderboard_table.scan(
        FilterExpression=Attr("entity_id").eq(entity_id) & Attr("game_id").eq(game_id)
    )
    entity_exists = len(response["Items"]) > 0

    if entity_type == "team":
        if entity_exists:
            old_data = response["Items"][0]
            leaderboard_table.update_item(
                Key={"id": old_data["id"]},
                UpdateExpression="ADD score :score, right_answers :right_answers, wrong_answers :wrong_answers",
                ExpressionAttributeValues={
                    ":score": data["score"],
                    ":right_answers": data["right_answers"],
                    ":wrong_answers": data["wrong_answers"]
                }
            )
        else:
            # Team does not exist, create a new entry in the leaderboard table
            leaderboard_table.put_item(
                Item={
                    "id": uuid.uuid4().hex,
                    "game_id": game_id,
                    "entity_id": entity_id,
                    "entity_type": entity_type,
                    "entity_name": data["name"],
                    "score": data["score"],
                    "right_answers": data["right_answers"],
                    "wrong_answers": data["wrong_answers"],
                    "category": data["category"],
                    "create_time": int(datetime.timestamp(datetime.now())),
                }
            )
    else:
        # For entities other than 'team', directly save the data to the leaderboard table
        leaderboard_table.put_item(
            Item={
                "id": uuid.uuid4().hex,
                "game_id": game_id,
                "entity_id": entity_id,
                "entity_type": entity_type,
                "entity_name": data["name"],
                "score": data["score"],
                "right_answers": data["right_answers"],
                "wrong_answers": data["wrong_answers"],
                "category": data["category"],
                "create_time": int(datetime.timestamp(datetime.now())),
            }
        )

    # Retrieve data from the leaderboard table for the current entity_type
    response = leaderboard_table.scan(
        FilterExpression=Attr("entity_type").eq(data["type"])
    )
    data_for_entity_type = response["Items"]

    # Calculate ranks for the current entity_type
    ranks = calculate_rank(data["type"], data_for_entity_type)

    # Fetch previous ranks from the ranks table for the current entity_type
    previous_ranks = get_previous_ranks(data["type"])

    # Save the ranks to the 'ranks' table in DynamoDB
    save_ranks_to_dynamodb(ranks)

    # Check for rank changes and send notifications to the top 3 entities
    top_entities = ranks[:TOP_ENTITIES_COUNT]
    for rank_entry in top_entities:
        entity_id = rank_entry["entity_id"]
        current_rank = rank_entry["rank"]
        previous_rank = previous_ranks.get(entity_id, 0)
        if current_rank != previous_rank:
            rank_change_message = f"Congratulations! You are now ranked {current_rank} in the leaderboard."
            send_notification(entity_id, rank_change_message)
        previous_ranks[entity_id] = current_rank

    response = {
        "statusCode": 200,
        "body": json.dumps({"message": "Leaderboard data saved successfully"}),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    }

    return response
