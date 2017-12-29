const path = require( 'path' ),
      http = require( 'http' ),
      express = require( 'express' ),
      app = express(),
      socketIO = require( 'socket.io' );

const generateMessage = require( './utils/message' ).generateMessage;

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
        callback('The server is sending this');
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', ( reason ) => {
        console.log(`Customer left - ${ reason }`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});