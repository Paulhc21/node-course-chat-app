var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function ( message ) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $( '#message-template' ).html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $( '#messages' ).append(html);

    // var li = $( '<li></li>' );
    // li.text(`${ message.from } ${ formattedTime }: ${ message.text }`);

    // $( '#messages' ).append(li);
});

socket.on('newLocationMessage', function ( message ) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $( '#location-message-template' ).html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    $( '#messages' ).append(html);

    // var li = $( '<li></li>' );
    // var a = $( '<a target="_blank">My Current Location</a>' );

    // li.text(`${ message.from } ${ formattedTime }: `);
    // a.attr('href', message.url);
    // li.append(a);

})

$('#message-form').on('submit', function ( event ) {
    event.preventDefault();

    socket.emit('createMessage', {
        from: 'Creature',
        text: $('[name=message]').val()
    }, function () {
        $('[name=message]').val('');
    });
});

var locationButton = $( '#send-location' );

locationButton.on('click', function () {
    if ( !navigator.geolocation ) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function ( position ) {

        locationButton.removeAttr('disabled').text('Send Location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location, you must give us permision')
    });
});