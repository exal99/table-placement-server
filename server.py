#! /usr/bin/env python3

import asyncio
import websockets
from collections import defaultdict

connections = defaultdict(set)

async def server(websocket, path):
    connections[path].add(websocket)
    print(f"Connection recived: {websocket}")
    async for message in websocket:
        for connection in connections[path]:
            print(f"Sending {message} to {connection}")
            await connection.send(message)
    
    print(f"Connection closed {websocket}")
    connections[path].remove(websocket)

start_server = websockets.serve(server, 'localhost', 1234)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()