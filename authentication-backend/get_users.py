import functions_framework
from google.cloud import firestore

@functions_framework.http
def get_all_users(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
    }
    try:
        if request.method == "OPTIONS":
            # Allows GET requests from any origin with the Content-Type
            # header and caches preflight response for an 3600s
            main_headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "3600",
            }
            return ("", 204, main_headers)
        db = firestore.Client()

        users_collection_ref = db.collection('users')

        all_users = users_collection_ref.stream()

        # Prepare a list to store user data
        users_data = []

        # Loop through each document and append user data to the list
        for user_doc in all_users:
            user_data = user_doc.to_dict()
            users_data.append(user_data)
        headers = {
            'Access-Control-Allow-Origin': '*',
        }
        return {'users': users_data}, 200, headers
    except Exception as e:
        print('Error retrieving users from Firestore:', str(e))
        return str(e), 400, headers
