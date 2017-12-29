const path = require( 'path' ),
      http = require( 'http' ),
      express = require( 'express' ),
      app = express(),
      socketIO = require( 'socket.io' );

const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
const server = http.createServer( app );
const io = socketIO( server );

app.use(express.static( publicPath ));

io.on('connection', ( socket ) => {
    console.log('New user connected');

    socket.on('createMessage', ( message ) => {
        console.log('Message created', message);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', ( reason ) => {
        console.log(`Customer left - ${ reason }`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});