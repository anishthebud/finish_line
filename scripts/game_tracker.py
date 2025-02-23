import json
import time
from datetime import datetime

def simulate_game_update():
    """Simulate NBA game updates"""
    game_state = {
        "homeTeam": {
            "name": "Lakers",
            "score": 0,
            "possession": True
        },
        "awayTeam": {
            "name": "Warriors",
            "score": 0,
            "possession": False
        },
        "quarter": 1,
        "timeRemaining": "12:00",
        "lastUpdate": ""
    }
    
    while True:
        # Simulate score changes
        if game_state["homeTeam"]["possession"]:
            if random.random() < 0.4:  # 40% chance to score
                points = random.choice([2, 2, 2, 3])  # More likely to score 2 points
                game_state["homeTeam"]["score"] += points
        else:
            if random.random() < 0.4:
                points = random.choice([2, 2, 2, 3])
                game_state["awayTeam"]["score"] += points
                
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
    simulate_game_update()

