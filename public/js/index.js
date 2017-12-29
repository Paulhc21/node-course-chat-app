var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function ( message ) {
    console.log('New message arrived', message);

    var li = $( '<li></li>' );
    li.text(`${ message.from }: ${ message.text }`);

    $( '#messages' ).append(li);
});

$('#message-form').on('submit', function ( event ) {
    event.preventDefault();

    socket.emit('createMessage', {
        from: 'Creature',
        text: $('[name=message]').val()
    }, function () {

    });
});