import json
import time
from datetime import datetime
import re
from nba_api.live.nba.endpoints import scoreboard, playbyplay

def get_live_games():
    games_list = scoreboard.ScoreBoard().get_dict()['scoreboard']['games']
    game_ids = [game["gameId"] for game in games_list]
    return game_ids

if __name__ == "__main__":
    print(get_live_games())

