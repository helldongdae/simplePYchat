# client event handler
import socket
import networkThread

class handler:
	def __init__(self, sock):
		self.s = sock

	def getId(self):
		data = self.s.recv(1024)
		return int(data)

	def createChat(self, roomName):
		self.s.sendall('CREATE_CHATROOM '+roomName)
		data = self.s.recv(1024)
		return str(data)

	def lookChat(self):
		self.s.sendall('LOOK_CHATROOM')
		data = self.s.recv(1024)
		return str(data)

	def joinChat(self, roomName):
		self.s.sendall('JOIN_CHATROOM '+roomName)
		data = self.s.recv(1024)
		return str(data)

	def checkOnline(self):
		self.s.sendall('GET_USERS')
		data = self.s.recv(1024)
		return str(data)

	def getOwnership(self):
		self.s.sendall('GET_OWNERSHIP')
		data = self.s.recv(1024)
		return str(data)
	
	def propagateMessage(self, send_to, message):
		send_list = send_to.split()
		print 'PROPAGATE_MESSAGE '+str(len(send_list))+' '+send_to+' '+message
		self.s.sendall('PROPAGATE_MESSAGE '+str(len(send_list))+' '+send_to+' '+message)
		
