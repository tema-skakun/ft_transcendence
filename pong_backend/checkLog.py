import json
import time

def recursiveJson(obj):
    print(type(obj))
    if isinstance(obj, str):
        try:
            obj = json.loads(obj)
            recursiveJson(obj)
        except:
            return obj
    elif isinstance(obj, list):
        return [recursiveJson(elem) for elem in obj]
    elif isinstance(obj, dict):
        for key in obj.keys:
            print('KEYYS:', key)
        return {key: recursiveJson(obj[key]) for key in obj.keys}
    else:
        return obj

def check_requirements(data):
    for entry in data:
        message = recursiveJson(entry['message'])
        # print('MESSAG', message)
    #     # Check pending match request and clients
    #     pending_match_request = message.get('Pending match request')
    #     if pending_match_request:
    #         clients = message['Clients']
    #         if len(clients) != 1 or clients[0] in message['Relations']:
    #             print(f"Error: Invalid pending match request or clients in entry")
    #             return False

    #     # Check running games
    #     running_games = json.loads(message['RunningGames'])
    #     relations = json.loads(message['Relations'])
    #     for game_id in running_games:
    #         if game_id not in running_games:
    #             print(f"Error: Game ID {game_id} is in running games but not in relations in entry ")
    #             return False

    #         game_data = json.loads(relations[game_id])
    #         if len(game_data) != 3 or game_data['gameState'] != "defined":
    #             print(f"Error: Invalid game data for game ID {game_id} in entry")
    #             return False

    #         # Check if a client is part of more than one game
    #         clients_in_game = [game_data['player1'], game_data['player2']]
    #         for other_game_id, other_game_data_str in relations.items():
    #             other_game_data = json.loads(other_game_data_str)
    #             if other_game_id == game_id:
    #                  continue

    #             other_clients_in_game = [other_game_data['player1'], other_game_data['player2']]
    #             for client in clients_in_game:
    #                 if client in other_clients_in_game:
    #                     print(f"Error: Client {client} is part of more than one game in entry")
    #                     return False

    # return True

while True:
    with open('reduced.json', 'r') as file:
        data = json.load(file)

    if not check_requirements(data):
        print("Error: Invalid entries found")
    else:
        print("All entries are valid")

    time.sleep(10)  # Check every 10 seconds