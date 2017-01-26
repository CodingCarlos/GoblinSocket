# GoblinSocket
WebSocket interface for GoblinDB using SocketIO

Actual code is not fully shipeable, just to use as in example. I am currently working on it, but... for now this is the mvp.

```
		<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
		<script src="js/goblin-socket.js"></script>
```

```
// Initialize GoblinDB
var gdb = new Goblin();

var counter = 0;

// Get the database value of counter
gdb.get('counter', function(data) {
		counter = data;
});

// Listen database changes. On change:
gdb.on('change', function(data) {
		counter = data.value.counter;
});

function add() {
		var newCounter = counter + 1;
		gdb.set({'counter': newCounter});
}
```
