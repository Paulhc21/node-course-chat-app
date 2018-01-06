const path = require( 'path' ),
      http = require( 'http' ),
      express = require( 'express' ),
      app = express(),
      socketIO = require( 'socket.io' );

const { generateMessage, generateLocationMessage } = require( './utils/message' );

const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
const server = http.createServer( app );
const io = socketIO( server );

app.use(express.static( publicPath ));

io.on('connection', ( socket ) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage( 'Admin', 'Welcome to the ExPeriEnce' ));

    socket.broadcast.emit('newMessage', generateMessage( 'Admin', 'A New Creature Arrived' ));

    socket.on('createMessage', ( message, callback ) => {
        console.log('Message created', message);

        io.emit('newMessage', generateMessage( message.from, message.text ));
        callback();
    });

    socket.on('createLocationMessage', ( coords ) => {
        io.emit('newLocationMessage', generateLocationMessage( 'Creature', coords.latitude, coords.longitude ))
    })

    socket.on('disconnect', ( reason ) => {
        console.log(`Customer left - ${ reason }`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});