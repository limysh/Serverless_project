import functions_framework
from google.cloud import firestore

@functions_framework.http
def get_user_by_uid(request):
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
        # Get the user UID from the request parameters
        user_uid = request.args.get('uid')

        if not user_uid:
            return {'error': 'User UID not provided'}, 400

        db = firestore.Client()

        users_collection_ref = db.collection('users')

        user_doc = users_collection_ref.document(user_uid).get()

        if not user_doc.exists:
            return {'error': 'User not found'}, 404

        user_data = user_doc.to_dict()
        headers = {
            'Access-Control-Allow-Origin': '*',
        }
        return user_data, 200, headers
    except Exception as e:
        print('Error retrieving user from Firestore:', str(e))
        return {'error': 'Failed to retrieve user'},404, headers
