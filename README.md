# simplePYchat README

client.py is a python text-based chat system.


server.js is a server. Based on the Node.js platform

## SERVERSIDE##
Using Node.JS as its platform and javascript as its language


chatroom Object:
> 1. name
> 2. creator of the chatroom
> 3. chatlog
> 4. member of the chatroom


## SERVER API##
CREATE_CHATROOM
> client sends a message in a form of **CREATE_SERVER server_name**
> server splits the message and makes a chatroom based on the second operand.
> TODO: Should not accept an existing chatroom name as the second operand.


JOIN_CHATROOM
> client sends a message in a form of **JOIN_CHATROOM chatroom_name**
> server checks if there exist a chatroom named the second operand
> server will return -1 when there is no chatroom which such name
> server will add the client to the chatroom if there exist a chatroom with such name.

NEW_CHAT
> client sends a message in a form of **NEW_CHAT chat**
