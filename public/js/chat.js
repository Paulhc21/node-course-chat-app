var socket = io();

function scrollToBottom () {
    //selectors
    var messages = $( '#messages' );
    var newMessage = messages.children('li:last-child');

    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var roomParams = $.deparam(window.location.search);

    socket.emit('join', roomParams, function ( err ) {
        if ( err ) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No Error!');
        }
    })
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('updateUserList', function ( users ) {
    var ol = $('<ol></ol>');

    users.forEach(function ( user ) {
        ol.append( $( '<li></li>' ).text( user ) );
    });

    $( '#users' ).html( ol );
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
    scrollToBottom();
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
    scrollToBottom();

    // var li = $( '<li></li>' );
    // var a = $( '<a target="_blank">My Current Location</a>' );

    // li.text(`${ message.from } ${ formattedTime }: `);
    // a.attr('href', message.url);
    // li.append(a);

})

$('#message-form').on('submit', function ( event ) {
    event.preventDefault();

    socket.emit('createMessage', {
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