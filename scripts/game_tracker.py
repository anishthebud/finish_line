import json
import time
from datetime import datetime
import re
from nba_api.live.nba.endpoints import scoreboard, playbyplay

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
    
    while True:
        """
        # Simulate score changes
        if game_state["homeTeam"]["possession"]:
            if random.random() < 0.4:  # 40% chance to score
                points = random.choice([2, 2, 2, 3])  # More likely to score 2 points
                game_state["homeTeam"]["score"] += points
        else:
            if random.random() < 0.4:
                points = random.choice([2, 2, 2, 3])
                game_state["awayTeam"]["score"] += points
        """
        
                
        # Switch possession
        game_state["homeTeam"]["possession"] = not game_state["homeTeam"]["possession"]
        game_state["awayTeam"]["possession"] = not game_state["awayTeam"]["possession"]
        
        # Update timestamp
        game_state["lastUpdate"] = datetime.now().strftime("%H:%M:%S")
        
        # Print update (this would be sent to the frontend in a real implementation)
        print(json.dumps(game_state))
        
        # Wait before next update
        time.sleep(3)

if __name__ == "__main__":
    game_id = "738647326734"
    simulate_game_update(game_id)

