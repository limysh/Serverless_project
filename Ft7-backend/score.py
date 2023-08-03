from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
import requests

app = Flask(__name__)

cred = credentials.Certificate("C:\\Users\\AVuser\\Desktop\\spd 19\\csci5410-summer-23-sdp19\\Ft7-backend\\sdp-19-firebase-adminsdk-e51x6-10b557a74f.json")
firebase_admin.initialize_app(cred)

@app.route('/calculate_score', methods=['POST', 'OPTIONS'])
def calculate_score():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'POST',  
            'Access-Control-Allow-Headers': 'Content-Type', 
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
    }

    request_json = request.get_json()
    selected_indexes = request_json.get('selectedIndexes')

    # Initialize a score variable
    score = 0

    # Iterate over each key in selected_indexes and send a POST request
    for key in selected_indexes.keys():
        payload = {"questionNumber": int(key)}  # converting key string to integer
        response = requests.post('https://us-central1-sdp-19.cloudfunctions.net/edit_question', json=payload)
        response_json = response.json()  # get the response from the server as JSON

        # If the server's response matches the selected_indexes value, increment the score
        print(key,selected_indexes[key],response_json.get('correctAnswerIndex'))
        if response_json.get('correctAnswerIndex') == selected_indexes[key]:
            score += 1

    print(f'Total score: {score}')  # print the final score

    return (json.dumps({'Score': score}), 200, headers)

if __name__ == '__main__':
    app.run(debug=True)
