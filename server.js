// Server code
// To execute, simply type node server.js in the terminal
var net = require('net');
var sockets = new Array(100);
var active_user = new Array(100);
var chatrooms = [];
var connected = 0;

var svr = net.createServer(function(sock) {
    console.log('Connected: ' + sock.remoteAddress + ':' + sock.remotePort);
    var clientId = 0;
    for(i = 0;i<100;i++){
	if(sockets[i] == null){
		clientId = i;
		break;
	}
    }
    sock.write(clientId.toString());
    active_user[clientId] = 1;
    sockets[clientId] = sock;
    connected++;
    console.log(clientId + ' joined!')
    console.log(connected + ' Client(s) connected')
    sock.on('data', function(chunk) {
	var toText = chunk.toString('utf8');
	var operands = toText.split(' ');
	if(operands[0] == 'CREATE_CHATROOM'){
		var dup = false;
		for(i = 0;i<chatrooms.length;i++){
			console.log(chatrooms[i].name)
			if(chatrooms[i].name == operands[1]){
				dup = true;
			}
		}
		if(dup){
			console.log('Requested to create '+operands[1]+' but chatroom with that name already exists')
			sock.write('-1');
		}
		else{
			console.log('Created chatroom named '+operands[1]+' created by '+clientId)
			var chatroom = {name:operands[1], creator:clientId, chatlog:' ', member:new Array(100)};
			chatroom.member[clientId] = 1;
			chatrooms.push(chatroom);
			sock.write('1');
		}
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
				typed+=operands[i]+' ';
			}
			console.log('Id: '+clientId+' typed '+typed)
			chatrooms[idx].chatlog+=clientId+": "+typed+'\n';
			for(i = 0;i<chatrooms[idx].member.length;i++){
				if(chatrooms[idx].member[i] == 1 && i != clientId){
					sockets[i].write(clientId+": "+typed);
					console.log('Sent: '+typed+' to '+i)
				}
			}
			
	}
	else if(operands[0] == 'GET_USERS'){
		console.log('Id: '+clientId+' requested list of active users')
		var active_users= '';
		for(i = 0;i<active_user.length;i++){
			if(active_user[i] == 1){
				active_users += i+' ';
			}
		}
		console.log(active_users)
		sock.write(active_users);
	}
	else if(operands[0] == 'SEND_ME_EXIT_CODE'){
		sock.write('exit()');
	}
	else if(operands[0] == 'GET_OWNERSHIP'){
		console.log('Id: '+clientId+' requested his ownership')
		var ownership = ' '
		for(i = 0;i<chatrooms.length;i++){
			if(chatrooms[i].creator == clientId)
				ownership += chatrooms[i].name + ' ';
		}
		sock.write(ownership);
	}
	else if(operands[0] == 'PROPAGATE_MESSAGE'){
		console.log('Id: '+clientId+' requested for propagation')
		var send_list = ''
		for (i = 0;i<parseInt(operands[1]);i++){
			send_list += operands[2+i];
		}
		var message= ''
		for (i = parseInt(operands[1])+2;i<operands.length;i++){
			message += operands[i]
		}
		console.log(send_list)
		console.log(message)
		send_list = send_list.split();
		for (i = 0;i<send_list.length;i++){}	
	}
    });

    // End of connection. delete all of the created sockets and exit
    sock.on('end', function() {
	console.log("Connetion Lost");
	connected--;
	var idx = sockets.indexOf(sock);
	active_user[idx] = -1
	console.log('Deleted '+idx)
	if(idx != -1)
		delete sockets[idx];
    });
    
});

var svraddr = '127.0.0.1';
var svrport = 3000;
 
svr.listen(svrport, svraddr);
console.log('Server Created at ' + svraddr + ':' + svrport + '\n');
