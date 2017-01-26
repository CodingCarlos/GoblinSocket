
var Goblin = function(config) {

	var config = config;
	var socket = io();

	var goblin = {
		get: get,
		set: set,
		update: update,
		push: push,
		on: on,
		onAdd: onAdd,
		onUpdate: onUpdate,
		onDelete: onDelete,
		off: off,
		_client: {
			id: socket.io.engine.id
		},
		_emmit: _emmit
	};

	setTimeout(function() {
		// console.log(socket.io.engine.id);
		goblin._client.id = socket.io.engine.id;
	}, 0)

	return goblin;


	/**
	 *	Yes, I know that websockets are not the proper way to do 
	 *	the get, but this is just for fun, don't try to be the 
	 *	perfect db interface.
	 */
	function get(path, callback) {

		if(typeof path !== 'undefined' && typeof path === 'function') {
			// Empty call, just callback, so it cames in "path" param. Do the conversion.
			callback = path;
			path = '_all';
		} else if(typeof path === 'undefined') {
			path = '_all';
		}

		// If you are not listening for anything, I won't send the request.
		if(typeof callback === 'function') {

			// Emit the get
			_emmit('get', path);

			// Listen for get response
			on('get_resp', function(data){
				if(typeof data !== 'undefined' && typeof data._id !== 'undefined' && data._id === goblin._client.id) {
					callback(data.db);
					// Stop listening get responses
					socket.off('get_resp');
				}
			});
		}

		return false;
	}

	function set(data, callback) {
		return _emmit('set', data, callback);
	}

	function update(data, callback) {
		return _emmit('update', data, callback);
	}

	function push(data, callback) {
		return _emmit('push', data, callback);
	}

	function on(evt, callback) {

		var events = ['add', 'update', 'delete', 'change', 'get_resp'];

		if(events.indexOf(evt) === -1) {
			console.error('Unexpected method ' + evt + ' to listen. Currently supported methods are add, update and delete.');
			return;
		}

		if(typeof callback === 'function') {
			socket.on(evt, function(data){
				callback(data);
			});
		} else {
			console.warn('No function specified to execute on update. Listener have not been added.');
		}
	}

	function onAdd(callback) {
		on('add', callback);
		return false;
	}

	function onUpdate(callback) {
		on('update', callback);
		return false;
	}

	function onDelete(callback) {
		on('delete', callback);
		return false;
	}

	function onChange(callback) {
		on('change', callback);
		return false;
	}


	function off(evt) {
		if(typeof callback === 'undefined') {
			socket.off(evt);
		} else {
			socket.off(evt, callback);
		}
	}


	function _emmit(channel, msg, callback) {
		var result = socket.emit(channel, msg);

		if(typeof callback === 'function') {
			callback(result)
		}

		return result;
	}
}