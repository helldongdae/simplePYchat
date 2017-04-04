# Client program
import socket
import threading

HOST = '127.0.0.1'    # The remote host
PORT = 3000              # The same port as used by the server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

def receiveThread():
	data = s.recv(1024)
	print data

while True:
	print '\nWelcome!'
	print '1. Create a chatroom'
	print '2. Look for avalable chatrooms'
	print '3. Join a chatroom'
	choice = input()
	if choice == 1:
		print 'Room Name?'
		roomName = raw_input()
		s.sendall('CREATE_CHATROOM '+roomName)
		print 'Created a chatroom'
	elif choice == 2:
		s.sendall('LOOK_CHATROOM')
		data = s.recv(1024)
		avalableChatrooms = str(data).split()
		if data == '-1':
			print 'No chatrooms are currently avalable'
		else:
			print 'There are', len(avalableChatrooms), 'chatroom(s) avalable'
			for i in avalableChatrooms:
				print i
	elif choice == 3:
		print 'Type a chatroom name you want to join'
		roomName = raw_input()
		s.sendall('JOIN_CHATROOM '+roomName)
		data = s.recv(1024)
		if data == '-1':
			print 'chatroom with name', roomName, 'does not exist'
		else:
			print 'To exit chatroom, type exit()'
			print data
			while True: 
				t = threading.Thread(target = receiveThread, args = ())
				t.start()
				text = raw_input()
				if text == 'exit()':
					break
				s.sendall('NEW_CHAT '+roomName+' '+ text)
	else:
		print 'Invalid input'
