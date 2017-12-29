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

    socket.emit('newMessage', {
        from: 'Paul',
        text: 'Will pick up food from Traders',
        createdAt: Date.now()
    });

    socket.on('createMessage', ( message ) => {
        console.log('Message created', message);
    });

    socket.on('disconnect', ( reason ) => {
        console.log(`Customer left - ${ reason }`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});