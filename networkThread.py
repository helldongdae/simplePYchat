import threading

class thread(threading.Thread):
 	def __init__(self, sock):
        	threading.Thread.__init__(self)
		self._stop = threading.Event()
		self.s = sock

	def run(self):
		data = self.s.recv(1024)
		if data == 'exit()':
			return
		print data
		return thread(self.s).start()

    	def stop(self):
    	    self._stop.set()
	
