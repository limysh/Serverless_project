import functions_framework
from google.cloud import firestore

@functions_framework.http
def update_user_by_uid(request):
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
        # Get the user data from the request JSON payload
        data = request.get_json()

        uid = data.get('uid')
        display_name = data.get('display_name')
        email = data.get('email')
        photo_url = data.get('photo_url')

        if not uid:
            return {'error': 'User UID not provided'}, 400

        db = firestore.Client()

        users_collection_ref = db.collection('users')

        user_doc = users_collection_ref.document(uid).get()

        if not user_doc.exists:
            return {'error': 'User not found'}, 404

        # Update the user document with the new data
        user_data = {
            'display_name': display_name,
            'email': email,
            'photo_url': photo_url
        }

        users_collection_ref.document(uid).set(user_data, merge=True)
        headers = {
            'Access-Control-Allow-Origin': '*',
        }
        return 'User data updated successfully', 200, headers
    except Exception as e:
        print('Error updating user data in Firestore:', str(e))
        return 'Failed to update user data', 400, headers
