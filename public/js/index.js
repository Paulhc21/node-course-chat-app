var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'Emily',
        text: 'Went to the gym today'
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function ( message ) {
    console.log('New message arrived', message);
});
