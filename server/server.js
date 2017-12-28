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

    socket.on('disconnect', ( reason ) => {
        console.log(`Browser closed - ${ reason }`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});