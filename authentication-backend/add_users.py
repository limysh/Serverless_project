import functions_framework
from google.cloud import firestore
from firebase_admin import credentials, initialize_app, auth
from google.cloud import storage

@functions_framework.http
def add_user(request):
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
        # Get the user's data from the event
        data = request.get_json()
        print(data,"data>>>>>>>>>>")
        uid = data["uid"]
        display_name = data["display_name"]
        email = data["email"]
        photo_url = data["photo_url"]

        db = firestore.Client()

        users_collection_ref = db.collection('users')

        user_data = {
            'uid': uid,
            'display_name': display_name,
            'email': email,
            'photo_url': photo_url,
            'createdAt': firestore.SERVER_TIMESTAMP
        }

        users_collection_ref.document(uid).set(user_data)
        headers = {
            'Access-Control-Allow-Origin': '*',
        }
        return 'User data added to Firestore successfully!', 200, headers
    except Exception as e:
        print('Error adding user data to Firestore:', str(e))
        return str(e), 400, headers
