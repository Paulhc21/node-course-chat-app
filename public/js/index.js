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

socket.on('newLocationMessage', function ( message ) {
    var li = $( '<li></li>' );
    var a = $( '<a target="_blank">My Current Location</a>' )


    li.text(`${ message.from }: `);
    a.attr('href', message.url);
    li.append(a);
    
    $( '#messages' ).append(li);
})

$('#message-form').on('submit', function ( event ) {
    event.preventDefault();

    socket.emit('createMessage', {
        from: 'Creature',
        text: $('[name=message]').val()
    }, function () {

    });
});

var locationButton = $( '#send-location' );

locationButton.on('click', function () {
    if ( !navigator.geolocation ) {
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function ( position ) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location, you must give us permision')
    })
})