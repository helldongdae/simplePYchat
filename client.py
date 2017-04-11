# Client program
import socket
import networkThread
import eventHandler

HOST = '127.0.0.1'    # The remote host
PORT = 3000              # The same port as used by the server
try:
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.connect((HOST, PORT))
except:
	print 'Can not connect to server'
	exit()
e = eventHandler.handler(s)
chatroom = []
myId = e.getId()
while True:
	print '\nWelcome Id:', myId, '!'
	print '1. Create a chatroom'
	print '2. Look for avalable chatrooms'
	print '3. Join a chatroom'
	print '4. Check for what chatrooms I am currently in'
	print '5. Check who is online'
	print '6. Invite someone to my chatroom'
	print '7. What chatrooms did I create?'
	print '8. Propagate a sentence'
	print '9. TERMINATE'
	choice = raw_input()
	try:
		choice = int(choice)
	except:
		print 'Invalid input'
		continue
	if choice == 1:
		print 'Room Name?'
		roomName = raw_input()
		if e.createChat(roomName) == '-1':
			print 'There already is a chatroom with that name'
		else:
			print 'Created a chatroom'

	elif choice == 2:
		avalableChatrooms = e.lookChat()
		if avalableChatrooms == '-1':
			print 'No chatrooms are currently avalable'
		else:
			avalableChatrooms = avalableChatrooms.split()
			print 'There are', len(avalableChatrooms), 'chatroom(s) avalable'
			for i in avalableChatrooms:
				print i

	elif choice == 3:
		print 'Type a chatroom name you want to join'
		roomName = raw_input()
		data = e.joinChat(roomName)
		if data == '-1':
			print 'chatroom with name', roomName, 'does not exist'
		else:
			chatroom.append(roomName)
			print 'To exit chatroom, type exit()'
			print data
			t = networkThread.thread(s)
			t.start()	
			while True: 			
				text = raw_input()
				if text == 'exit()':
					s.sendall('SEND_ME_EXIT_CODE')
					t.join()
					break
				s.sendall('NEW_CHAT '+roomName+' '+ text)

	elif choice == 4:
		if len(chatroom) == 0:
			print 'None'
		else:
			print 'You are in:'
			for i in chatroom:
				print i

	elif choice == 5:
		users = str(e.checkOnline()).split()
		for i in users:
			print 'Id', i, 'is ONLINE'

	elif choice == 6:
		users = e.checkOnline().split()
		for i in users:
			print 'Id', i, 'is ONLINE'
		print 'Who will you invite?'
		invite = raw_input()
		
	elif choice == 7:
		data = e.getOwnership()
		if data == ' ':
			print 'You do not own any chatroonms'
		else:
			ownership = data.split()
			for i in ownership:
				print 'You own', i
		
	elif choice == 8:
		if len(chatroom) == 0:
			print 'You do not belong to any chatroom'
		else:
			print 'What message are you going to propagate?'
			message = raw_input()
			print 'In what chatroom are you going to propagate this message?'
			print 'Please choose the chatroom number one by one to quit, type -1'
			to_send = ''
			arr = [False for i in range(len(chatroom))]
			for i in range(len(chatroom)):
				print str(i)+'.', chatroom[i]
			while True:
				n = raw_input()
				try:
					n = int(n)
				except:
					print 'Not a valid number'
					continue
				if n == -1:
					break
				if n >= len(arr):
					print 'Not a valid number'
					continue
				if arr[n]:
					print 'You already chose that chatroom'
					continue
				arr[n] = True
				to_send += chatroom[n]
			print to_send
			e.propagateMessage(to_send, message)
			
				
	elif choice == 9:
		exit()
	else:
		print 'Invalid input'
