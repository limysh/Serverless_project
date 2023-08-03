import functions_framework
from google.cloud import firestore

@functions_framework.http
def get_users_by_uids(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
    }
    try:
        if request.method == "OPTIONS":
            # Allows GET requests from any origin with the Content-Type
            # header and caches preflight response for an 3600s
            main_headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "3600",
            }
            return ("", 204, main_headers)
        # Get the list of UIDs from the request JSON payload
        uids = request.get_json()

        if not isinstance(uids, list):
            return {'error': 'Invalid JSON payload, expecting a list of UIDs'}, 400

        # Create a Firestore client
        db = firestore.Client()

        # Create a reference to the "users" collection
        users_collection_ref = db.collection('users')

        users_data = {}

        # Loop through each UID and retrieve the corresponding user data
        for uid in uids:
            user_doc = users_collection_ref.document(uid).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                users_data[uid] = user_data
            else:
                # If UID not found in Firestore, store None in the response for that UID
                users_data[uid] = None
        headers = {
            'Access-Control-Allow-Origin': '*',
        }
        return users_data, 200, headers
    except Exception as e:
        print('Error retrieving users from Firestore:', str(e))
        return {'error': 'Failed to retrieve users'}, 400, headers
