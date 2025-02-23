from flask import Flask, jsonify
from random import randint, choice
import json
import time
from datetime import datetime
import re
from nba_api.live.nba.endpoints import scoreboard, playbyplay

app = Flask(__name__)

@app.route('/api/get-games', methods=['GET'])
def get_live_games():
    games_list = scoreboard.ScoreBoard().get_dict()['scoreboard']['games']
    games = [game for game in games_list]
    game_states = []
    for game in games:
        game_state = {
            "id": game["gameId"],
            "homeTeam": {
                "name": game["homeTeam"]["teamName"],
                "score": game["homeTeam"]["score"]
            },
            "awayTeam": {
                "name": game["awayTeam"]["teamName"],
                "score": game["awayTeam"]["score"]
            }
        }
        game_states.append(game_state)
    return jsonify(game_state)

@app.route('api/game-state', methods=['GET'])
def simulate_game_update(game_id):
    """Simulate NBA game updates"""
    games = scoreboard.ScoreBoard().get_dict()['scoreboard']['games']
    plays = playbyplay.PlayByPlay(game_id).get_dict()['actions']
    last_play = plays[-1]

    # Convert time into readible format
    clock = last_play["clock"]
    nums = re.findall(r"-?\d+\.?\d*", clock)
    gameTime = str(int(nums[0])) + ":" + str(float(nums[1])).zfill(2)

    game = (d for d in games if d.get('gameId') == game_id)
    game_state = {
        "homeTeam": {
            "name": game["homeTeam"]["teamName"],
            "score": game["homeTeam"]["score"],
            "possession": last_play['possession'] == game["homeTeam"]["teamId"]
        },
        "awayTeam": {
            "name": game["awayTeam"]["teamName"],
            "score": game["awayTeam"]["score"],
            "possession": last_play['possession'] == game["awayTeam"]["teamId"]
        },
        "quarter": last_play["period"],
        "timeRemaining": gameTime,
        "lastUpdate": datetime.now()
    }
       
    # Switch possession
    game_state["homeTeam"]["possession"] = not game_state["homeTeam"]["possession"]
    game_state["awayTeam"]["possession"] = not game_state["awayTeam"]["possession"]
    
    # Update timestamp
    game_state["lastUpdate"] = datetime.now().strftime("%H:%M:%S")
    
    # Print update (this would be sent to the frontend in a real implementation)
    return jsonify(game_state)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
