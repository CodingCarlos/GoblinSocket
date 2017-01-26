
/* GoblinDB WebSockets interface ^^ */

var project = require('pillars'),
	io = require('socket.io')(project.services.get('http').server);

var GDB = require("./node_modules/goblindb/goblin");
var http = require("http");

var goblinDB = GDB();


// Starting the project
project.services.get('http').configure({
	port: process.env.PORT || 3000
}).start();


// Static Files, like index.html in this case
var staticRoute = new Route({
	id: 'staticRoute',
	path: '/*:path',
	directory: {
		path: './public',
		listing: true
	}
});



// Listen input channels
io.on('connection', function(socket){

	socket.on('get', function(msg){
		console.log('Get: ');

		var get;

		if(msg === '_all') {
			get = goblinDB.get();
		} else {
			get = goblinDB.get(msg);
		}

		var res = {
			_id: socket.client.conn.id,
			db: get
		}

		console.log(res);
		console.log('------------');

		io.emit('get_resp', res);
	});

	socket.on('set', function(msg){
		console.log('Set: ');
		console.log(msg);

		goblinDB.set(msg);

		console.log('------------');
	});

	socket.on('update', function(msg){
		console.log('Update: ');
		console.log(msg);

		goblinDB.update(msg)
		
		console.log('------------');
	});

	socket.on('push', function(msg){
		console.log('Push: ');
		console.log(msg);

		goblinDB.push(msg);

		console.log('------------');
	});

});

// Send output data
goblinDB.on('add', function(db) {
	io.emit('add', db);
});

goblinDB.on('update', function(db) {
	io.emit('update', db);
});

goblinDB.on('delete', function(db) {
	io.emit('delete', db);
});

goblinDB.on('reconfigure', function(db) {
	io.emit('reconfigure', db);
});

goblinDB.on('change', function(db) {
	io.emit('change', db);
});


project.routes.add(staticRoute);
