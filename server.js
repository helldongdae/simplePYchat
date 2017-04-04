// Server code
// To execute, simply type node server.js in the terminal
var net = require('net');
var sockets = new Array(100);
var chatrooms = [];
var connected = 0;

var svr = net.createServer(function(sock) {
    console.log('Connected: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets[connected] = sock;
    var clientId = connected;
    connected++;
    console.log(connected + ' Client(s) connected')
    sock.on('data', function(chunk) {
	var toText = chunk.toString('utf8');
	var operands = toText.split(' ');
	if(operands[0] == 'CREATE_CHATROOM'){
		console.log('Created chatroom named '+operands[1]+' created by '+clientId)
		var chatroom = {name:operands[1], creator:clientId, chatlog:' ', member:new Array(100)};
		chatroom.member[clientId] = 1;
		chatrooms.push(chatroom);
	}
	else if(operands[0] == 'LOOK_CHATROOM'){
		console.log('Id: '+clientId+' Requested list of chatrooms')
		if(chatrooms.length == 0)
			sock.write('-1');
		else{
			var sending = ''
			for(i = 0;i<chatrooms.length;i++){
				sending += chatrooms[i].name+' ';
			}
			sock.write(sending);
		}
	}
	else if(operands[0] == 'JOIN_CHATROOM'){
			var idx = -1;
			for(i = 0;i<chatrooms.length;i++){
				if(chatrooms[i].name == operands[1]){
					idx = i;
				}
			}
			if(idx == -1)
				sock.write('-1');
			else{
				chatrooms[idx].member[clientId] = 1;
				console.log('Id: '+clientId+' joined '+chatrooms[idx].name)
				sock.write(chatrooms[idx].chatlog);
			}
	}
	else if(operands[0] == 'NEW_CHAT'){
			var idx = -1;
			for(i = 0;i<chatrooms.length;i++){
				if(chatrooms[i].name == operands[1]){
					idx = i;
				}
			}
			var typed = ''
			for(i = 2;i<operands.length;i++){
				typed+=operands[i]+' '
			}
			console.log('Id: '+clientId+' typed '+typed)
			chatrooms[idx].chatlog+=typed+'\n';
			for(i = 0;i<chatrooms[idx].member.length;i++){
				if(chatrooms[idx].member[i] == 1 && i != clientId){
					sockets[i].write(typed);
					console.log('Sent: '+typed+' to '+i)
				}
			}
			
	}
    });

    // End of connection. delete all of the created sockets and exit
    sock.on('end', function() {
	console.log("Connetion Lost");
	connected--;
	var idx = sockets.indexOf(sock);
	console.log('Deleted '+idx)
	if(idx != -1)
		delete sockets[idx];
    });
    
});

var svraddr = '127.0.0.1';
var svrport = 3000;
 
svr.listen(svrport, svraddr);
console.log('Server Created at ' + svraddr + ':' + svrport + '\n');
